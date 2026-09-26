import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat} from '../lib/timeline';
import {color, font} from '../lib/tokens';
import {useSteppedFrame} from '../lib/stepped';
import {Cutout} from '../components/Cutout';
import {TornSheet} from '../components/TornSheet';
import {Highlight, Ransom, SlamStrip, Stamp, Typewriter} from '../components/Text';
import {Bottle, Coin} from '../components/Illustrations';
import {Push, Stack} from '../components/Layout';

// "Why a Coke cost 5¢ for 73 years"
// Sources: Levy & Young (2004), "The Real Thing: Nominal Price Rigidity of the
// Nickel Coke, 1886-1959", Journal of Money, Credit and Banking 36(4).
// See videos/nickel-coke.md for claim-by-claim fact check.

const Pop: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useSteppedFrame();
  if (f < at) return null;
  const d = Math.floor((f - at) / 2);
  const s = [1.4, 0.92, 1][Math.min(d, 2)];
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

const Hook: React.FC = () => (
  <Push>
    <Pop at={0}>
      <Cutout x={540} y={640} width={560} rotate={-8} seed="coin1" jitter={1.2}>
        <Coin />
      </Cutout>
    </Pop>
    <AbsoluteFill style={{alignItems: 'center', top: 1080, gap: 34}}>
      <SlamStrip text="A Coke cost 5¢" at={4} size={150} rotate={-3} />
      <SlamStrip text="for 73 years" at={26} size={150} fill={color.yellow} rotate={2} width={820} />
    </AbsoluteFill>
  </Push>
);

const Years: React.FC = () => {
  const f = useSteppedFrame();
  const p = Math.min(1, Math.max(0, (f - 8) / 64));
  const year = Math.round(1886 + (1959 - 1886) * p);
  return (
    <Push to={1.05}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 70}}>
        <TornSheet width={900} height={420} seed="years" fill={color.ink} style={{position: 'relative'}}>
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: font.headline, fontSize: 330, color: color.fiber, lineHeight: 1}}>{year}</div>
          </AbsoluteFill>
        </TornSheet>
        <div style={{fontFamily: font.headline, fontSize: 150, color: color.ink, textTransform: 'uppercase'}}>
          Price: <Highlight at={10} tint={color.red}>5¢</Highlight>
        </div>
        <Typewriter at={40} text="Two world wars. The Depression." size={52} cps={3} />
      </AbsoluteFill>
    </Push>
  );
};

const Contract: React.FC = () => (
  <Push to={1.06}>
    <Stack top={200} gap={60}>
      <SlamStrip text="Reason 1" at={2} size={110} width={560} fill={color.ink} ink={color.fiber} rotate={-2} />
    </Stack>
    <AbsoluteFill style={{alignItems: 'center', top: 560}}>
      <TornSheet width={860} height={1000} seed="doc" fill="#f7f2e6" sides={{top: true, bottom: true}} style={{position: 'relative', transform: 'rotate(1.5deg)'}}>
        <div style={{padding: '90px 80px'}}>
          <Typewriter at={8} size={54} cps={3} text={'BOTTLING AGREEMENT\n1899\n\nPrice of syrup\nsold to bottlers:\n'} />
          <div style={{marginTop: 20}}>
            <Typewriter at={44} size={80} cps={2} text="FIXED." />
          </div>
        </div>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
          <Stamp text="Locked in" at={66} size={120} />
        </AbsoluteFill>
      </TornSheet>
    </AbsoluteFill>
  </Push>
);

const Vending: React.FC = () => (
  <Push>
    <Stack top={200}>
      <SlamStrip text="Reason 2" at={2} size={110} width={560} fill={color.ink} ink={color.fiber} rotate={2} />
    </Stack>
    <Pop at={8}>
      <Cutout x={380} y={1000} width={300} rotate={-6} seed="bottle">
        <Bottle height={760} />
      </Cutout>
    </Pop>
    <Pop at={20}>
      <Cutout x={760} y={880} width={330} rotate={10} seed="coin2">
        <Coin size={330} />
      </Cutout>
    </Pop>
    <AbsoluteFill style={{alignItems: 'center', top: 1470, padding: '0 70px'}}>
      <div style={{fontFamily: font.headline, fontSize: 104, lineHeight: 1.1, textAlign: 'center', color: color.ink, textTransform: 'uppercase'}}>
        Vending machines took <Highlight at={40}>one coin</Highlight>
      </div>
    </AbsoluteFill>
  </Push>
);

const President: React.FC = () => (
  <Push to={1.05}>
    <AbsoluteFill style={{alignItems: 'center', top: 230, gap: 40}}>
      <Typewriter at={2} size={60} cps={3} text="So Coke asked the" />
      <Ransom text="President" at={10} size={96} />
    </AbsoluteFill>
    <Pop at={40}>
      <Cutout x={540} y={1180} width={480} rotate={6} seed="coin75">
        <Coin label="7½¢" ring="A COIN THAT NEVER EXISTED · " />
      </Cutout>
    </Pop>
    <AbsoluteFill style={{alignItems: 'center', top: 1560}}>
      <SlamStrip text="for a 7½¢ coin" at={54} size={120} fill={color.yellow} width={860} rotate={-2} />
    </AbsoluteFill>
  </Push>
);

const Outro: React.FC = () => (
  <Push to={1.04}>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 50}}>
      <Typewriter at={2} size={64} cps={3} text="The nickel Coke died in" />
      <Stamp text="1959" at={20} size={260} rotate={-6} />
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
      <div style={{fontFamily: font.type, fontSize: 30, color: 'rgba(27,26,23,0.65)'}}>Source: Levy &amp; Young (2004), JMCB</div>
    </AbsoluteFill>
  </Push>
);

export const nickelCoke: Beat[] = [
  {id: 'hook', seconds: 3.5, step: 2, render: Hook},
  {id: 'years', seconds: 4, step: 4, bg: color.paperDark, render: Years},
  {id: 'contract', seconds: 4.5, step: 3, bg: color.kraft, render: Contract},
  {id: 'vending', seconds: 4, step: 2, render: Vending},
  {id: 'president', seconds: 4.5, step: 2, bg: '#cfdbe6', render: President},
  {id: 'outro', seconds: 3, step: 3, render: Outro},
];
