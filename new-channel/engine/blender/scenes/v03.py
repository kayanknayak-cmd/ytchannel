# 03 The Button (Milgram). VO cut at 34.5s. PG: the shock is shown only as a meter and a head jolt.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(34.5); cyclorama(); world(); studio(0,0); studio(20,0); studio(40,0); camera()
W=M['white']; DIM='#B5BCC7'
# two rooms, open front and top, shared wall
for size,loc in [((4.8,2.0,0.12),(0,0.4,0.06)),((4.8,0.12,1.9),(0,1.4,0.95)),((0.12,2.0,1.9),(-2.4,0.4,0.95)),((0.12,2.0,1.9),(2.4,0.4,0.95)),((0.12,2.0,1.9),(0,0.4,0.95))]:
    cube(size,loc,mat('room','#D8CCBA',0.6),0.05)
def desk(x,y,btnmat,base=0.12):
    cube((1.1,0.55,0.72),(x,y,base+0.36),W,0.08)
    b=cyl(0.11,0.06,(x,y-0.05,base+0.72),btnmat,0.025); return b
mbtn=mat('btn',C['red'],0.35)
btn=desk(-1.5,0.15,mbtn)
vol=person(-1.5,0.85,'grey',0.85,phase=0.3)
sci=scientist(-0.55,0.75,0.85)
lrn=person(0.85,0.7,'white',0.85,specs=True,phase=2.0)
for g in lrn.specs: pop(g,20.2); unpop(g,32.3)
bars=[]
for i in range(8):
    m=mat(f'bar{i}',DIM,0.4); b=cube((0.11,0.06,0.2+i*0.04),(1.15+i*0.15,1.32,1.45+i*0.02),m,0.03); bars.append(m)
cols=['#F0B23A','#F0B23A','#EE8F33','#EA6A2E','#E2432A','#E2432A','#E2432A','#E2432A']
H0=vol.hand.location.copy(); HP=Vector((0,-0.82,1.0))
def press(t,i):
    key(vol.hand,'location',0,H0,'BEZIER',F(t)-5); key(vol.hand,'location',0,HP,'BEZIER',F(t)); key(vol.hand,'location',0,H0,'BEZIER',F(t)+8)
    squash(btn,t,0.5)
    keyv(bsdf(mbtn,'Emission Strength'),t-0.05,0.0); keyv(bsdf(mbtn,'Emission Strength'),t,2.0); keyv(bsdf(mbtn,'Emission Strength'),t+0.4,0.0)
    color(bars[i],t-0.05,DIM,interp='CONSTANT'); color(bars[i],t,cols[i],interp='CONSTANT')
    keyv(bsdf(bars[i],'Emission Strength'),t,1.5,'CONSTANT')
press(9.6,0); press(12.56,1); press(13.12,2); press(13.6,3)
for t in (11.68,12.7,13.25,13.75): bounce(lrn.hmove,t,0.13)
shake(lrn.hmove,14.7,15.6,0.035,0,1)
for i in range(4):
    color(bars[i],21.7,cols[i],interp='CONSTANT'); color(bars[i],21.8,DIM,interp='CONSTANT'); keyv(bsdf(bars[i],'Emission Strength'),21.8,0.0,'CONSTANT')
key(vol.hmove,'location',0,(0,0,0),'BEZIER',F(16.3)); key(vol.hmove,'location',0,(0.22,0.05,0.02),'BACK',F(16.8)); key(vol.hmove,'location',0,(0.22,0.05,0.02),'BEZIER',F(18.8)); key(vol.hmove,'location',0,(0,0,0),'BEZIER',F(19.3))
def nod(p,t):
    key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(t)); key(p.hmove,'rotation_euler',0,(math.radians(10),0,0),'BACK',F(t)+6); key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(t)+16)
nod(sci,17.7); nod(sci,31.3)
# experts' guess vs reality on a big meter
cube((4.0,0.12,1.7),(20,1.05,1.5),W,0.08)
big=[]
for i in range(10):
    m=mat(f'big{i}',DIM,0.4); cube((0.2,0.08,0.35+i*0.09),(18.65+i*0.3,0.95,0.85+(0.35+i*0.09)/2),m,0.04); big.append(m)
color(big[9],25.0,DIM); color(big[9],25.15,C['red']); keyv(bsdf(big[9],'Emission Strength'),25.15,0.8)
mk=sphere(0.11,(18.65,0.6,0.62),M['gold']); pop(mk,23.95)
key(mk,'location',0,(18.65,0.6,0.62),'BEZIER',F(25.6)); key(mk,'location',0,(21.35,0.6,0.62),'BACK',F(26.2))
# two out of three pressed
for k in range(3):
    x=38.9+k*1.1; mb=mat(f'b3{k}',C['red'],0.35); b=desk(x,0.15,mb,0.0); p=person(x,0.85,'grey',0.75,phase=k)
    if k<2:
        t=27.0+k*0.15; h0=p.hand.location.copy(); hp=Vector((0,-0.93,1.13))
        key(p.hand,'location',0,h0,'BEZIER',F(t)-5); key(p.hand,'location',0,hp,'BEZIER',F(t)); key(p.hand,'location',0,h0,'BEZIER',F(t)+8)
        keyv(bsdf(mb,'Emission Strength'),t-0.05,0.0); keyv(bsdf(mb,'Emission Strength'),t,2.0)
    else: shake(p.hmove,27.4,28.2,0.05,0,3)
A=((0,-10.5,2.4),(0,0.4,0.95))
shots([
 (0,6.7,(*A,46),(*A,49),'SINE'),
 (6.7,10.2,((-2.7,-3.7,1.65),(-1.4,0.35,0.9),45),((-2.5,-3.4,1.6),(-1.4,0.35,0.9),45),'SINE'),
 (10.2,15.6,((1.25,-4.8,1.7),(1.25,0.6,1.3),40),((1.25,-4.4,1.65),(1.25,0.6,1.3),40),'SINE'),
 (15.6,19.4,((-1.0,-4.8,1.7),(-1.05,0.6,1.25),45),((-1.0,-4.4,1.7),(-1.05,0.6,1.25),45),'SINE'),
 (19.4,22.5,((1.25,-4.2,1.65),(1.25,0.6,1.3),40),((1.25,-3.9,1.65),(1.25,0.6,1.3),40),'SINE'),
 (22.5,26.3,((20,-5.6,1.6),(20,0.9,1.4),40),((20,-5.1,1.6),(20,0.9,1.4),40),'SINE'),
 (26.3,29.6,((40,-7.0,2.2),(40,0.4,0.9),40),((40,-6.5,2.1),(40,0.4,0.9),40),'SINE'),
 (29.6,32.5,((-0.3,-3.6,1.9),(-0.55,0.75,1.65),55),((-0.3,-3.3,1.9),(-0.55,0.75,1.65),55),'SINE'),
 (32.5,st.dur,(*A,43),(*A,46),'SINE'),
])
finish(sys.argv[-1])
