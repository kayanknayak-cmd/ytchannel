# 08 Free Chocolate (Shampanier, Mazar & Ariely 2007: 73% truffle at 15c vs 1c; 69% kiss at 14c vs free). VO cut at 32.35s.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(32.35); cyclorama(); world(); studio(0,0); studio(20,0); camera()
W=M['white']; G=M['gold']; INK=M['ink']; R=M['red']
choc=mat('choc','#5B3A29',0.45); foil=mat('foil','#C9CDD3',0.25,metal=0.9)
cube((3.0,0.9,0.9),(0,0.3,0.45),W,0.1)
cyl(0.3,0.03,(-0.7,0.25,0.9),G,0.01); tru=sphere(0.22,(-0.7,0.25,1.15),choc)
bm=bmesh.new(); prof=[(0,0),(0.2,0.0),(0.23,0.05),(0.2,0.12),(0.13,0.24),(0.06,0.34),(0.015,0.42),(0,0.44)]
bpy.ops.mesh.primitive_plane_add(size=1); kiss=bpy.context.object
for x,z in prof: bm.verts.new((x,0,z))
bm.verts.ensure_lookup_table()
for i in range(len(prof)-1): bm.edges.new((bm.verts[i],bm.verts[i+1]))
bmesh.ops.spin(bm,geom=bm.verts[:]+bm.edges[:],axis=(0,0,1),cent=(0,0,0),steps=64,angle=math.pi*2)
bmesh.ops.remove_doubles(bm,verts=bm.verts[:],dist=0.0005); bm.to_mesh(kiss.data); bm.free(); done(kiss,foil); kiss.location=(0.7,0.25,0.9)
def tag(x):
    e=empty('tag',loc=(x,-0.22,0.9)); cyl(0.015,0.12,(0,0,0),W,0.0,e); cube((0.5,0.04,0.28),(0,0,0.26),W,0.03,e); return e
tl,tr=tag(-0.7),tag(0.7)
def label(e,s,m,t_on=None,t_off=None):
    o=text(s,(0,-0.03,0.26),m,0.17,e); 
    if t_on is not None: pop(o,t_on)
    if t_off is not None: unpop(o,t_off)
    return o
a=label(tl,'15¢',INK,None,15.2); b=label(tr,'1¢',INK,None,16.9)
label(tl,'14¢',INK,15.3,29.9); label(tr,'FREE',R,17.0,29.9)
key(a,'scale',0,(0,0,0),'CONSTANT',F(29.9)); key(a,'scale',0,(1,1,1),'CONSTANT',F(29.95)); key(b,'scale',0,(0,0,0),'CONSTANT',F(29.9)); key(b,'scale',0,(1,1,1),'CONSTANT',F(29.95))
for e,t in ((tl,15.25),(tr,16.95)): squash(e,t,0.2)
for o,t in ((kiss,3.3),(tru,5.1),(kiss,7.6),(tru,19.0),(kiss,20.0)): squash(o,t,0.18)
for e,t in ((tl,5.85),(tr,8.9)): squash(e,t,0.25)
# the crowd sorts itself
home=[Vector((-1.8+i*0.4,-1.6,0)) for i in range(10)]
L=[Vector((-1.2+(k%4)*0.38,-1.2-(k//4)*0.45,0)) for k in range(7)]; Rr=[Vector((0.75+(k%4)*0.38,-1.2-(k//4)*0.45,0)) for k in range(7)]
crowd=[person(*home[i][:2],'grey',0.5,phase=i*0.5) for i in range(10)]
for i,p in enumerate(crowd):
    first=L[i] if i<7 else Rr[i-7]; second=Rr[i] if i<7 else L[i-7]
    move(p.root,10.5+i*0.04,11.3+i*0.04,home[i],first); move(p.root,22.2+i*0.04,23.0+i*0.04,first,second)
    key(p.root,'location',0,second,'CONSTANT',F(29.85)); key(p.root,'location',0,home[i],'CONSTANT',F(29.9))
# "free" switches the brain off
hm=mat('brain',C['gold'],0.3,emit=1.2); you=person(20,0,'white',1.0,headmat=hm,phase=0.5)
keyv(bsdf(hm,'Emission Strength'),26.8,1.2); keyv(bsdf(hm,'Emission Strength'),27.05,0.0,'CONSTANT')
color(hm,26.8,C['gold'],interp='CONSTANT'); color(hm,27.05,C['grey'],interp='CONSTANT')
key(you.hmove,'location',0,(0,0,0),'BEZIER',F(27.05)); key(you.hmove,'location',0,(0,0,-0.12),'BOUNCE',F(27.5))
for k in range(5):
    ph=empty('phone',loc=(18.9+k*0.55,-0.4,2.55+0.2*math.sin(k*1.3))); cube((0.34,0.05,0.66),(0,0,0),W,0.06,ph); cube((0.27,0.02,0.52),(0,-0.025,0),INK,0.04,ph)
    text('FREE',(0,-0.05,0),R,0.07,ph); pop(ph,28.5+k*0.12); unpop(ph,30.0)
A=((0,-8.6,2.7),(0,-0.3,1.0))
shots([
 (0,4.5,(*A,48),(*A,51),'SINE'),
 (4.5,7.0,((-0.7,-3.0,1.9),(-0.7,0.15,1.1),50),((-0.7,-2.7,1.85),(-0.7,0.15,1.1),50),'SINE'),
 (7.0,9.8,((0.7,-3.0,1.9),(0.7,0.15,1.1),50),((0.7,-2.7,1.85),(0.7,0.15,1.1),50),'SINE'),
 (9.8,12.8,((0,-8.2,3.5),(0,-0.7,0.8),40),((0,-7.6,3.4),(0,-0.7,0.8),40),'SINE'),
 (12.8,18.8,((0,-4.4,2.0),(0,-0.1,1.1),38),((0,-4.1,1.95),(0,-0.1,1.1),38),'SINE'),
 (18.8,24.2,((0,-8.2,3.5),(0,-0.7,0.8),40),((0,-7.6,3.4),(0,-0.7,0.8),40),'SINE'),
 (24.2,30.2,((20,-5.2,2.1),(20,0,1.7),42),((20,-4.7,2.1),(20,0,1.7),42),'SINE'),
 (30.2,st.dur,(*A,45),(*A,48),'SINE'),
])
finish(sys.argv[-1])
