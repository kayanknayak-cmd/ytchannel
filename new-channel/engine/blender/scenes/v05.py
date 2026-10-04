# 05 The Prison (Zimbardo 1971; Le Texier 2018). VO cut at 34.6s. Opens and closes on the "textbook" so the loop is clean.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(34.6); cyclorama(); world(); key0=studio(0,0); studio(20,0); camera()
W=M['white']; G=M['gold']; room=mat('room','#D8CCBA',0.6)
# the textbook (X=20)
bl=cube((0.8,1.0,0.22),(19.6,0,0.11),W,0.06); br=cube((0.8,1.0,0.22),(20.4,0,0.11),W,0.06)
rib=cube((0.07,0.5,0.02),(20.0,-0.7,0.02),M['red'],0.01)
for o,dx in ((bl,-0.22),(br,0.22)):
    p0=o.location.copy(); key(o,'location',0,p0,'BEZIER',F(5.8)); key(o,'location',0,p0+Vector((dx,0,0.0)),'BACK',F(6.1))
    key(o,'location',0,p0+Vector((dx,0,0.0)),'BEZIER',F(7.2)); key(o,'location',0,p0,'BACK',F(7.6))
bk=empty('bk'); 
for o in (bl,br,rib): pass
for o in (bl,br):
    key(o,'rotation_euler',0,(0,0,0),'BEZIER',F(8.1)); key(o,'rotation_euler',0,(0,0.12,0),'BEZIER',F(8.35)); key(o,'rotation_euler',0,(0,-0.1,0),'BEZIER',F(8.6)); key(o,'rotation_euler',0,(0,0,0),'ELASTIC',F(9.0))
# the basement
for size,loc in [((4.4,2.0,0.12),(0,0.4,0.06)),((4.4,0.12,2.0),(0,1.4,1.0)),((0.12,2.0,2.0),(-2.2,0.4,1.0)),((0.12,2.0,2.0),(2.2,0.4,1.0))]: cube(size,loc,room,0.05)
for i in range(7):
    b=cyl(0.045,1.8,(0.35+i*0.29,0.05,0.12),W,0.02); key(b,'scale',0,(1,1,0),'CONSTANT',F(9.6+i*0.06)-1); key(b,'scale',0,(1,1,0),'BACK',F(9.6+i*0.06)); key(b,'scale',0,(1,1,1),'BEZIER',F(9.6+i*0.06)+8)
coin=cyl(0.26,0.05,(0,-0.4,1.2),G,0.015); pop(coin,11.7); unpop(coin,12.6)
key(coin,'rotation_euler',0,(0,0,0),'LINEAR',F(11.75)); key(coin,'rotation_euler',0,(math.pi*8,0,0),'LINEAR',F(12.45))
key(coin,'location',0,(0,-0.4,1.2),'BEZIER',F(11.75)); key(coin,'location',0,(0,-0.4,1.7),'BEZIER',F(12.1)); key(coin,'location',0,(0,-0.4,1.2),'BEZIER',F(12.45))
pm=[mat(f'p{i}',C['white']) for i in range(6)]; hm=[mat(f'h{i}',C['white']) for i in range(6)]
ppl=[person(-1.75+i*0.7,0.65,pm[i],0.62,phase=i*0.6,headmat=hm[i]) for i in range(6)]
for i,p in enumerate(ppl):
    if i<3:
        cap=sphere(0.26,(0,0,2.12),G,p.hmove); cap.scale=(1,1,0.35); pop(cap,12.5+i*0.1,(1,1,0.35))
    else:
        color(pm[i],13.0+i*0.05,C['white']); color(pm[i],13.3+i*0.05,C['grey']); color(hm[i],13.0+i*0.05,C['white']); color(hm[i],13.3+i*0.05,C['grey'])
for i in range(6):
    t=cube((0.05,0.03,0.4),(-1.7+i*0.13,1.33,1.45),M['ink'],0.01); pop(t,14.2+i*0.12)
