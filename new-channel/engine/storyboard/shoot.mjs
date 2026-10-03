import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}).catch(async()=>chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}));
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('console',m=>console.log(m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
for(const s of ['1','2','3','4','5','6','7']){await p.goto(`http://localhost:8765/index.html?s=${s}`);await p.waitForFunction('window.DONE',{timeout:120000});await p.screenshot({path:`out/${s}.png`});console.log('ok',s);}
await b.close();
