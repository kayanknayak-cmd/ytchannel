import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat, beatsDuration, useLocal} from '../lib/timeline';
import {cues, VoWords} from '../lib/vo';
import vo from '../../../videos/01-the-7-5-cent-coin/voiceover/words.json';
import {Camera, Item, MarkerArrow, MarkerCircle, NewsScrap, Scrawl, Tape, TornReveal} from '../components/Collage';
import {Headline} from '../components/Clippings';
import {Stamp} from '../components/Text';
import {PhotoSlot} from '../components/PhotoSlot';

// Script #1, "The 7½¢ coin". Every event is keyed to a word in the owner's take (public/vo/01.words.json).
// Fact check: docs/videos/01-coke-coin.md.

const C = cues(vo as VoWords);

/** Treated public-domain photos. null = not sourced yet (animatic card). */
const P: Record<string, string | null> = {
  ike: 'videos/01-the-7-5-cent-coin/photos/ike.png', // Eisenhower official portrait (PD, US gov)
  ad: 'videos/01-the-7-5-cent-coin/photos/ad.png', // pre-1929 Coca-Cola print ad (PD)
  vending: 'videos/01-the-7-5-cent-coin/photos/vending.png', // 1950s Coca-Cola vending machine (LoC)
  nickel: 'videos/01-the-7-5-cent-coin/photos/nickel.png', // Jefferson nickel (US Mint, PD)
  dime: 'videos/01-the-7-5-cent-coin/photos/dime.png', // Roosevelt dime (US Mint, PD)
};

const Overlay: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;

const Ask: React.FC = () => {
  const L = useLocal();
  return (
    <>
      <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1}, {at: L(C.at('but')), x: 560, y: 900, zoom: 1.08}]}>
        <Item x={230} y={1500} rotate={7} enter="none" seed="np1" jitter={0.6}>
          <NewsScrap width={600} height={760} seed="coke-np1" />
        </Item>
        <Item x={560} y={700} rotate={-3} enter="none" seed="ike" jitter={0.8}>
          <TornReveal w={760} h={900} at={0} paper="aged" seed="ikeHole" open={1.3} cx={0.52} cy={0.42}>
            <PhotoSlot src={P.ike} label="Eisenhower official portrait" w={760} h={900} seed="ikeSlot" />
          </TornReveal>
        </Item>
        <Tape x={210} y={250} rotate={-36} at={4} seed="t1" />
        <Tape x={930} y={230} rotate={30} at={6} seed="t2" />
        <Scrawl x={820} y={1180} text="a new coin?!" size={70} at={L(C.at('invent'))} rotate={-8} color="#f4c430" />
        <Item x={820} y={1560} rotate={9} enter="slap" at={L(C.at('seven'))} seed="coin75" z={0.1}>
          <div style={{position: 'relative'}}>
            <PhotoSlot src={P.nickel} label="Jefferson nickel" w={420} h={420} seed="coin75slot" dark />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Headline text="7½¢" size={150} at={L(C.at('seven')) + 2} seed="75c" stocks={{'7½¢': 'red'}} />
            </div>
          </div>
        </Item>
      </Camera>
      <Overlay>
        <AbsoluteFill style={{top: 90, alignItems: 'center'}}>
          <Headline text="Coca-Cola asked" mode="words" size={84} at={0} seed="cc-asked" />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 1250, alignItems: 'flex-start', paddingLeft: 40}}>
          <Headline text="THE PRESIDENT" size={118} at={L(C.at('president'))} seed="president" maxWidth={640} align="flex-start" />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 560, left: 300}}>
          <Stamp text="Denied" at={L(C.at('no'))} size={140} rotate={-14} />
        </AbsoluteFill>
      </Overlay>
    </>
  );
};

const Why: React.FC = () => {
  const L = useLocal();
  return (
    <>
      <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1.02}, {at: L(C.at('their')), x: 520, y: 1000, zoom: 1.1, rot: -1}]}>
        <Item x={800} y={1500} rotate={-9} enter="none" seed="np2" jitter={0.6}>
          <NewsScrap width={620} height={720} seed="coke-np2" />
        </Item>
        <Item x={420} y={620} rotate={-5} enter="drop" at={0} seed="ad">
          <PhotoSlot src={P.ad} label="Coca-Cola ad, pre-1929" w={720} h={940} seed="adSlot" />
        </Item>
        <Tape x={110} y={180} rotate={-40} at={3} seed="t3" />
        <Item x={760} y={1420} rotate={-8} enter="drop" at={L(C.at('nickel'))} seed="nickel1" z={0.12}>
          <PhotoSlot src={P.nickel} label="Jefferson nickel" w={440} h={440} seed="nickelSlot1" dark />
        </Item>
        <MarkerCircle x={760} y={1420} rx={260} ry={255} at={L(C.at('nickel')) + 6} drawings={4} seed="nk" color="#d7382b" />
      </Camera>
      <Overlay>
        <AbsoluteFill style={{top: 170, alignItems: 'flex-end', paddingRight: 50}}>
          <Headline text="WHY?" size={210} at={L(C.at('why'))} seed="why" maxWidth={420} />
        </AbsoluteFill>
        <Scrawl x={760} y={1000} text="a soda company?" size={58} at={L(C.at('soda'))} rotate={6} color="#d7382b" />
        <AbsoluteFill style={{top: 1080, alignItems: 'flex-start', paddingLeft: 50}}>
          <Headline text="70+ years" mode="words" size={104} at={L(C.at('seventy'))} seed="70y" align="flex-start" />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 1700, left: 90}}>
          <Stamp text="Trapped" at={L(C.at('trapped'))} size={120} rotate={-6} />
        </AbsoluteFill>
      </Overlay>
    </>
  );
};

