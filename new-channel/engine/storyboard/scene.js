import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const W=1080,H=1920, shot=new URLSearchParams(location.search).get('s')||'A';
// Palette: ink set, bone objects, one reward color, one "you" color.
const P={ink:0x3F5E9E, bone:0xEDE5D8, slate:0xB9C3D3, gold:0xF2B33D, red:0xF04A2A, dark:0x1C2438};
const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
r.setSize(W,H); r.shadowMap.enabled=true; r.shadowMap.type=THREE.VSMShadowMap;
r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.0;
document.body.appendChild(r.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color(P.ink); scene.fog=new THREE.Fog(P.ink,14,30);
const cam=new THREE.PerspectiveCamera(26,W/H,0.1,100);

scene.add(new THREE.HemisphereLight(0xdfe8ff,0x5a74b0,0.7));
const key=new THREE.SpotLight(0xfff0dc,110,40,0.55,0.9,1.2); key.position.set(-4,11,7); key.castShadow=true;
key.shadow.mapSize.set(2048,2048); key.shadow.radius=10; key.shadow.blurSamples=16; key.shadow.bias=-0.0004; scene.add(key,key.target);
const rim=new THREE.DirectionalLight(0x8fb0ff,1.4); rim.position.set(5,4,-6); scene.add(rim);
const fill=new THREE.DirectionalLight(0xfff3e6,0.9); fill.position.set(4,2,6); scene.add(fill);

const mat=(c,ro=0.62)=>new THREE.MeshStandardMaterial({color:c,roughness:ro});
const M=(g,c,ro)=>{const m=new THREE.Mesh(g,c.isMaterial?c:mat(c,ro));m.castShadow=m.receiveShadow=true;return m;};
const floor=M(new THREE.PlaneGeometry(80,80),P.ink,0.9); floor.rotation.x=-Math.PI/2; scene.add(floor);
const S=(r,c,ro)=>M(new THREE.SphereGeometry(r,64,40),c,ro);

function pill(rad,h,bev){const p=[new THREE.Vector2(0,0)];
 for(let i=0;i<=10;i++){const a=-Math.PI/2+i/10*Math.PI/2;p.push(new THREE.Vector2(rad-bev+Math.cos(a)*bev,bev+Math.sin(a)*bev));}
 for(let i=0;i<=10;i++){const a=i/10*Math.PI/2;p.push(new THREE.Vector2(rad-bev+Math.cos(a)*bev,h-bev+Math.sin(a)*bev));}
 p.push(new THREE.Vector2(0,h));return new THREE.LatheGeometry(p,96);}
function person(c,{glasses=false}={}){const g=new THREE.Group();
 g.add(M(pill(0.4,1.45,0.2),c));const h=S(0.3,c);h.position.y=1.92;g.add(h);
 if(glasses)[-0.12,0.12].forEach(x=>{const l=M(new THREE.TorusGeometry(0.07,0.014,12,40),P.dark,0.3);l.position.set(x,1.95,0.29);g.add(l);});
 return g;}
function pigeon(){const g=new THREE.Group();
 const b=M(new THREE.CapsuleGeometry(0.3,0.32,16,48),P.slate);b.rotation.x=1.15;b.position.set(0,0.36,-0.05);g.add(b);
 const tail=M(new THREE.ConeGeometry(0.14,0.35,32),P.slate);tail.rotation.x=-1.9;tail.position.set(0,0.42,-0.55);g.add(tail);
 const h=S(0.19,P.slate);h.position.set(0,1.0,0.22);g.add(h);
 const bk=M(new THREE.ConeGeometry(0.045,0.14,24),P.gold,0.4);bk.rotation.x=Math.PI/2;bk.position.set(0,0.98,0.46);g.add(bk);
 [-0.085,0.085].forEach(x=>{const e=S(0.026,P.dark,0.2);e.position.set(x,1.05,0.38);g.add(e);});
 return g;}
function skinnerBox(){const g=new THREE.Group(),w=2.4,h=2.0,d=1.8,t=0.14;
 const slab=(sx,sy,sz,x,y,z)=>{const m=M(new RoundedBoxGeometry(sx,sy,sz,5,0.06),P.bone);m.position.set(x,y,z);g.add(m);};
 slab(w,t,d,0,t/2,0);slab(w,t,d,0,h,0);slab(t,h,d,-w/2,h/2,0);slab(t,h,d,w/2,h/2,0);slab(w,h,t,0,h/2,-d/2);
 const btn=M(pill(0.17,0.08,0.035),P.red,0.35);btn.rotation.x=Math.PI/2;btn.position.set(0.55,1.0,-d/2+0.07);g.add(btn);
 const dish=M(pill(0.22,0.07,0.03),P.dark,0.5);dish.position.set(0.55,t,-0.35);g.add(dish);
 const lamp=S(0.07,0xfff1c9);lamp.material.emissive=new THREE.Color(0xffd27a);lamp.material.emissiveIntensity=2;lamp.position.set(-0.6,1.75,-d/2+0.1);g.add(lamp);
 return g;}
const pellet=()=>{const m=S(0.06,P.gold,0.35);m.material.emissive=new THREE.Color(P.gold);m.material.emissiveIntensity=0.35;return m;};

const shots={
A:()=>{ // You're a scientist, and you've got a pigeon in a box.
 const b=skinnerBox();b.position.set(0.55,0,-0.4);b.rotation.y=-0.25;scene.add(b);
 const p=pigeon();p.position.set(0.35,0.14,-0.3);p.rotation.y=0.35;scene.add(p);
 const sc=person(P.bone,{glasses:true});sc.position.set(-1.05,0,1.1);sc.rotation.y=0.45;scene.add(sc);
 const hd=S(0.1,P.bone);hd.position.set(-0.6,1.15,1.45);scene.add(hd);
 key.target.position.set(0,0.8,0);cam.position.set(0.1,2.8,15.5);cam.lookAt(-0.2,1.5,0);},
B:()=>{ // Peck the button, get food.
 const b=skinnerBox();b.position.set(-0.3,0,0);scene.add(b);
 const p=pigeon();p.position.set(-0.35,0.14,-0.05);p.rotation.set(0.3,0.9,0);scene.add(p);
 [[0.55,0.3,-0.2],[0.65,0.55,-0.25],[0.5,0.8,-0.15]].forEach(([x,y,z])=>{const q=pellet();q.position.set(x,y,z);scene.add(q);});
 key.target.position.set(0,0.8,0);cam.position.set(1.2,1.7,8.4);cam.lookAt(-0.3,1.0,0);},
C:()=>{ // And the pigeon goes nuts.
 const b=skinnerBox();b.position.set(-0.3,0,0);scene.add(b);
 for(let i=0;i<3;i++){const p=pigeon();p.position.set(-0.35,0.14,-0.05);p.rotation.set(0.05+i*0.25,0.9,0);
  if(i<2)p.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.22+i*0.18;o.castShadow=false;}});scene.add(p);}
 for(let i=0;i<9;i++){const q=pellet();const a=i*1.3;q.position.set(0.5+Math.cos(a)*0.06*i,0.3+i*0.15,-0.2+Math.sin(a)*0.15);scene.add(q);}
 key.target.position.set(0,0.8,0);cam.position.set(1.2,1.7,8.4);cam.lookAt(-0.3,1.05,0);},
