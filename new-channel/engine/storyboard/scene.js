import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const W=1080,H=1920, shot=new URLSearchParams(location.search).get('s')||'1';
const C={bg:0xF2E6D8, floor:0xEAD9C6, coat:0xFBF7F2, skin:0xF2C7A5, coral:0xFF6F59, teal:0x3AA597, mustard:0xF5B841, navy:0x2E3A59, pigeon:0x9AA8C4, pink:0xF4A7B9, glass:0xCFE8F5, gold:0xE8B04B};
const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
r.setSize(W,H); r.shadowMap.enabled=true; r.shadowMap.type=THREE.VSMShadowMap;
r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.05; r.outputColorSpace=THREE.SRGBColorSpace;
document.body.appendChild(r.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color(C.bg); scene.fog=new THREE.Fog(C.bg,14,30);
const pm=new THREE.PMREMGenerator(r); scene.environment=pm.fromScene(new RoomEnvironment(),0.04).texture; scene.environmentIntensity=0.55;
const cam=new THREE.PerspectiveCamera(30,W/H,0.1,100);
scene.add(new THREE.HemisphereLight(0xffffff,C.floor,0.9));
const sun=new THREE.DirectionalLight(0xfff1e0,2.4); sun.position.set(4,9,6); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); sun.shadow.radius=8; sun.shadow.bias=-0.0005;
Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8}); scene.add(sun);
const rim=new THREE.DirectionalLight(0xc9dcff,0.8); rim.position.set(-6,4,-5); scene.add(rim);

const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:0.55,metalness:0,...o});
function M(g,c,o){const m=new THREE.Mesh(g,c.isMaterial?c:mat(c,o));m.castShadow=m.receiveShadow=true;return m;}
const floor=M(new THREE.CircleGeometry(40,64),C.floor); floor.rotation.x=-Math.PI/2; scene.add(floor);

// rounded cylinder via lathe
function pill(rad,h,bevel){const p=[];p.push(new THREE.Vector2(0,0));
 for(let i=0;i<=8;i++){const a=-Math.PI/2+i/8*Math.PI/2;p.push(new THREE.Vector2(rad-bevel+Math.cos(a)*bevel,bevel+Math.sin(a)*bevel));}
 for(let i=0;i<=8;i++){const a=i/8*Math.PI/2;p.push(new THREE.Vector2(rad-bevel+Math.cos(a)*bevel,h-bevel+Math.sin(a)*bevel));}
 p.push(new THREE.Vector2(0,h));return new THREE.LatheGeometry(p,64);}
function person(body=C.coat,{glasses=false,scale=1}={}){const g=new THREE.Group();
 g.add(M(pill(0.42,1.5,0.22),body));
 const head=M(new THREE.SphereGeometry(0.34,48,32),C.skin); head.position.y=2.0; g.add(head);
 if(glasses){[-0.13,0.13].forEach(x=>{const l=M(new THREE.TorusGeometry(0.075,0.018,12,32),C.navy);l.position.set(x,2.03,0.32);g.add(l);});}
 const sh=M(new THREE.CircleGeometry(0.42,32),mat(0x000000,{transparent:true,opacity:0}));g.add(sh);
 g.scale.setScalar(scale);return g;}
function hand(c=C.skin){return M(new THREE.SphereGeometry(0.11,24,16),c);}
function pigeon(s=1){const g=new THREE.Group();
 const b=M(new THREE.SphereGeometry(0.36,48,32),C.pigeon);b.scale.set(1,0.9,1.15);b.position.y=0.36;g.add(b);
 const h=M(new THREE.SphereGeometry(0.2,40,24),C.pigeon);h.position.set(0,1.1,0.18);g.add(h);
 const beak=M(new THREE.ConeGeometry(0.06,0.16,20),C.mustard);beak.rotation.x=Math.PI/2;beak.position.set(0,1.08,0.42);g.add(beak);
 [-0.08,0.08].forEach(x=>{const e=M(new THREE.SphereGeometry(0.035,16,12),C.navy);e.position.set(x,1.15,0.35);g.add(e);});
 const neck=M(new THREE.TorusGeometry(0.14,0.03,12,32),C.teal,{roughness:0.3,metalness:0.2});neck.rotation.x=Math.PI/2;neck.position.set(0,0.74,0.12);g.add(neck);
 g.scale.setScalar(s);return g;}
