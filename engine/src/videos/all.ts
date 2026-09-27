import {defineVideo, photo, VideoDef} from './registry';
import {Pic} from '../lib/spec';
import {VoWords} from '../lib/vo';
import v02 from '../../../videos/02-the-four-cent-penny/voiceover/words.json';
import v03 from '../../../videos/03-a-picture-of-nothing/voiceover/words.json';
import v04 from '../../../videos/04-death-by-molasses/voiceover/words.json';
import v05 from '../../../videos/05-too-much-gold/voiceover/words.json';
import v06 from '../../../videos/06-monopoly-was-a-warning/voiceover/words.json';
import v07 from '../../../videos/07-money-at-the-bottom-of-the-sea/voiceover/words.json';
import v08 from '../../../videos/08-the-kid-who-was-mailed/voiceover/words.json';
import v09 from '../../../videos/09-the-chocolate-bar-that-tastes-bad/voiceover/words.json';
import v10 from '../../../videos/10-lip-dip-paint/voiceover/words.json';
import v11 from '../../../videos/11-the-army-lost-to-emus/voiceover/words.json';
import v12 from '../../../videos/12-why-plane-windows-are-round/voiceover/words.json';
import v13 from '../../../videos/13-this-check-bought-alaska/voiceover/words.json';
import v14 from '../../../videos/14-unplug-the-batteries/voiceover/words.json';
import v15 from '../../../videos/15-the-moldy-cantaloupe/voiceover/words.json';
import v16 from '../../../videos/16-he-sold-the-eiffel-tower/voiceover/words.json';
import v17 from '../../../videos/17-tomato-pills/voiceover/words.json';
import v18 from '../../../videos/18-twenty-two-orphans/voiceover/words.json';

// Every cue is a word from the owner's take (videos/NN-*/voiceover/words.json).
// Photo aspect ratios come from the treated PNGs. On-screen text only restates verified claims
// (see each video's README for sources).

const pic = (id: string, name: string, aspect: number, extra: Partial<Pic> = {}): Pic => ({src: photo(id, name), aspect, ...extra});

const A = '02-the-four-cent-penny';
const v2 = defineVideo(A, v02 as VoWords, [
  {at: 'in', layout: 'hero', block: 'yellow', photo: pic(A, 'penny', 0.995, {enter: 'fall'}), title: {text: 'In 2024, one penny cost'}, big: {text: 'ALMOST 4¢', cue: 'almost', stock: 'red'}},
  {at: 'the mint', layout: 'stat', paper: 'kraft', photo: pic(A, 'mint', 1.076, {enter: 'drop', cue: 'mint'}), big: {text: '$85 MILLION', cue: 'million'}, stamp: {text: 'Lost', cue: 'lost', x: 330, y: 1000}},
  {at: 'a penny is', layout: 'hero', paper: 'aged', photo: pic(A, 'penny', 0.995, {enter: 'slap', mark: {cue: 'zinc', fx: 0.5, fy: 0.5, r: 0.42}}), big: {text: 'ZINC', cue: 'zinc'}, scrawl: {text: '97.5% zinc', cue: 'coat', x: 780, y: 170}},
  {at: 'so in', layout: 'hero', photo: pic(A, 'mint', 1.076, {enter: 'drop'}), title: {text: 'November 2025', cue: 'november'}, stamp: {text: 'The last one', cue: 'last', x: 200, y: 780}, big: {text: '232 YEARS', cue: '232'}},
  {at: 'oh', layout: 'pair', paper: 'kraft', photo: pic(A, 'penny', 0.995, {enter: 'drop', label: {text: '3.69¢'}}), photo2: pic(A, 'nickel', 0.993, {cue: 'fourteen', label: {text: '13.78¢', stock: 'red'}}), title: {text: 'and the nickel?'}, big: {text: 'LOSING MONEY', cue: 'losing'}},
]);

