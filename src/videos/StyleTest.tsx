import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat} from '../lib/timeline';
import {
  Camera, Item, MarkerArrow, MarkerCircle, MarkerUnderline, NewsScrap, PaperShape, Photo, Scrawl, Tape, TornPaper, TornReveal,
} from '../components/Collage';
import {Headline} from '../components/Clippings';
import {Stamp, Typewriter} from '../components/Text';

// Style test on public-domain / CC0 photos (NASA astronaut + Hubble field, SpaceX Falcon 9,
// Greek coins from Pompeii; via scikit-image sample data). Claims kept minimal and true:
// - nearly every object in a Hubble deep field is a galaxy (a few are foreground stars)
// - the coins were found at Pompeii (scikit-image dataset description)

/** Screen-space layer above the camera, for titles that shouldn't zoom with the board. */
const Overlay: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;

/** Out-of-focus scraps near the lens: frame the shot and sell depth when the camera moves. */
const Foreground: React.FC<{corners: ('tl' | 'tr' | 'bl' | 'br')[]; seed: string}> = ({corners, seed}) => (
  <>
    {corners.map((c) => {
      const x = c.endsWith('l') ? -30 : 1110;
      const y = c.startsWith('t') ? -10 : 1930;
      return (
        <Item key={c} x={x} y={y} rotate={c === 'tl' || c === 'br' ? 24 : -22} enter="none" z={0.4} blur={5} jitter={0.8} seed={`${seed}-${c}`}>
          <TornPaper width={520} height={360} seed={`${seed}-${c}`} paper={c === 'tr' || c === 'bl' ? 'kraft' : 'newsprint'} />
        </Item>
      );
    })}
  </>
);

const Hook: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1.0}, {at: 108, x: 520, y: 900, zoom: 1.09}]}>
      <Item x={250} y={1400} rotate={8} enter="none" seed="np1" jitter={0.6}>
        <NewsScrap width={620} height={760} seed="np1" />
      </Item>
      <Item x={900} y={1700} rotate={-6} enter="none" seed="np2" jitter={0.6}>
        <NewsScrap width={560} height={640} seed="np2" paper="aged" cols={2} />
      </Item>
      <Item x={545} y={640} rotate={-4} enter="none" seed="rocket" jitter={0.8}>
        <TornReveal w={900} h={600} at={0} paper="aged" seed="rocketHole" open={1.35} cx={0.56} cy={0.45}>
          <Photo src="assets/test/rocket_torn.png" />
        </TornReveal>
      </Item>
      <Tape x={140} y={300} rotate={-38} at={0} seed="t1" />
      <Tape x={960} y={260} rotate={32} at={0} seed="t2" />
      <MarkerCircle x={545} y={630} rx={100} ry={260} at={40} drawings={5} seed="rc" color="#f4c430" />
      <Scrawl x={830} y={410} text="$$$ ?" size={84} at={52} rotate={-10} color="#f4c430" />
      <Item x={780} y={1450} rotate={0} enter="pop" at={10} seed="redDot" jitter={0.8}>
        <PaperShape w={600} h={600} paper="red" shape="circle" seed="redDot" />
      </Item>
      <Item x={770} y={1600} w={700} rotate={-4} enter="slideU" at={14} z={0.12} seed="astro">
        <Photo src="assets/test/astronaut_cut.png" />
      </Item>
      <Foreground corners={['bl', 'tr']} seed="fgHook" />
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 960, alignItems: 'flex-start', paddingLeft: 40, gap: 16}}>
        <Headline text="the price of" mode="words" size={80} at={2} seed="price" align="flex-start" maxWidth={560} />
        <Headline text="SPACE" size={170} at={6} seed="space" align="flex-start" maxWidth={620} />
      </AbsoluteFill>
    </Overlay>
  </>
);