const Vending: React.FC = () => {
  const L = useLocal();
  return (
    <>
      <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1.04}, {at: L(C.at('raise')), x: 600, y: 860, zoom: 1.16}]}>
        <Item x={300} y={1560} rotate={-6} enter="none" seed="np3" jitter={0.6}>
          <NewsScrap width={560} height={640} seed="coke-np3" paper="aged" cols={2} />
        </Item>
        <Item x={560} y={900} rotate={2} enter="slideL" at={6} seed="vend">
          <PhotoSlot src={P.vending} label="1950s Coca-Cola vending machine" w={640} h={1180} seed="vendSlot" />
        </Item>
        <Tape x={290} y={330} rotate={-30} at={10} seed="t5" />
        <MarkerCircle x={688} y={1278} rx={62} ry={80} at={L(C.at('coin'))} drawings={3} seed="slot" color="#f4c430" width={11} />
        <MarkerArrow x1={930} y1={1060} x2={740} y2={1210} bend={0.3} at={L(C.at('coin')) + 4} drawings={3} color="#f4c430" width={10} />
        <Item x={900} y={1500} rotate={12} enter="pop" at={L(C.at('nickel', 1))} seed="nickel2" z={0.15}>
          <PhotoSlot src={P.nickel} label="Jefferson nickel" w={300} h={300} seed="nickelSlot2" dark />
        </Item>
      </Camera>
      <Overlay>
        <AbsoluteFill style={{top: 110, alignItems: 'center'}}>
          <Headline text="ONE COIN" size={150} at={L(C.at('one'))} seed="onecoin" />
        </AbsoluteFill>
      </Overlay>
    </>
  );
};

const Dime: React.FC = () => {
  const L = useLocal();
  return (
    <>
      <Camera keys={[{at: 0, x: 540, y: 960, zoom: 1.0}, {at: L(C.frames), x: 540, y: 940, zoom: 1.07}]}>
        <Item x={290} y={880} rotate={-6} enter="drop" at={0} seed="nickel3">
          <PhotoSlot src={P.nickel} label="Jefferson nickel" w={440} h={440} seed="nickelSlot3" dark />
        </Item>
        <Item x={790} y={900} rotate={7} enter="slap" at={L(C.at('dime'))} seed="dime">
          <PhotoSlot src={P.dime} label="Roosevelt dime" w={420} h={420} seed="dimeSlot" dark />
        </Item>
        <MarkerArrow x1={420} y1={640} x2={700} y2={660} bend={-0.35} at={L(C.at('doubling'))} drawings={3} color="#d7382b" width={12} />
        <Scrawl x={560} y={520} text="×2" size={130} at={L(C.at('doubling')) + 4} rotate={-8} color="#d7382b" />
      </Camera>
      <Overlay>
        <AbsoluteFill style={{top: 170, alignItems: 'center'}}>
          <Headline text="raise the price?" mode="words" size={92} at={0} seed="raise" />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 1170, left: 90, width: 400}}>
          <Headline text="5¢" size={150} at={4} seed="5c" maxWidth={400} />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 1170, left: 600, width: 420}}>
          <Headline text="10¢" size={150} at={L(C.at('dime'))} seed="10c" stocks={{'10¢': 'red'}} maxWidth={420} />
        </AbsoluteFill>
        <AbsoluteFill style={{top: 1480, alignItems: 'center'}}>
          <Headline text="DOUBLE" size={170} at={L(C.at('doubling'))} seed="double" />
        </AbsoluteFill>
      </Overlay>
    </>
  );
};

const secs = (a: number, b: number) => b - a;

export const cokeCoin: Beat[] = [
  {id: 'ask', seconds: secs(0, C.sec('but')), step: 2, paper: 'newsprint', exit: 'rip', render: Ask},
  {id: 'why', seconds: secs(C.sec('but'), C.sec('their')), step: 3, paper: 'aged', exit: 'slide', render: Why},
  {id: 'vending', seconds: secs(C.sec('their'), C.sec('raise')), step: 2, paper: 'kraft', exit: 'rip', render: Vending},
  {id: 'dime', seconds: secs(C.sec('raise'), vo.duration), step: 2, paper: 'newsprint', render: Dime},
];
export const cokeCoinFrames = beatsDuration(cokeCoin);