const B = '03-a-picture-of-nothing';
const v3 = defineVideo(B, v03 as VoWords, [
  {at: 'this', layout: 'hero', paper: 'black', photo: pic(B, 'deepfield', 1.147, {enter: 'reveal'}), title: {text: 'This is a picture of'}, big: {text: 'NOTHING', cue: 'nothing'}},
  {at: 'in 1995', layout: 'hero', paper: 'blue', photo: pic(B, 'hst', 1.232, {enter: 'fall'}), title: {text: 'Hubble, 1995', cue: '1995'}, scrawl: {text: 'empty sky?', cue: 'empty', x: 760, y: 1250}},
  {at: 'tiny', layout: 'hero', paper: 'kraft', photo: pic(B, 'dime', 1.002, {enter: 'slap'}), big: {text: 'A DIME AT 75 FT', cue: 'dime'}},
  {at: 'people said', layout: 'doc', photo: pic(B, 'hst', 1.232, {enter: 'drop'}), type: {text: 'People said it would be a waste of telescope time.', cue: 'people'}, stamp: {text: 'Did it anyway', cue: 'anyway', y: 520, x: 200}},
  {at: 'ten days', layout: 'stat', paper: 'black', photo: pic(B, 'deepfield', 1.147, {enter: 'drop'}), title: {text: '10 days', cue: 'ten'}, big: {text: '342 EXPOSURES', cue: 'exposures'}},
  {at: 'and almost every', layout: 'hero', paper: 'black', zoomOnMark: true, photo: pic(B, 'deepfield', 1.147, {enter: 'none', mark: {cue: 'galaxy', fx: 0.124, fy: 0.459, r: 0.05, color: '#f4c430'}}), scrawl: {text: 'a galaxy', cue: 'galaxy', x: 300, y: 520, color: '#f4c430'}, big: {text: '3,000 GALAXIES', cue: 'thousand'}},
]);

const Cm = '04-death-by-molasses';
const v4 = defineVideo(Cm, v04 as VoWords, [
  {at: '21', layout: 'hero', photo: pic(Cm, 'wreck', 1.257, {enter: 'reveal'}), title: {text: 'Boston, 1919'}, big: {text: 'MOLASSES', cue: 'molasses', stock: 'kraft'}},
  {at: 'january', layout: 'hero', paper: 'aged', photo: pic(Cm, 'eltrain', 1.335, {enter: 'drop'}), photo2: pic(Cm, 'globe', 4.947, {cue: 'burst'}), big: {text: '2.3 MILLION GALLONS', cue: 'million'}, scrawl: {text: '15 ft wave?', cue: 'feet', x: 790, y: 180}},
  {at: 'and that tank', layout: 'hero', paper: 'kraft', photo: pic(Cm, 'wreck', 1.257, {enter: 'drop', mark: {cue: 'leaking', fx: 0.3, fy: 0.45, r: 0.18}}), scrawl: {text: 'leaks?', cue: 'leaking', x: 300, y: 250}, stamp: {text: 'Painted brown', cue: 'brown', x: 200, y: 700}},
  {at: 'then the cold', layout: 'doc', paper: 'blue', photo: pic(Cm, 'eltrain', 1.335, {enter: 'drop'}), type: {text: 'Molasses gets thicker as it cools.', cue: ['molasses', 1]}, stamp: {text: 'Stuck', cue: 'stuck', x: 330, y: 520}},
]);

const D = '05-too-much-gold';
const v5 = defineVideo(D, v05 as VoWords, [
  {at: 'one', layout: 'hero', block: 'yellow', photo: pic(D, 'musa', 0.876, {enter: 'reveal'}), title: {text: 'So much gold, prices fell for'}, big: {text: '12 YEARS', cue: '12', stock: 'red'}},
  {at: 'mansa', layout: 'hero', paper: 'aged', photo: pic(D, 'musa', 0.876, {enter: 'drop'}), title: {text: 'Mansa Musa', cue: 'mansa'}, big: {text: 'KING OF MALI', cue: 'king'}},
  {at: '1324', layout: 'stat', paper: 'kraft', photo: pic(D, 'musa', 0.876, {enter: 'drop'}), title: {text: '1324, on the way to Mecca', cue: '1324'}, big: {text: '100 CAMELS', cue: 'hundred'}, scrawl: {text: 'by one account', cue: 'account', x: 760, y: 780}},
  {at: 'and he just', layout: 'hero', zoomOnMark: true, photo: pic(D, 'musa', 0.876, {enter: 'none', mark: {cue: 'hands', fx: 0.36, fy: 0.24, r: 0.1}}), big: {text: 'EVERYBODY', cue: 'everybody'}, scrawl: {text: 'officials! merchants!', cue: 'officials', x: 560, y: 560}},
  {at: 'so much gold hit', layout: 'doc', paper: 'aged', photo: pic(D, 'musa', 0.876, {enter: 'drop'}), type: {text: 'A historian writing twelve years later: it still had not recovered.', cue: 'historian'}, stamp: {text: 'Cheap', cue: 'cheap', x: 330, y: 600}},
]);