for i,p in enumerate(ppl): shake(p.root,15.4+i*0.05,16.6,0.05,0,2)
key0.data.energy=4200; key0.data.keyframe_insert('energy',frame=F(16.95)); key0.data.energy=700; key0.data.keyframe_insert('energy',frame=F(17.1))
key0.data.keyframe_insert('energy',frame=F(17.7)); key0.data.energy=4200; key0.data.keyframe_insert('energy',frame=F(18.1))
gd=ppl[2]
key(gd.root,'scale',0,(0.62,)*3,'BEZIER',F(18.6)); key(gd.root,'scale',0,(0.85,)*3,'ELASTIC',F(19.3)); key(gd.root,'scale',0,(0.85,)*3,'BEZIER',F(28.8)); key(gd.root,'scale',0,(0.62,)*3,'BEZIER',F(29.3))
color(hm[2],20.8,C['white']); color(hm[2],21.0,C['red']); color(hm[2],28.8,C['red']); color(hm[2],29.1,C['white'])
# the tapes
tape=empty('tape',loc=(0,-1.2,1.0)); cube((0.9,0.14,0.56),(0,0,0),W,0.06,tape); cube((0.5,0.02,0.18),(0,-0.075,0.04),M['ink'],0.03,tape)
for dx in (-0.2,0.2):
    r=cyl(0.07,0.04,(0,0,0),M['ink'],0.0,tape,12); r.rotation_euler=(math.pi/2,0,0); r.location=(dx,-0.09,0.04)
    key(r,'rotation_euler',0,(math.pi/2,0,0),'LINEAR',F(23.6)); key(r,'rotation_euler',0,(math.pi/2,math.pi*6,0),'LINEAR',F(25.6))
pop(tape,23.65); unpop(tape,25.5)
# the scientist who ran it
shm=mat('shead',C['white']); sci=person(-2.9,-0.7,'white',1.0,specs=True,phase=1.3,headmat=shm)
s0=sci.root.location.copy(); move(sci.root,25.6,26.3,s0,s0+Vector((1.0,0,0))); move(sci.root,33.9,34.15,s0+Vector((1.0,0,0)),s0)
def nod(p,t):
    key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(t)); key(p.hmove,'rotation_euler',0,(math.radians(10),0,0),'BACK',F(t)+6); key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(t)+16)
nod(sci,26.8); [nod(ppl[i],27.1+i*0.08) for i in range(3)]
color(shm,33.3,C['white']); color(shm,33.5,C['red']); color(shm,33.95,C['red']); color(shm,34.15,C['white'])
B=((20,-4.2,2.6),(20,0,0.25))
shots([
 (0,9.4,(*B,45),(*B,50),'SINE'),
 (9.4,11.5,((0,-9.5,2.3),(0,0.4,0.95),36),((0,-9.1,2.3),(0,0.4,0.95),36),'SINE'),
 (11.5,14.0,((0,-6.2,1.7),(0,0.3,1.15),40),((0,-5.8,1.7),(0,0.3,1.15),40),'SINE'),
 (14.0,17.6,((-0.6,-9.6,2.4),(-0.6,0.3,1.0),38),((-0.6,-9.2,2.4),(-0.6,0.3,1.0),38),'SINE'),
 (17.6,22.3,((-0.4,-5.2,1.7),(-0.35,0.5,1.4),45),((-0.4,-4.8,1.7),(-0.35,0.5,1.4),45),'SINE'),
 (22.3,25.6,((0,-4.4,1.2),(0,-1.2,1.0),45),((0,-4.1,1.2),(0,-1.2,1.0),45),'SINE'),
 (25.6,29.7,((-1.6,-6.2,1.8),(-1.3,0.0,1.25),42),((-1.6,-5.7,1.8),(-1.3,0.0,1.25),42),'SINE'),
 (29.7,34.2,((-2.4,-4.4,1.9),(-1.9,-0.7,1.75),55),((-2.35,-4.0,1.9),(-1.9,-0.7,1.75),55),'SINE'),
 (34.2,st.dur,(*B,45),(*B,45),'SINE'),
])
finish(sys.argv[-1])
