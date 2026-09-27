import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Headline, InkDefs} from '../components/Clippings';
import {Stepped} from '../lib/stepped';

/** Component lab: a still to eyeball clippings, papers and photo treatments. */
export const Lab: React.FC = () => (
  <Stepped step={2}>
    <AbsoluteFill>
      <InkDefs />
      <Img src={staticFile('paper/newsprint.jpg')} style={{position: 'absolute', width: '100%', height: '100%'}} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 120, gap: 90}}>
        <Headline text="A COKE COST 5¢" size={150} stocks={{'5¢': 'red'}} />
        <Headline text="for 73 years" size={130} seed="b" />
        <Headline text="Vending machines took one coin" mode="words" size={96} seed="w" />
        <Headline text="PRESIDENT" size={140} seed="p" />
      </AbsoluteFill>
    </AbsoluteFill>
  </Stepped>
);