const E = '06-monopoly-was-a-warning';
const v6 = defineVideo(E, v06 as VoWords, [
  {at: 'monopoly', layout: 'hero', photo: pic(E, 'patent', 0.845, {enter: 'reveal'}), title: {text: 'Monopoly was invented as'}, big: {text: 'A WARNING', cue: 'warning', stock: 'red'}},
  {at: 'in 1904', layout: 'hero', paper: 'aged', photo: pic(E, 'magie', 0.866, {enter: 'drop'}), title: {text: 'Lizzie Magie, 1904', cue: '1904'}, big: {text: "LANDLORD'S GAME", cue: "landlord's"}},
  {at: 'to show how', layout: 'hero', paper: 'kraft', photo: pic(E, 'patent', 0.845, {enter: 'slap', mark: {cue: 'land', fx: 0.5, fy: 0.45, r: 0.3}}), big: {text: 'A FEW RICH', cue: 'rich'}, scrawl: {text: 'everyone else: broke', cue: 'broke', x: 560, y: 150}},
  {at: 'thirty years later', layout: 'doc', photo: pic(E, 'patent', 0.845, {enter: 'drop'}), type: {text: 'Charles Darrow sold his version to Parker Brothers. Said he came up with it.', cue: 'darrow'}, stamp: {text: 'His idea?', cue: 'came', x: 360, y: 600}},
  {at: 'they bought her', layout: 'stat', paper: 'aged', photo: pic(E, 'magie', 0.866, {enter: 'drop'}), big: {text: '$500', cue: 'five', stock: 'red'}, stamp: {text: 'Sold', cue: 'bought', x: 560, y: 1000}},
]);

const F = '07-money-at-the-bottom-of-the-sea';
const v7 = defineVideo(F, v07 as VoWords, [
  {at: 'one', layout: 'hero', photo: pic(F, 'yapstone', 0.999, {enter: 'reveal'}), title: {text: 'Rich because of a stone at the bottom of the'}, big: {text: 'OCEAN', cue: 'ocean', stock: 'blue'}},
  {at: 'on the island', layout: 'hero', paper: 'aged', photo: pic(F, 'yap1932', 0.714, {enter: 'drop', mark: {cue: 'taller', fx: 0.45, fy: 0.35, r: 0.3}}), title: {text: 'Yap', cue: 'yap'}, big: {text: 'STONE MONEY', cue: 'money'}},
  {at: 'everyone just', layout: 'doc', photo: pic(F, 'uap1903', 1.953, {enter: 'drop'}), type: {text: 'Everyone just remembered who owned which one.', cue: 'remembered'}},
  {at: 'and one stone', layout: 'hero', paper: 'blue', photo: pic(F, 'yapstone', 0.999, {enter: 'drop'}), scrawl: {text: 'sank on the trip home', cue: 'sank', x: 560, y: 150}, stamp: {text: 'Still counted', cue: 'counted', x: 220, y: 760}},
  {at: 'which honestly', layout: 'stat', paper: 'kraft', photo: pic(F, 'uap1903', 1.953, {enter: 'drop'}), big: {text: 'YOUR BANK', cue: 'bank'}},
]);

