# 04 The Marshmallow (Mischel; Watts et al. 2018). VO cut at 37.85s.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(37.85); cyclorama(); world()
for cx in (0,20,40,60): studio(cx,0)
camera(); W=M['white']; G=M['gold']; mm=mat('mallow','#FBF8F2',0.7)
def table(x,y,w=1.2):
    cube((w,0.7,0.66),(x,y,0.33),W,0.08); cyl(0.2,0.03,(x,y-0.05,0.66),M['ink'],0.01)
    return cyl(0.13,0.2,(x,y-0.05,0.69),mm,0.07)
mal=table(0.4,0.3); kid=person(0.4,0.95,'grey',0.6,phase=0.4); sci=scientist(-1.0,0.25)
squash(mal,6.2,0.3)
clock=empty('clock',loc=(1.35,0.85,1.25)); d=cyl(0.24,0.05,(0,0,0),W,0.02,clock); d.rotation_euler=(math.pi/2,0,0); d.location=(0,0.02,0)
hand_=empty('hand',clock); hm=cube((0.025,0.02,0.18),(0,-0.04,0.08),M['red'],0.008,hand_)
pop(clock,7.3); unpop(clock,35.9)
key(hand_,'rotation_euler',0,(0,0,0),'LINEAR',F(7.3)); key(hand_,'rotation_euler',0,(0,-math.pi*6,0),'LINEAR',F(35.9))
m2=cyl(0.13,0.2,(0.68,0.25,0.69),mm,0.07); pop(m2,8.6); unpop(m2,9.4)
S0=sci.root.location.copy(); move(sci.root,10.0,10.9,S0,S0+Vector((-4.5,0,0))); move(sci.root,36.0,36.7,S0+Vector((-4.5,0,0)),S0)
# three kids
kids=[]; mals=[]
for k,x in enumerate((18.7,20.0,21.3)):
    mals.append(table(x,0.3,1.0)); kids.append(person(x,0.95,'grey',0.6,phase=k))
unpop(mals[0],12.3); bounce(kids[0].hmove,12.35,0.12)
for t in (14.2,14.75):
    key(kids[1].hmove,'location',0,(0,0,0),'BEZIER',F(t)); key(kids[1].hmove,'location',0,(0,-0.45,-0.55),'BEZIER',F(t)+5); key(kids[1].hmove,'location',0,(0,0,0),'BACK',F(t)+11)
    squash(mals[1],t+0.2,0.25)
for m in mals[1:]: unpop(m,16.1)
for p in kids: key(p.root,'scale',0,(0.6,)*3,'BEZIER',F(16.2)); key(p.root,'scale',0,(0.95,)*3,'ELASTIC',F(17.2))
bars=[]
for k,x in enumerate((18.7,20.0,21.3)):
    b=cyl(0.1,1.0,(x+0.5,0.95,0),G,0.05); bars.append(b); hgt=2.4 if k==2 else 0.7
    key(b,'scale',0,(1,1,0),'CONSTANT',F(18.5)); key(b,'scale',0,(1,1,0),'BACK',F(18.6)); key(b,'scale',0,(1,1,hgt),'BEZIER',F(19.2))
    key(b,'scale',0,(1,1,hgt),'BEZIER',F(28.5)); key(b,'scale',0,(1,1,0.8),'BACK',F(29.2))
# internet loses it
import random; random.seed(5)
for i in range(15):
    p=person(38.2+(i%5)*0.9,(i//5)*0.9,'white',0.6,phase=i)
    for j in range(3): bounce(p.root,20.5+random.uniform(0,0.4)+j*0.45,0.25)
# rerun with way more kids, some with family money
for i in range(30):
    r,c=i//6,i%6; p=person(57.8+c*0.85,r*0.75,'grey',0.5,phase=i*0.3); pop(p.root,23.6+r*0.25,0.5)
    if i%3==0:
        for j in range(3):
            coin=cyl(0.1,0.04,(57.8+c*0.85+0.32,r*0.75-0.1,j*0.045),G,0.01); pop(coin,26.5+j*0.06+r*0.05)
# alone, waiting, by a door that stays shut
for size,loc in [((0.1,0.1,1.9),(1.7,1.4,0.95)),((0.1,0.1,1.9),(2.6,1.4,0.95)),((1.0,0.1,0.1),(2.15,1.4,1.9))]: cube(size,loc,M['ink'],0.03)
key(kid.hmove,'location',0,(0,0,0),'BEZIER',F(34.8)); key(kid.hmove,'location',0,(0.18,0.05,0),'BACK',F(35.3)); key(kid.hmove,'location',0,(0.18,0.05,0),'BEZIER',F(36.2)); key(kid.hmove,'location',0,(0,0,0),'BEZIER',F(36.7))
A=((0.2,-9.5,2.2),(0.2,0.4,1.0))
shots([
 (0,5.6,(*A,52),(*A,55),'SINE'),
 (5.6,9.5,((0.75,-3.6,1.4),(0.75,0.4,1.0),45),((0.75,-3.3,1.4),(0.75,0.4,1.0),45),'SINE'),
 (9.5,11.0,((-0.3,-8.0,2.0),(-0.3,0.3,1.0),40),((-0.3,-7.8,2.0),(-0.3,0.3,1.0),40),'SINE'),
 (11.0,16.0,((20,-5.6,1.6),(20,0.4,0.85),40),((20,-5.1,1.55),(20,0.4,0.85),40),'SINE'),
 (16.0,19.8,((20.3,-7.2,2.0),(20.3,0.7,1.3),40),((20.3,-6.6,2.0),(20.3,0.7,1.3),40),'SINE'),
 (19.8,22.6,((40,-6.2,2.0),(40,0.8,0.9),40),((40,-5.6,1.9),(40,0.8,0.9),40),'SINE'),
 (22.6,27.9,((60,-7.0,3.6),(60,1.5,0.5),40),((60,-6.3,3.3),(60,1.5,0.5),40),'SINE'),
 (27.9,30.1,((20.3,-7.0,2.0),(20.3,0.7,1.3),40),((20.3,-6.6,2.0),(20.3,0.7,1.3),40),'SINE'),
 (30.1,36.4,((1.3,-5.2,1.45),(1.25,0.7,1.0),42),((1.3,-4.5,1.4),(1.25,0.7,1.0),42),'SINE'),
 (36.4,st.dur,(*A,49),(*A,52),'SINE'),
])
finish(sys.argv[-1])