function pellet(c=C.mustard){return M(new THREE.SphereGeometry(0.07,20,14),c);}
function button(c=C.coral){const g=new THREE.Group();g.add(M(pill(0.26,0.12,0.05),0xffffff));const t=M(pill(0.18,0.12,0.06),c);t.position.y=0.08;g.add(t);return g;}
function box(w=2.6,h=2.4,d=2.2){const g=new THREE.Group();
 const glass=new THREE.MeshPhysicalMaterial({color:C.glass,transmission:0.0,transparent:true,opacity:0.22,roughness:0.1,clearcoat:1});
 const shell=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,6,0.25),glass);shell.position.y=h/2;g.add(shell);
 const base=M(new RoundedBoxGeometry(w+0.2,0.25,d+0.2,4,0.1),C.navy);base.position.y=0.12;g.add(base);
 const lid=M(new RoundedBoxGeometry(w+0.2,0.18,d+0.2,4,0.08),C.navy);lid.position.y=h;g.add(lid);return g;}
function die(c=C.coat){const g=new THREE.Group();g.add(M(new RoundedBoxGeometry(0.5,0.5,0.5,5,0.12),c));
 const pip=(x,y,z)=>{const p=M(new THREE.SphereGeometry(0.045,12,8),C.navy);p.position.set(x,y,z);g.add(p);};
 pip(0,0,0.25);pip(-0.13,0.13,0.25);pip(0.13,-0.13,0.25);pip(0.25,0.12,0.12);pip(0.25,-0.12,-0.12);pip(0.12,0.25,0.12);pip(-0.12,0.25,-0.12);return g;}
function slot(){const g=new THREE.Group();
 const body=M(new RoundedBoxGeometry(2.2,3.0,1.4,6,0.35),C.coral);body.position.y=1.5;g.add(body);
 const top=M(new THREE.SphereGeometry(0.6,48,32,0,Math.PI*2,0,Math.PI/2),C.mustard);top.position.y=3.0;g.add(top);
 const win=M(new RoundedBoxGeometry(1.7,0.8,0.2,4,0.1),0xffffff);win.position.set(0,2.0,0.66);g.add(win);
 [C.teal,C.pink,C.mustard].forEach((c,i)=>{const b=M(new THREE.SphereGeometry(0.2,32,20),c,{roughness:0.25});b.position.set(-0.5+i*0.5,2.0,0.8);g.add(b);});
 const arm=M(new THREE.CylinderGeometry(0.05,0.05,1.1,16),0xdddddd,{metalness:0.6,roughness:0.25});arm.position.set(1.3,2.2,0);arm.rotation.z=-0.25;g.add(arm);
 const knob=M(new THREE.SphereGeometry(0.17,32,20),C.coral,{roughness:0.2});knob.position.set(1.44,2.75,0);g.add(knob);
 const tray=M(new RoundedBoxGeometry(1.5,0.3,0.5,4,0.1),C.navy);tray.position.set(0,0.6,0.75);g.add(tray);
 [0,1,2,3,4].forEach(i=>{const c=M(new THREE.CylinderGeometry(0.12,0.12,0.04,24),C.gold,{metalness:0.8,roughness:0.25});c.position.set(-0.4+i*0.2+Math.sin(i)*0.05,0.8+i*0.03,0.85);c.rotation.x=1.2;g.add(c);});
 return g;}
function floaters(n,c,spread=3,y0=1,y1=5,seed=1){let s=seed;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
 for(let i=0;i<n;i++){const m=M(new THREE.SphereGeometry(0.05+rnd()*0.12,20,14),[C.pink,C.teal,C.mustard,C.coral][i%4]);
  m.position.set((rnd()-0.5)*spread*2,y0+rnd()*(y1-y0),-1-rnd()*4);scene.add(m);}}