const G = '08-the-kid-who-was-mailed';
const v8 = defineVideo(G, v08 as VoWords, [
  {at: 'in', layout: 'hero', photo: pic(G, 'may', 0.632, {enter: 'reveal'}), title: {text: '1914: a family'}, big: {text: 'MAILED HER', cue: 'mailed', stock: 'red'}},
  {at: '53', layout: 'stat', paper: 'kraft', photo: pic(G, 'may', 0.632, {enter: 'drop'}), big: {text: '53¢', cue: '53', stock: 'red'}, scrawl: {text: 'stamps on her coat', cue: 'coat', x: 740, y: 820}},
  {at: 'parcel post', layout: 'doc', paper: 'aged', photo: pic(G, 'may', 0.632, {enter: 'slideL'}), type: {text: 'Parcel post was brand new. Nothing in the rules said you could not.', cue: 'parcel'}},
  {at: 'so', layout: 'hero', paper: 'aged', photo: pic(G, 'may', 0.632, {enter: 'drop'}), title: {text: 'May Pierstorff, age 5', cue: 'five'}, big: {text: '73 MILES', cue: '73'}, scrawl: {text: 'with a relative', cue: 'relative', x: 820, y: 1180}},
  {at: 'right after', layout: 'doc', photo: pic(G, 'may', 0.632, {enter: 'drop'}), type: {text: 'The Post Office banned mailing people.', cue: 'banned'}, stamp: {text: 'Banned', cue: 'banned', x: 320, y: 600}},
]);

const H = '09-the-chocolate-bar-that-tastes-bad';
const v9 = defineVideo(H, v09 as VoWords, [
  {at: 'you', layout: 'hero', block: 'red', photo: pic(H, 'drations', 2.043, {enter: 'reveal'}), title: {text: 'A chocolate bar that tastes bad'}, big: {text: 'ON PURPOSE', cue: 'purpose'}},
  {at: "that's", layout: 'stat', paper: 'kraft', photo: pic(H, 'drations', 2.043, {enter: 'drop'}), title: {text: 'the U.S. Army'}, big: {text: '1937', cue: '1937', stock: 'red'}},
  {at: 'the list', layout: 'doc', paper: 'aged', photo: pic(H, 'drations', 2.043, {enter: 'drop'}), type: {text: '4 ounces. Will not melt. Loaded with energy. Taste: "a little better than a boiled potato."', cue: 'list'}, scrawl: {text: 'potato?!', cue: 'potato', x: 800, y: 1750}},
  {at: 'because', layout: 'hero', photo: pic(H, 'drations', 2.043, {enter: 'drop', mark: {cue: 'save', fx: 0.5, fy: 0.3, r: 0.18}}), stamp: {text: 'Emergency only', cue: 'emergency', x: 160, y: 1000}, big: {text: 'SAVE IT', cue: 'save'}},
  {at: 'so what', layout: 'stat', paper: 'kraft', photo: pic(H, 'drations', 2.043, {enter: 'drop'}), big: {text: 'SO?', cue: ['what', 1]}},
]);

const I = '10-lip-dip-paint';
const v10d = defineVideo(I, v10 as VoWords, [
  {at: 'their', layout: 'hero', photo: pic(I, 'dials', 1.262, {enter: 'reveal'}), title: {text: 'Their bosses told them to'}, big: {text: 'LICK THE PAINT', cue: 'lick', stock: 'red'}},
  {at: 'in 1920s', layout: 'hero', paper: 'black', block: 'yellow', photo: pic(I, 'fryer', 0.78, {enter: 'drop'}), big: {text: 'RADIUM', cue: 'radium'}, scrawl: {text: 'glowing watch dials', cue: 'glowing', x: 560, y: 150}},
  {at: 'the brushes', layout: 'stat', paper: 'kraft', photo: pic(I, 'dials', 1.262, {enter: 'drop', mark: {cue: 'lips', fx: 0.55, fy: 0.55, r: 0.2}}), big: {text: 'LIP DIP PAINT', cue: 'lip'}},
  {at: 'the paint was', layout: 'doc', paper: 'aged', photo: pic(I, 'fryer', 0.78, {enter: 'drop'}), type: {text: 'The paint was radioactive. It settled in their bones.', cue: 'radioactive'}, stamp: {text: 'Radioactive', cue: 'radioactive', x: 200, y: 560}},
  {at: 'the companies', layout: 'stat', photo: pic(I, 'dials', 1.262, {enter: 'drop'}), title: {text: 'Catherine Donohue won her case', cue: 'catherine'}, big: {text: '1938', cue: '1938'}, scrawl: {text: 'she was 35', cue: 'thirty-five', x: 780, y: 800}},
]);