D:()=>{ // That's not a pigeon. That's you.
 const b=skinnerBox();b.scale.setScalar(1.25);b.position.set(0,0,-0.2);scene.add(b);
 const you=person(P.red);you.scale.setScalar(0.72);you.position.set(-0.25,0.17,0.0);you.rotation.y=-0.2;scene.add(you);
 const sc=person(P.bone,{glasses:true});sc.scale.setScalar(2.1);sc.position.set(1.9,0,-3.2);sc.rotation.y=-0.45;scene.add(sc);
 key.target.position.set(0,1,0);cam.position.set(-0.4,3.2,16);cam.lookAt(0.4,2.4,0);},
};
shots[shot]();

const comp=new EffectComposer(r);comp.addPass(new RenderPass(scene,cam));
const ao=new GTAOPass(scene,cam,W,H);ao.updateGtaoMaterial({radius:0.6,distanceExponent:1.5,thickness:1.5,scale:1.2});
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),0.12,0.4,1.2));
comp.addPass(new OutputPass());
comp.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;varying vec2 v;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 c=texture2D(tDiffuse,v);vec2 q=v-.5;q.x*=.62;float vg=smoothstep(.75,.2,length(q));c.rgb*=mix(.8,1.,vg);c.rgb+=(h(v*1000.)-.5)*.035;gl_FragColor=c;}'}));
comp.render(); window.DONE=true;
