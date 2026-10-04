# 06 The Smoke (Latane & Darley 1968). VO cut at 38.8s.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(38.8); cyclorama(); world()
for cx in (0,20,40,60): studio(cx,0)
camera(); W=M['white']; room=mat('room','#D8CCBA',0.6); smoke=mat('smoke','#BDB9B4',0.95)
for size,loc in [((3.8,2.0,0.12),(0,0.4,0.06)),((3.8,0.12,2.1),(0,1.4,1.05)),((0.12,2.0,2.1),(-1.9,0.4,1.05)),((0.12,2.0,2.1),(1.9,0.4,1.05))]: cube(size,loc,room,0.05)
cube((0.6,0.05,0.3),(1.1,1.33,1.65),M['ink'],0.05)
for i in range(4): cube((0.5,0.06,0.03),(1.1,1.31,1.55+i*0.065),room,0.01)
def desk(x): cube((0.8,0.5,0.6),(x,0.35,0.42),W,0.07); cube((0.3,0.22,0.01),(x,0.32,0.725),M['white'],0.0)
desk(0); stu=person(0,0.95,'grey',0.7,phase=0.2)
def write(p,t0,t1): shake(p.hand,t0,t1,0.03,0,3)
write(stu,0.3,2.6); write(stu,10.2,13.5); write(stu,23.8,25.3)
def puffs(t0,n,spread,seed,gone):
    random.seed(seed)
    for i in range(n):
        t=t0+i*spread; p=sphere(0.25,(1.1,1.15,1.6),smoke); s=random.uniform(0.6,1.15)
        end=Vector((1.1-random.uniform(0.3,2.6),random.uniform(0.6,1.2),random.uniform(1.35,2.0)))
        key(p,'scale',0,(0,0,0),'CONSTANT',F(t)-1); key(p,'scale',0,(0.15,)*3,'BEZIER',F(t)); key(p,'scale',0,(s,)*3,'BEZIER',F(t+2.5))
        key(p,'location',0,(1.1,1.15,1.6),'BEZIER',F(t)); key(p,'location',0,end,'BEZIER',F(t+3.0))
        key(p,'scale',0,(s,)*3,'BEZIER',F(gone)); key(p,'scale',0,(0,0,0),'CONSTANT',F(gone)+6)
puffs(2.9,8,0.3,1,9.75); puffs(14.1,12,0.15,2,25.3)
# alone: gets up and leaves to report it
s0=stu.root.location.copy()
key(stu.root,'location',0,s0,'BEZIER',F(7.5)); key(stu.root,'location',0,s0+Vector((0,0,0.25)),'BACK',F(7.75)); key(stu.root,'location',0,s0+Vector((1.6,-0.9,0)),'BEZIER',F(8.6)); key(stu.root,'location',0,s0+Vector((4.0,-0.9,0)),'CONSTANT',F(9.3))
key(stu.root,'location',0,s0,'CONSTANT',F(9.8))
# two strangers, your actors
acts=[]
for x,dx in ((-1.05,-3),(1.05,3)):
    desk(x); a=person(x,0.95,'white',0.7,specs=True,phase=x)
    a0=a.root.location.copy(); move(a.root,10.6,11.4,a0+Vector((dx,0,0)),a0); move(a.root,25.3,25.4,a0,a0+Vector((dx,0,0)))
    key(a.root,'location',0,a0+Vector((dx,0,0)),'CONSTANT',F(0))
    for g in a.specs: pop(g,12.9); unpop(g,25.3)
    write(a,14.0,19.0); squash(a.body,16.9,0.15); bounce(a.hmove,16.9,0.12); acts.append(a)
bounce(stu.hmove,20.8,0.09); bounce(stu.hmove,21.25,0.09)
h0=stu.hand.location.copy()
for k,t in enumerate((22.1,22.35,22.6,22.85)): key(stu.hand,'location',0,h0+Vector((0.25 if k%2==0 else -0.1,-0.1,0.45)),'BEZIER',F(t))
key(stu.hand,'location',0,h0,'BEZIER',F(23.2))
# three in four reported alone; one in ten with calm strangers
four=[person(18.8+i*0.8,0,'grey',0.8,phase=i) for i in range(4)]
for i,p in enumerate(four[:3]):
    p0=p.root.location.copy(); t=26.4+i*0.12
    key(p.root,'location',0,p0,'BEZIER',F(t)); key(p.root,'location',0,p0+Vector((0,0,0.3)),'BACK',F(t)+5); key(p.root,'location',0,p0+Vector((5,0,0)),'BEZIER',F(t)+18)
ten=[person(38.0+(i%5)*1.0,(i//5)*1.0,'grey',0.75,phase=i) for i in range(10)]
p=ten[3]; p0=p.root.location.copy()
key(p.root,'location',0,p0,'BEZIER',F(30.9)); key(p.root,'location',0,p0+Vector((0,0,0.3)),'BACK',F(31.1)); key(p.root,'location',0,p0+Vector((5,-0.5,0)),'BEZIER',F(31.8))
row=[person(57.75+i*0.9,0,'grey',0.75,phase=i) for i in range(6)]
for i,p in enumerate(row):
    for j in range(3):
        t=33.9+i*0.1+j*1.1; key(p.hmove,'location',0,(0,0,0),'BEZIER',F(t)); key(p.hmove,'location',0,(0.12,0,0),'BEZIER',F(t)+6); key(p.hmove,'location',0,(-0.12,0,0),'BEZIER',F(t)+14); key(p.hmove,'location',0,(0,0,0),'BEZIER',F(t)+20)
A=((0,-8.5,2.2),(0,0.45,1.0))
shots([
 (0,5.8,(*A,42),(*A,46),'SINE'),
 (5.8,9.9,((0.5,-8.2,2.0),(0.5,0.4,1.0),38),((0.5,-7.9,2.0),(0.5,0.4,1.0),38),'SINE'),
 (9.9,13.9,((0,-7.6,1.9),(0,0.5,1.0),40),((0,-7.2,1.9),(0,0.5,1.0),40),'SINE'),
 (13.9,19.2,((0,-6.8,1.8),(0,0.6,1.2),40),((0,-6.2,1.8),(0,0.6,1.2),40),'SINE'),
 (19.2,25.4,((0,-4.3,1.55),(0,0.8,1.25),50),((0,-4.0,1.55),(0,0.8,1.25),50),'SINE'),
 (25.4,28.6,((20,-6.2,1.8),(20,0.2,0.9),40),((20,-5.7,1.8),(20,0.2,0.9),40),'SINE'),
 (28.6,33.7,((40,-7.2,2.4),(40,0.6,0.8),40),((40,-6.6,2.3),(40,0.6,0.8),40),'SINE'),
 (33.7,37.6,((60,-6.6,1.8),(60,0.3,1.0),40),((60,-6.1,1.8),(60,0.3,1.0),40),'SINE'),
 (37.6,st.dur,(*A,38),(*A,42),'SINE'),
])
finish(sys.argv[-1])