const J = '11-the-army-lost-to-emus';
const v11d = defineVideo(J, v11 as VoWords, [
  {at: 'in', layout: 'hero', block: 'yellow', photo: pic(J, 'emuhead', 1.247, {enter: 'fall'}), title: {text: '1932: machine guns vs.'}, big: {text: 'EMUS', cue: 'emus'}, stamp: {text: 'Lost', cue: 'lost', x: 560, y: 520}},
  {at: 'about', layout: 'stat', paper: 'kraft', photo: pic(J, 'soldiers', 1.724, {enter: 'drop'}), big: {text: '20,000 EMUS', cue: '20000'}, scrawl: {text: 'wheat farms', cue: 'wheat', x: 780, y: 900}},
  {at: 'so the army', layout: 'doc', paper: 'aged', photo: pic(J, 'soldiers', 1.724, {enter: 'drop'}), type: {text: '1 major. 2 soldiers. 2 machine guns. 10,000 rounds.', cue: 'major'}},
  {at: 'the emus split', layout: 'hero', photo: pic(J, 'emuhead', 1.247, {enter: 'slideL'}), big: {text: 'THEY RAN', cue: 'ran'}, scrawl: {text: 'one gun jammed', cue: 'jammed', x: 560, y: 150}, stamp: {text: 'Too slow', cue: 'slow', x: 300, y: 1000}},
  {at: 'the major said', layout: 'doc', paper: 'kraft', photo: pic(J, 'emuhead', 1.247, {enter: 'drop'}), type: {text: '"They can face machine guns with the invulnerability of tanks."', cue: ['major', 1]}},
]);

const K = '12-why-plane-windows-are-round';
const v12d = defineVideo(K, v12 as VoWords, [
  {at: 'airplane', layout: 'hero', paper: 'blue', photo: pic(K, 'comet', 1.316, {enter: 'reveal'}), title: {text: 'Airplane windows used to be'}, big: {text: 'SQUARE', cue: 'square'}},
  {at: 'then', layout: 'hero', photo: pic(K, 'comet2', 1.739, {enter: 'drop'}), big: {text: '1954', cue: '1954', stock: 'red'}, stamp: {text: 'Broke apart', cue: 'broke', x: 250, y: 780}, scrawl: {text: "world's first jet airliner", cue: 'first', x: 560, y: 150}},
  {at: 'investigators', layout: 'doc', paper: 'aged', photo: pic(K, 'comet2', 1.739, {enter: 'drop', mark: {cue: 'corners', fx: 0.46, fy: 0.46, r: 0.08}}), type: {text: 'Metal fatigue: tiny cracks grow at sharp corners, where stress piles up.', cue: 'fatigue'}},
  {at: 'on one plane', layout: 'hero', paper: 'blue', zoomOnMark: true, photo: pic(K, 'comet', 1.316, {enter: 'none', mark: {cue: 'roof', fx: 0.5, fy: 0.44, r: 0.07, color: '#f4c430'}}), scrawl: {text: 'the roof', cue: 'roof', x: 620, y: 520, color: '#f4c430'}, big: {text: 'ROUND CORNERS', cue: 'round'}},
  {at: 'so look', layout: 'stat', paper: 'kraft', photo: pic(K, 'comet', 1.316, {enter: 'drop'}), title: {text: 'the window next to you'}, big: {text: 'CORNERS?', cue: ['corners', 2]}},
]);

const L = '13-this-check-bought-alaska';
const v13d = defineVideo(L, v13 as VoWords, [
  {at: 'this', layout: 'hero', photo: pic(L, 'check', 2.02, {enter: 'reveal'}), title: {text: 'This check bought Alaska'}, big: {text: '$7.2 MILLION', cue: 'million', stock: 'red'}},
  {at: 'critics', layout: 'hero', paper: 'aged', photo: pic(L, 'seward', 0.975, {enter: 'drop'}), big: {text: "SEWARD'S FOLLY", cue: 'folly'}, scrawl: {text: 'icebox!', cue: 'icebox', x: 800, y: 160}},
  {at: 'then gold', layout: 'hero', paper: 'kraft', photo: pic(L, 'chilkoot', 1.254, {enter: 'drop'}), title: {text: 'Klondike, 1896', cue: 'klondike'}, big: {text: 'GOLD', cue: 'gold', stock: 'yellow'}},
  {at: 'almost', layout: 'stat', photo: pic(L, 'check', 2.02, {enter: 'drop'}), title: {text: '~600,000 square miles', cue: 'square'}, big: {text: '2¢ AN ACRE', cue: 'acre', stock: 'red'}},
]);

