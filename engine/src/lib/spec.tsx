import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat, useLocal} from './timeline';
import {cues, VoWords} from './vo';
import {
  Camera, CamKey, Enter, Item, MarkerArrow, MarkerCircle, MarkerUnderline, NewsScrap, PaperShape, Photo, Scrawl, Tape, TornPaper, TornReveal,
} from '../components/Collage';
import {Headline, STOCKS} from '../components/Clippings';
import {Stamp, Typewriter} from '../components/Text';

/**
 * Declarative shots. A video = a voiceover + a list of shots, each starting on a spoken word.
 * Every event inside a shot is keyed to a word too, so re-recording retimes the whole video.
 */

type Cue = string | [string, number]; // phrase, or [phrase, nth occurrence]
type Stock = keyof typeof STOCKS;

export type Pic = {
  src: string;
  /** width / height of the treated PNG. */
  aspect: number;
  enter?: Enter | 'reveal';
  /** Word the photo arrives on (default: shot start). */
  cue?: Cue;
  /** Hand-drawn circle on a feature of the photo: fx, fy in 0..1 of the photo box. */
  mark?: {cue: Cue; fx: number; fy: number; r?: number; color?: string};
  label?: {text: string; cue?: Cue; stock?: Stock};
};

export type Shot = {
  at: Cue;
  layout: 'hero' | 'pair' | 'stat' | 'doc';
  paper?: string;
  step?: 2 | 3 | 4;
  exit?: 'rip' | 'slide' | 'cut';
  photo?: Pic;
  photo2?: Pic;
  /** Small headline at the top (words mode). */
  title?: {text: string; cue?: Cue};
  /** Big clipping line (letters mode). */
  big?: {text: string; cue: Cue; stock?: Stock; y?: number};
  stamp?: {text: string; cue: Cue; x?: number; y?: number};
  scrawl?: {text: string; cue: Cue; x?: number; y?: number; color?: string};
  /** Typed note (doc layout, or a caption strip on others). */
  type?: {text: string; cue: Cue};
  /** Push the camera in on the photo's mark when it's drawn. */
  zoomOnMark?: boolean;
  /** Colour block behind a cutout. */
  block?: 'red' | 'yellow' | 'blue';
};

const RED = '#d7382b';
/** Hero photo width: 900px, narrower for tall photos so they stay clear of the captions. */
const heroW = (p: Pic) => Math.min(900, 1100 * p.aspect);
const YEL = '#f4c430';

export const buildVideo = (vo: VoWords, shots: Shot[], seed: string) => {
  const C = cues(vo);
  const at = (c: Cue | undefined, fallback: number) =>
    c === undefined ? fallback : typeof c === 'string' ? C.at(c) : C.at(c[0], c[1]);
  const secOf = (c: Cue) => (typeof c === 'string' ? C.sec(c) : C.sec(c[0], c[1]));
  const starts = shots.map((s, i) => (i === 0 ? 0 : secOf(s.at)));

  const beats: Beat[] = shots.map((shot, i) => {
    const s0 = starts[i];
    const s1 = i + 1 < shots.length ? starts[i + 1] : vo.duration;
    const id = `${seed}-${i}`;
    const Scene: React.FC = () => {
      const L = useLocal();
      const start = L(Math.round(s0 * 24));
      const end = L(Math.round(s1 * 24));
      const ev = (c: Cue | undefined, fb = start + 2) => Math.max(0, L(at(c, fb + Math.round(s0 * 24))));
      return <ShotView shot={shot} ev={ev} end={end} id={id} dark={shot.paper === 'black'} />;
    };
    return {id, seconds: s1 - s0, step: shot.step ?? (i % 2 ? 3 : 2), paper: shot.paper ?? 'newsprint', exit: shot.exit ?? (i % 3 === 1 ? 'slide' : 'rip'), render: Scene};
  });
  return beats;
};

const Overlay: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;

/** Photo placed on the board, with optional reveal, mark and label. Returns the photo box for marks. */
const PlacedPhoto: React.FC<{p: Pic; x: number; y: number; w: number; rot: number; ev: (c?: Cue, fb?: number) => number; id: string; dark: boolean}> = ({
  p, x, y, w, rot, ev, id, dark,
}) => {
  const h = w / p.aspect;
  const arrive = ev(p.cue, 0);
  const enter = p.enter ?? 'drop';
  const img = <Photo src={p.src} />;
  const mark = p.mark && (
    <MarkerCircle
      x={x - w / 2 + p.mark.fx * w}
      y={y - h / 2 + p.mark.fy * h}
      rx={(p.mark.r ?? 0.12) * w}
      ry={(p.mark.r ?? 0.12) * w * 0.85}
      at={ev(p.mark.cue)}
      drawings={4}
      seed={`${id}-mk`}
      color={p.mark.color ?? (dark ? YEL : RED)}
      width={11}
    />
  );
  return (
    <>
      {enter === 'reveal' ? (
        <Item x={x} y={y} rotate={rot} enter="none" seed={`${id}-ph`} jitter={0.8}>
          <TornReveal w={w} h={h} at={arrive} paper="aged" seed={`${id}-hole`} open={1.35} cx={0.52} cy={0.45}>
            <div style={{width: w}}>{img}</div>
          </TornReveal>
        </Item>
      ) : (
        <Item x={x} y={y} w={w} rotate={rot} enter={enter} at={arrive} seed={`${id}-ph`}>
          {img}
        </Item>
      )}
      {mark}
    </>
  );
};