const Deep: React.FC = () => (
  <>
    <Camera
      keys={[
        {at: 0, x: 540, y: 900, zoom: 1},
        {at: 30, x: 540, y: 900, zoom: 1.03},
        {at: 54, x: 300, y: 860, zoom: 2.5, rot: -2},
        {at: 108, x: 300, y: 860, zoom: 2.62, rot: -2},
      ]}
    >
      <Item x={540} y={900} w={1000} rotate={2} enter="fall" at={0} seed="hubble">
        <Photo src="assets/test/hubble.png" />
      </Item>
      <MarkerCircle x={166} y={851} rx={46} ry={44} at={60} drawings={4} width={6} seed="gal" color="#f4c430" />
      <MarkerArrow x1={330} y1={760} x2={220} y2={830} bend={-0.3} at={66} drawings={3} width={5} color="#f4c430" />
      <Scrawl x={380} y={735} text="a galaxy" size={34} at={70} rotate={-8} color="#f4c430" />
    </Camera>
    <Overlay>
      <Item x={540} y={1590} rotate={-2} enter="slideR" at={6} seed="deepStrip" jitter={0.6}>
        <TornPaper width={1060} height={400} seed="deepStrip" paper="newsprint" />
      </Item>
      <AbsoluteFill style={{top: 1440, alignItems: 'center', gap: 14}}>
        <Headline text="almost every dot" mode="words" size={80} at={12} seed="dot" />
        <Headline text="IS A GALAXY" size={140} at={18} seed="galaxy" rate={2} />
      </AbsoluteFill>
    </Overlay>
  </>
);

const Coins: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 520, y: 960, zoom: 1.04}, {at: 96, x: 600, y: 930, zoom: 1.08, rot: 1}]}>
      <Item x={300} y={1560} rotate={-7} enter="none" seed="np3" jitter={0.6}>
        <NewsScrap width={600} height={700} seed="np3" />
      </Item>
      <Item x={600} y={800} rotate={4} enter="none" seed="yBlock" jitter={0.6}>
        <PaperShape w={1020} h={860} paper="yellow" shape="rect" torn seed="yBlock" />
      </Item>
      <Item x={560} y={820} w={960} rotate={-3} enter="drop" at={8} seed="coins">
        <Photo src="assets/test/coins_torn.png" />
      </Item>
      <Tape x={110} y={470} rotate={-50} at={14} seed="t3" />
      <Tape x={1010} y={1180} rotate={-40} at={16} seed="t4" />
      <MarkerCircle x={960} y={880} rx={100} ry={98} at={44} drawings={4} seed="coin" color="#d7382b" width={10} />
      <Item x={560} y={1440} rotate={-1.5} enter="flip" at={16} seed="label" jitter={0.8}>
        <TornPaper width={860} height={230} seed="label" paper="white">
          <div style={{padding: '70px 60px'}}>
            <Typewriter at={26} size={54} cps={3} text="Greek coins found at" />
          </div>
        </TornPaper>
      </Item>
      <Foreground corners={['tl', 'br']} seed="fgCoins" />
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 1560, alignItems: 'center'}}>
        <Headline text="POMPEII" size={170} at={36} seed="pompeii" />
      </AbsoluteFill>
      <MarkerUnderline x={260} y={1800} w={560} at={58} drawings={3} />
    </Overlay>
  </>
);

const Outro: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 540, y: 1000, zoom: 1}, {at: 72, x: 540, y: 1040, zoom: 1.06}]}>
      <Item x={540} y={1180} rotate={0} enter="pop" at={0} seed="yDot" jitter={0.8}>
        <PaperShape w={860} h={860} paper="yellow" shape="circle" torn seed="yDot" />
      </Item>
      <Item x={540} y={1260} w={1000} rotate={-3} enter="drop" at={3} seed="astro2">
        <Photo src="assets/test/astronaut_cut.png" />
      </Item>
      <Foreground corners={['bl', 'br']} seed="fgOut" />
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 190, alignItems: 'center', gap: 20}}>
        <Headline text="FOLLOW" size={190} at={6} seed="follow" />
        <Headline text="for part two" mode="words" size={90} at={18} seed="p2" />
      </AbsoluteFill>
      <AbsoluteFill style={{top: 540, left: 700}}>
        <Stamp text="Soon" at={36} size={110} rotate={-14} />
      </AbsoluteFill>
    </Overlay>
  </>
);

export const styleTest: Beat[] = [
  {id: 'hook', seconds: 4.5, step: 2, paper: 'newsprint', exit: 'rip', render: Hook},
  {id: 'deep', seconds: 4.5, step: 3, paper: 'black', exit: 'slide', render: Deep},
  {id: 'coins', seconds: 4, step: 2, paper: 'kraft', exit: 'rip', render: Coins},
  {id: 'outro', seconds: 3, step: 3, paper: 'aged', render: Outro},
];