const M = '14-unplug-the-batteries';
const v14d = defineVideo(M, v14 as VoWords, [
  {at: 'in', layout: 'hero', photo: pic(M, 'telegraph', 1.13, {enter: 'reveal'}), title: {text: '1859: telegraph operators'}, big: {text: 'UNPLUGGED', cue: 'unplugged'}},
  {at: 'the power', layout: 'hero', paper: 'black', photo: pic(M, 'sunspots', 1.542, {enter: 'fall'}), title: {text: "Carrington's sunspot sketch, 1859"}, big: {text: 'THE SUN', cue: 'sun', stock: 'yellow'}, scrawl: {text: 'solar storm', cue: 'storm', x: 740, y: 1200}},
  {at: 'auroras', layout: 'stat', paper: 'blue', photo: pic(M, 'sunspots', 1.542, {enter: 'drop'}), title: {text: 'auroras as far south as'}, big: {text: 'CARIBBEAN', cue: 'caribbean'}},
  {at: 'telegraph lines', layout: 'hero', paper: 'aged', photo: pic(M, 'telegraph', 1.13, {enter: 'drop'}), stamp: {text: 'Haywire', cue: 'haywire', x: 250, y: 760}, scrawl: {text: 'sparks! fire!', cue: 'sparks', x: 560, y: 150}, big: {text: 'SHOCKED', cue: 'shocked', stock: 'red'}},
  {at: 'but between', layout: 'doc', photo: pic(M, 'telegraph', 1.13, {enter: 'drop'}), type: {text: 'Boston to Portland: the storm itself pushed current through the wires.', cue: 'boston'}},
]);

const N = '15-the-moldy-cantaloupe';
const v15d = defineVideo(N, v15 as VoWords, [
  {at: 'a', layout: 'hero', block: 'yellow', photo: pic(N, 'melon', 0.978, {enter: 'fall'}), title: {text: 'A moldy cantaloupe saved'}, big: {text: 'MILLIONS', cue: 'millions', stock: 'red'}},
  {at: '1943', layout: 'stat', paper: 'kraft', photo: pic(N, 'melon', 0.978, {enter: 'drop'}), title: {text: '1943, World War II', cue: '1943'}, big: {text: 'PENICILLIN', cue: 'penicillin'}, scrawl: {text: 'barely any', cue: 'barely', x: 780, y: 860}},
  {at: 'so a lab', layout: 'doc', paper: 'aged', photo: pic(N, 'melon', 0.978, {enter: 'drop'}), type: {text: 'Peoria, Illinois: a lab hunting for better mold. Soil. Fruit. Everything.', cue: 'lab'}},
  {at: 'the winner', layout: 'hero', photo: pic(N, 'melon', 0.978, {enter: 'slap', mark: {cue: 'rotten', fx: 0.5, fy: 0.55, r: 0.4}}), scrawl: {text: 'rotten!', cue: 'rotten', x: 800, y: 170}, big: {text: '200X MORE', cue: '200', stock: 'red'}},
  {at: 'and that strain', layout: 'stat', paper: 'kraft', photo: pic(N, 'melon', 0.978, {enter: 'drop'}), big: {text: 'MASS PRODUCTION', cue: 'mass'}},
]);

const O = '16-he-sold-the-eiffel-tower';
const v16d = defineVideo(O, v16 as VoWords, [
  {at: 'a', layout: 'hero', photo: pic(O, 'eiffel', 0.814, {enter: 'reveal'}), title: {text: 'A con man sold the Eiffel Tower'}, big: {text: 'TWICE', cue: 'twice', stock: 'red'}, scrawl: {text: 'well... 1.5', cue: 'half', x: 800, y: 1200}},
  {at: '1925', layout: 'hero', paper: 'aged', photo: pic(O, 'lustig', 0.708, {enter: 'drop', mark: {cue: 'victor', fx: 0.5, fy: 0.46, r: 0.16}}), big: {text: 'VICTOR LUSTIG', cue: 'victor'}, scrawl: {text: 'fake official', cue: 'official', x: 820, y: 180}},
  {at: 'tells', layout: 'hero', paper: 'kraft', photo: pic(O, 'eiffel', 0.814, {enter: 'drop'}), stamp: {text: 'For scrap', cue: 'scrap', x: 250, y: 700}, big: {text: 'TOP SECRET', cue: 'secret'}},
  {at: 'one dealer', layout: 'doc', photo: pic(O, 'eiffel', 0.814, {enter: 'drop'}), type: {text: 'One dealer bought it. And slipped him a bribe. Too embarrassed to call the police.', cue: 'dealer'}, stamp: {text: 'Paid', cue: 'bribe', x: 380, y: 600}},
  {at: 'so lustig', layout: 'hero', photo: pic(O, 'lustig', 0.708, {enter: 'drop'}), big: {text: 'AGAIN?', cue: 'again'}, stamp: {text: 'Failed', cue: 'work', x: 280, y: 760}},
]);

