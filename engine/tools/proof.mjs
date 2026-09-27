// Proof sheet: bundle once, render N stills per video at low res. Usage: node engine/tools/proof.mjs out/dir 02 03 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...ids] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('engine/src/index.ts'), publicDir: path.resolve('engine/.public')});
const browserExecutable = process.env.REMOTION_CHROME;
for (const n of ids) {
  const id = fs.readdirSync('videos').find((d) => d.startsWith(n + '-'));
  const comp = await selectComposition({serveUrl, id, browserExecutable});
  for (const f of [0.06, 0.25, 0.45, 0.65, 0.85]) {
    const frame = Math.floor(comp.durationInFrames * f);
    await renderStill({composition: comp, serveUrl, output: `${outDir}/${n}_${f}.png`, frame, scale: 0.25, browserExecutable});
  }
  console.log('proofed', id);
}