const ShotView: React.FC<{shot: Shot; ev: (c?: Cue, fb?: number) => number; end: number; id: string; dark: boolean}> = ({shot, ev, end, id, dark}) => {
  const {photo, photo2} = shot;
  // camera: slow push; optional punch-in on the mark
  const keys: CamKey[] = [{at: 0, x: 540, y: 960, zoom: 1}];
  let focus: [number, number] | null = null;
  if (shot.layout === 'hero' && photo) {
    const w = heroW(photo), h = w / photo.aspect;
    const py = Math.min(820, 200 + h / 2);
    if (photo.mark) focus = [540 - w / 2 + photo.mark.fx * w, py - h / 2 + photo.mark.fy * h];
  }
  if (shot.zoomOnMark && focus && photo?.mark) {
    const m = ev(photo.mark.cue);
    keys.push({at: Math.max(1, m - 10), x: 540, y: 940, zoom: 1.04});
    keys.push({at: m + 12, x: focus[0], y: focus[1] + 180, zoom: 1.7, rot: -1.5});
    keys.push({at: Math.max(m + 13, end), x: focus[0], y: focus[1] + 180, zoom: 1.78, rot: -1.5});
  } else {
    keys.push({at: Math.max(2, end), x: 548, y: 930, zoom: 1.08});
  }
  const captionTop = shot.layout === 'stat' ? 1480 : 1330;

  return (
    <>
      <Camera keys={keys}>
        <Item x={230} y={1560} rotate={7} enter="none" seed={`${id}-np`} jitter={0.6}>
          <NewsScrap width={580} height={700} seed={`${id}-np`} paper={dark ? 'newsprint' : 'aged'} cols={dark ? 3 : 2} />
        </Item>
        {shot.layout === 'hero' && photo && (() => {
          const w = heroW(photo), h = w / photo.aspect;
          const py = Math.min(820, 200 + h / 2);
          return (
            <>
              {shot.block && (
                <Item x={560} y={py + 40} enter="pop" at={ev(photo.cue, 0)} seed={`${id}-blk`} jitter={0.6}>
                  <PaperShape w={Math.min(860, h * 0.9)} h={Math.min(860, h * 0.9)} paper={shot.block} shape="circle" torn seed={`${id}-blk`} />
                </Item>
              )}
              <PlacedPhoto p={photo} x={540} y={py} w={w} rot={-2.5} ev={ev} id={id} dark={dark} />
              {photo.enter !== 'reveal' && <Tape x={140} y={py - h / 2 + 30} rotate={-36} at={ev(photo.cue, 0) + 4} seed={`${id}-t1`} />}
              {photo.enter !== 'reveal' && <Tape x={950} y={py - h / 2 + 10} rotate={32} at={ev(photo.cue, 0) + 6} seed={`${id}-t2`} />}
              {photo2 && <PlacedPhoto p={{enter: 'slap', ...photo2}} x={800} y={Math.min(1560, py + h / 2 + 120)} w={380} rot={8} ev={ev} id={`${id}-b`} dark={dark} />}
            </>
          );
        })()}
        {shot.layout === 'pair' && photo && photo2 && (
          <>
            <PlacedPhoto p={photo} x={290} y={860} w={460} rot={-5} ev={ev} id={`${id}-a`} dark={dark} />
            <PlacedPhoto p={{enter: 'slap', ...photo2}} x={795} y={880} w={460} rot={6} ev={ev} id={`${id}-b`} dark={dark} />
            {photo2.cue && <MarkerArrow x1={420} y1={560} x2={690} y2={580} bend={-0.35} at={ev(photo2.cue) + 3} drawings={3} color={dark ? YEL : RED} width={12} />}
          </>
        )}
        {shot.layout === 'stat' && photo && (() => {
          const w = Math.min(880, 1000 * photo.aspect);
          return (
            <>
              <PlacedPhoto p={photo} x={540} y={1100} w={w} rot={-3} ev={ev} id={id} dark={dark} />
              <Tape x={540 - w / 2 + 40} y={1100 - w / photo.aspect / 2 + 10} rotate={-38} at={ev(photo.cue, 0) + 4} seed={`${id}-st1`} />
            </>
          );
        })()}
        {shot.layout === 'doc' && (() => {
          // sheet sized to the text: ~21 chars per line at 62px type
          const lines = shot.type ? Math.ceil(shot.type.text.length / 21) : 0;
          const sheetH = lines * 62 * 1.35 + 150;
          const pw = photo ? Math.min(880, 820 * photo.aspect) : 0;
          const ph = photo ? pw / photo.aspect : 0;
          const top = 180;
          const sheetY = photo ? Math.min(1640 - sheetH / 2, top + ph + sheetH / 2 - 40) : 960;
          return (
            <>
              {photo && <PlacedPhoto p={photo} x={540} y={top + ph / 2} w={pw} rot={2} ev={ev} id={id} dark={dark} />}
              {photo && <Tape x={540 + pw / 2 - 40} y={top + 20} rotate={34} at={ev(photo.cue, 0) + 5} seed={`${id}-dt`} />}
              {shot.type && (
                <Item x={540} y={sheetY} rotate={-1.5} enter="flip" at={ev(shot.type.cue) - 4} seed={`${id}-doc`} jitter={0.8}>
                  <TornPaper width={920} height={sheetH} seed={`${id}-doc`} paper="white">
                    <div style={{padding: '70px 64px'}}>
                      <Typewriter at={ev(shot.type.cue)} size={62} cps={3} text={shot.type.text} />
                    </div>
                  </TornPaper>
                </Item>
              )}
            </>
          );
        })()}
        {shot.scrawl && (
          <Scrawl x={shot.scrawl.x ?? 780} y={shot.scrawl.y ?? 300} text={shot.scrawl.text} size={62} at={ev(shot.scrawl.cue)} rotate={-8} color={shot.scrawl.color ?? (dark ? YEL : RED)} />
        )}
      </Camera>
      <Overlay>
        {shot.title && (
          <AbsoluteFill style={{top: 80, alignItems: 'center', padding: '0 40px'}}>
            <Headline text={shot.title.text} mode="words" size={80} at={ev(shot.title.cue, 0)} seed={`${id}-title`} />
          </AbsoluteFill>
        )}
        {shot.layout === 'pair' && photo?.label && (
          <AbsoluteFill style={{top: 1150, left: 60, width: 460}}>
            <Headline text={photo.label.text} size={130} at={ev(photo.label.cue ?? photo.cue, 0) + 2} seed={`${id}-la`} maxWidth={460} stocks={photo.label.stock ? {[photo.label.text]: photo.label.stock} : {}} />
          </AbsoluteFill>
        )}
        {shot.layout === 'pair' && photo2?.label && (
          <AbsoluteFill style={{top: 1150, left: 570, width: 460}}>
            <Headline text={photo2.label.text} size={130} at={ev(photo2.label.cue ?? photo2.cue) + 2} seed={`${id}-lb`} maxWidth={460} stocks={photo2.label.stock ? {[photo2.label.text]: photo2.label.stock} : {}} />
          </AbsoluteFill>
        )}
        {shot.big && (
          <AbsoluteFill style={{top: shot.big.y ?? (shot.layout === 'stat' ? 1480 : shot.layout === 'pair' ? 1450 : captionTop), alignItems: 'center', padding: '0 30px'}}>
            <Headline
              text={shot.big.text}
              size={shot.layout === 'stat' ? 200 : 150}
              at={ev(shot.big.cue)}
              seed={`${id}-big`}
              maxWidth={1020}
              rate={shot.big.text.length > 10 ? 2 : 1}
              stocks={shot.big.stock ? Object.fromEntries(shot.big.text.split(' ').map((w) => [w, shot.big!.stock!])) : {}}
            />
          </AbsoluteFill>
        )}
        {shot.type && shot.layout !== 'doc' && (
          <AbsoluteFill style={{top: 1700, alignItems: 'center'}}>
            <Typewriter at={ev(shot.type.cue)} size={48} cps={3} text={shot.type.text} style={{background: 'rgba(244,239,226,0.92)', padding: '10px 22px'}} />
          </AbsoluteFill>
        )}
        {shot.stamp && (
          <AbsoluteFill style={{top: shot.stamp.y ?? 560, left: shot.stamp.x ?? 330}}>
            <Stamp text={shot.stamp.text} at={ev(shot.stamp.cue)} size={130} rotate={-12} />
          </AbsoluteFill>
        )}
      </Overlay>
    </>
  );
};

export {MarkerUnderline};