const P = '17-tomato-pills';
const v17d = defineVideo(P, v17 as VoWords, [
  {at: 'in', layout: 'hero', photo: pic(P, 'tomato', 0.659, {enter: 'reveal'}), title: {text: '1830s: sold at the pharmacy'}, big: {text: 'AS PILLS', cue: 'pills', stock: 'red'}},
  {at: 'an ohio', layout: 'doc', paper: 'aged', photo: pic(P, 'bottles', 1.494, {enter: 'drop'}), type: {text: 'Dr. John Cook Bennett: tomatoes for upset stomachs, indigestion, even jaundice.', cue: 'doctor'}},
  {at: 'he pushed', layout: 'hero', paper: 'kraft', photo: pic(P, 'tomato', 0.659, {enter: 'drop', mark: {cue: 'ketchup', fx: 0.6, fy: 0.84, r: 0.2}}), big: {text: 'KETCHUP', cue: 'ketchup', stock: 'red'}, scrawl: {text: 'as medicine', cue: 'medicine', x: 800, y: 180}},
  {at: 'then a drug', layout: 'stat', photo: pic(P, 'bottles', 1.494, {enter: 'drop'}), big: {text: 'TOMATO PILLS', cue: ['pills', 1]}, title: {text: 'ads everywhere', cue: 'ads'}},
  {at: 'it got so big', layout: 'doc', paper: 'aged', photo: pic(P, 'bottles', 1.494, {enter: 'drop'}), type: {text: 'Knockoffs flooded in. A lot of them had no tomato at all.', cue: 'knockoffs'}, stamp: {text: 'Fake', cue: ['even', 1], x: 380, y: 450}},
  {at: 'the fad', layout: 'stat', paper: 'kraft', photo: pic(P, 'tomato', 0.659, {enter: 'drop'}), big: {text: 'OVER BY 1850', cue: '1850'}},
]);

const Q = '18-twenty-two-orphans';
const v18d = defineVideo(Q, v18 as VoWords, [
  {at: 'in', layout: 'hero', photo: pic(Q, 'balmis', 0.985, {enter: 'reveal'}), title: {text: '1803: Spain shipped a vaccine inside'}, big: {text: '22 ORPHANS', cue: 'orphans', stock: 'red'}},
  {at: 'there was', layout: 'doc', paper: 'aged', photo: pic(Q, 'gillray', 1.378, {enter: 'drop'}), type: {text: 'No way to keep the vaccine alive on a long voyage. Except in a person.', cue: 'way'}},
  {at: 'so they gave', layout: 'stat', paper: 'kraft', photo: pic(Q, 'gillray', 1.378, {enter: 'drop', mark: {cue: 'cowpox', fx: 0.28, fy: 0.5, r: 0.12}}), big: {text: 'ARM TO ARM', cue: 'arm'}, scrawl: {text: 'cowpox', cue: 'cowpox', x: 780, y: 820}},
  {at: 'a nurse', layout: 'hero', paper: 'aged', photo: pic(Q, 'balmis', 0.985, {enter: 'drop'}), title: {text: 'Nurse Isabel Zendal kept them alive', cue: 'nurse'}, big: {text: 'IT WORKED', cue: 'worked', stock: 'red'}},
]);

export const VIDEOS: VideoDef[] = [v2, v3, v4, v5, v6, v7, v8, v9, v10d, v11d, v12d, v13d, v14d, v15d, v16d, v17d, v18d];
