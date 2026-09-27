import {Config} from '@remotion/cli/config';

Config.setEntryPoint('engine/src/index.ts');
// Files the videos load (paper, photos, voiceovers) are gathered here by engine/tools/build_public.py.
Config.setPublicDir('engine/.public');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(16);
// Use the preinstalled headless shell when available (cloud env blocks the Chrome download).
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