const S={
'1':()=>{ // "You're a scientist, and you've got a pigeon in a box."
 const b=box();b.position.set(0.7,0,-0.6);scene.add(b);const p=pigeon();p.position.set(0.7,0.25,-0.6);p.rotation.y=-0.5;scene.add(p);
 const sc=person(C.coat,{glasses:true});sc.position.set(-0.9,0,0.9);sc.rotation.y=0.5;scene.add(sc);
 const h=hand();h.position.set(-0.4,1.3,1.2);scene.add(h);
 const clip=M(new RoundedBoxGeometry(0.5,0.65,0.05,3,0.04),C.mustard);clip.position.set(-0.35,1.45,1.3);clip.rotation.set(-0.3,0.4,0.1);scene.add(clip);
 floaters(9,0,3.5,1,5,3);cam.position.set(0,2.8,13);cam.lookAt(0,1.9,0);},
'2':()=>{ // "Peck the button, get food."
 const p=pigeon(1.4);p.position.set(-0.3,0,0);p.rotation.set(0.35,0.4,0);scene.add(p);
 const bt=button();bt.scale.setScalar(1.6);bt.position.set(0.55,0,0.7);scene.add(bt);
 [[0.9,1.1],[1.2,1.6],[0.7,2.0],[1.4,2.4],[1.0,2.9]].forEach(([x,y],i)=>{const q=pellet();q.position.set(x,y,0.6+i*0.1);q.scale.setScalar(1.6);scene.add(q);});
 cam.position.set(0.5,1.6,5.2);cam.lookAt(0.3,1.0,0);},
'3':()=>{ // "It eats, gets full... Boring."
 scene.background=new THREE.Color(0xDCD6CF);scene.fog.color.set(0xDCD6CF);
 const b=box();scene.add(b);const p=pigeon(1.1);p.scale.set(1.35,0.95,1.35);p.position.set(0,0.25,0);scene.add(p);
 for(let i=0;i<22;i++){const q=pellet();q.position.set(Math.cos(i*2.4)*(0.5+i*0.03),0.32,Math.sin(i*2.4)*(0.5+i*0.03));scene.add(q);}
 const bt=button(0xB9B2AA);bt.position.set(0.8,0.25,0.6);scene.add(bt);
 cam.position.set(0,3.6,10);cam.lookAt(0,1.2,0);},
'4':()=>{ // "Now food comes at random."
 const p=pigeon(1.2);p.position.set(0,0,0);scene.add(p);
 [[-1.3,3.0,0.3,0.6],[1.2,2.4,0.8,-0.4],[-0.6,4.0,-0.6,1.1],[1.0,4.3,0.2,2.0]].forEach(([x,y,rx,ry])=>{const d=die();d.position.set(x,y,0);d.rotation.set(rx,ry,0.3);scene.add(d);});
 const q=pellet();q.scale.setScalar(2.4);q.position.set(0,2.6,0.5);scene.add(q);
 floaters(10,0,3,1,5.5,7);cam.position.set(0,2.6,8.5);cam.lookAt(0,2.3,0);},
'5':()=>{ // "And the pigeon goes nuts."
 const bt=button();bt.scale.setScalar(1.4);bt.position.set(0.5,0,0.6);scene.add(bt);
 for(let i=0;i<4;i++){const p=pigeon(1.3);p.position.set(-0.4+i*0.06,0,-i*0.02);p.rotation.set(0.1+i*0.18,0.35,0);
  if(i<3)p.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.18+i*0.12;o.castShadow=false;}});scene.add(p);}
 for(let i=0;i<14;i++){const q=pellet([C.mustard,C.coral][i%2]);const a=i*0.9;q.position.set(0.6+Math.cos(a)*(0.6+i*0.12),1+i*0.22,0.4+Math.sin(a)*0.5);scene.add(q);}
 cam.position.set(0.2,1.8,6);cam.lookAt(0.2,1.3,0);},
'6':()=>{ // "Casinos found it too... slot machine."
 const s=slot();s.position.set(0.3,0,0);s.rotation.y=-0.35;scene.add(s);
 const pp=person(C.teal);pp.position.set(-1.1,0,1.4);pp.rotation.y=0.9;scene.add(pp);
 floaters(12,0,4,1,6,11);cam.position.set(0,3,13);cam.lookAt(0,2,0);},
'7':()=>{ // "That's not a pigeon. That's you."
 const b=box(2.8,3.2,2.4);scene.add(b);const pp=person(C.teal);pp.position.set(0,0.25,0);pp.scale.setScalar(0.9);scene.add(pp);
 const bt=button();bt.position.set(0.7,0.25,0.7);scene.add(bt);
 const sc=person(C.coat,{glasses:true,scale:2.2});sc.position.set(1.4,0,-3.5);sc.rotation.y=-0.6;scene.add(sc);
 cam.position.set(-1,3,13);cam.lookAt(0.3,2.8,0);},
};
S[shot](); r.render(scene,cam); window.DONE=true;
