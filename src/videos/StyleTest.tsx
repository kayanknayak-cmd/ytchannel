import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat} from '../lib/timeline';
import {Camera, Item, MarkerArrow, MarkerCircle, MarkerUnderline, NewsScrap, Photo, Scrawl, Tape} from '../components/Collage';
import {Headline} from '../components/Clippings';
import {Stamp, Typewriter} from '../components/Text';
import {TornSheet} from '../components/TornSheet';

// Style test on public-domain / CC0 photos (NASA astronaut + Hubble field, SpaceX Falcon 9,
// Greek coins from Pompeii; via scikit-image sample data). Claims kept minimal and true:
// - nearly every object in a Hubble deep field is a galaxy (a few are foreground stars)
// - the coins were found at Pompeii (scikit-image dataset description)

/** Screen-space layer above the camera, for titles that shouldn't zoom with the board. */
const Overlay: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;

const Hook: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1.0}, {at: 108, x: 520, y: 900, zoom: 1.09}]}>
      <Item x={260} y={1420} rotate={8} enter="none" seed="np1" jitter={0.6}>
        <NewsScrap width={620} height={760} seed="np1" />
      </Item>
      <Item x={880} y={1660} rotate={-6} enter="none" seed="np2" jitter={0.6}>
        <NewsScrap width={560} height={640} seed="np2" paper="aged" cols={2} />
      </Item>
      <Item x={560} y={700} w={1020} rotate={-5} enter="drop" at={0} seed="rocket">
        <Photo src="assets/test/rocket_torn.png" />
      </Item>
      <Tape x={120} y={330} rotate={-38} at={6} seed="t1" />
      <Tape x={1000} y={300} rotate={32} at={8} seed="t2" />
      <MarkerCircle x={560} y={690} rx={105} ry={300} at={40} drawings={5} seed="rc" color="#f4c430" />
      <Scrawl x={850} y={420} text="$$$ ?" size={84} at={52} rotate={-10} color="#f4c430" />
      <Item x={760} y={1600} w={700} rotate={-4} enter="slideU" at={14} z={0.12} seed="astro">
        <Photo src="assets/test/astronaut_cut.png" />
      </Item>
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 930, alignItems: 'flex-start', paddingLeft: 40, gap: 16}}>
        <Headline text="the price of" mode="words" size={80} at={6} seed="price" align="flex-start" maxWidth={560} />
        <Headline text="SPACE" size={170} at={10} seed="space" align="flex-start" maxWidth={620} />
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
      <Item x={540} y={900} w={1000} rotate={2} enter="slap" at={0} seed="hubble">
        <Photo src="assets/test/hubble.png" />
      </Item>
      <MarkerCircle x={166} y={851} rx={46} ry={44} at={60} drawings={4} width={6} seed="gal" color="#f4c430" />
      <MarkerArrow x1={330} y1={760} x2={220} y2={830} bend={-0.3} at={66} drawings={3} width={5} color="#f4c430" />
      <Scrawl x={380} y={735} text="a galaxy" size={34} at={70} rotate={-8} color="#f4c430" />
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 1390, alignItems: 'center', gap: 14}}>
        <Headline text="almost every dot" mode="words" size={84} at={9} seed="dot" />
        <Headline text="IS A GALAXY" size={140} at={15} seed="galaxy" rate={2} />
      </AbsoluteFill>
    </Overlay>
  </>
);

const Coins: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 520, y: 960, zoom: 1.04}, {at: 96, x: 600, y: 930, zoom: 1.08, rot: 1}]}>
      <Item x={300} y={1500} rotate={-7} enter="none" seed="np3" jitter={0.6}>
        <NewsScrap width={600} height={700} seed="np3" />
      </Item>
      <Item x={560} y={820} w={960} rotate={-3} enter="drop" at={8} seed="coins">
        <Photo src="assets/test/coins_torn.png" />
      </Item>
      <Tape x={110} y={470} rotate={-50} at={14} seed="t3" />
      <Tape x={1010} y={1180} rotate={-40} at={16} seed="t4" />
      <MarkerCircle x={960} y={880} rx={100} ry={98} at={44} drawings={4} seed="coin" color="#f4c430" width={10} />
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 1330, alignItems: 'center'}}>
        <TornSheet width={860} height={250} seed="label" fill="#f4efe2" style={{position: 'relative', transform: 'rotate(-1.5deg)'}}>
          <div style={{padding: '70px 60px'}}>
            <Typewriter at={20} size={54} cps={3} text="Greek coins found at" />
          </div>
        </TornSheet>
        <div style={{marginTop: -30}}>
          <Headline text="POMPEII" size={170} at={34} seed="pompeii" />
        </div>
      </AbsoluteFill>
      <MarkerUnderline x={260} y={1790} w={560} at={56} drawings={3} />
    </Overlay>
  </>
);

const Outro: React.FC = () => (
  <>
    <Camera keys={[{at: 0, x: 540, y: 1000, zoom: 1}, {at: 72, x: 540, y: 1040, zoom: 1.06}]}>
      <Item x={540} y={1230} w={1000} rotate={-3} enter="drop" at={0} seed="astro2">
        <Photo src="assets/test/astronaut_cut.png" />
      </Item>
    </Camera>
    <Overlay>
      <AbsoluteFill style={{top: 200, alignItems: 'center', gap: 20}}>
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
