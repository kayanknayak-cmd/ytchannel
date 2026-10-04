# 02 The Wrong Line (Asch). VO cut at 35.7s (before the closing "You're a scientist" so the loop flows).
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(35.7); cyclorama(); world(); studio(0,0); studio(20,0); studio(40,0); camera()
R=M['red']; G=M['gold']
# board with reference line and A B C
cube((4.4,0.12,2.2),(0,1.6,2.95),M['white'],0.08)
mref=mat('ref',C['ink']); mC=mat('mc',C['ink'])
bars={}
ref=cyl(0.06,1.15,(-1.5,1.5,2.3),mref,0.04)
for name,x,L,m in (('A',0.0,1.6,M['ink']),('B',0.7,0.7,M['ink']),('C',1.4,1.15,mC)):
    bars[name]=cyl(0.06,L,(x,1.5,2.3),m,0.04); text(name,(x,1.5,2.1),M['ink'],0.28)
for i,(n,t) in enumerate((('A',6.4),('B',6.62),('C',6.84))): squash(bars[n],t,0.25)
squash(ref,6.2,0.25); squash(ref,8.1,0.2)
for m in (mref,mC): color(m,9.95,C['ink']); color(m,10.15,C['gold']); color(m,17.4,C['gold']); color(m,17.7,C['ink'])
color(mC,21.0,C['ink']); color(mC,21.2,C['gold']); color(mC,22.8,C['gold']); color(mC,23.0,C['ink'])
# the line of people: subject (grey) nearest camera, 7 actors behind
people=[person(1.2-i*0.42,-3.0+i*0.5,'grey' if i==0 else 'white',0.8,specs=(i>0),phase=i*0.7) for i in range(8)]
subj=people[0]
for i,p in enumerate(people[1:]):
    for g in p.specs: pop(g,13.0+i*0.08); unpop(g,33.6)
    a=text('A',(p.root.location.x,p.root.location.y-0.1,2.05),R,0.3); t=14.3+(6-i)*0.25; pop(a,t); unpop(a,33.6)
    bounce(p.hmove,t,0.12)
shake(subj.hmove,2.7,3.3,0.02)
squash(subj.head,19.1,0.18)
c=text('C',(1.2,-3.1,2.05),G,0.3); pop(c,21.2); unpop(c,22.9)
a=text('A',(1.2,-3.1,2.05),R,0.3); pop(a,22.96); unpop(a,33.6)
key(subj.hmove,'location',0,(0,0,0),'BEZIER',F(22.9)); key(subj.hmove,'location',0,(0,0,-0.12),'BEZIER',F(23.4)); key(subj.hmove,'location',0,(0,0,-0.12),'BEZIER',F(33.4)); key(subj.hmove,'location',0,(0,0,0),'BEZIER',F(33.8))
# three out of four caved
four=[person(18.8+i*0.8,0,'grey',0.9,phase=i) for i in range(4)]
for i,p in enumerate(four[:3]):
    key(p.hmove,'location',0,(0,0,0),'BEZIER',F(25.2+i*0.08)); key(p.hmove,'location',0,(0.12,-0.1,-0.42),'BOUNCE',F(25.6+i*0.08))
# the only one who's right
lone=person(41.6,0,'grey',0.9)
crowd=[person(38.0+(i%4)*0.8,(i//4)*0.9,'white',0.9,phase=i) for i in range(7)]
for p in crowd: move(p.root,30.2,31.0,p.root.location.copy(),p.root.location+Vector((-1.6,0,0)))
key(lone.hmove,'location',0,(0,0,0),'BEZIER',F(31.6)); key(lone.hmove,'location',0,(0,0,-0.15),'BEZIER',F(32.4))
A=((0.6,-12.5,3.4),(0,-0.6,2.2))
shots([
 (0,6.2,(*A,46),(*A,50),'SINE'),
 (6.2,10.9,((0.0,-5.2,2.9),(0.0,1.6,2.8),36),((0.0,-4.8,2.9),(0.0,1.6,2.8),36),'SINE'),
 (10.9,17.6,((-3.2,-3.5,1.9),(-1.2,0,1.4),40),((-1.0,-5.0,1.9),(0.2,-1.5,1.4),40),'SINE'),
 (17.6,24.0,((1.7,-7.2,2.1),(1.2,-3.0,1.75),55),((1.6,-6.7,2.05),(1.2,-3.0,1.75),55),'SINE'),
 (24.0,29.3,((20,-6.2,1.8),(20,0,1.0),45),((20,-5.4,1.7),(20,0,1.0),45),'SINE'),
 (29.3,33.9,((40,-7.2,2.0),(40.2,0,1.0),40),((40,-6.4,1.9),(40.2,0,1.0),40),'SINE'),
 (33.9,st.dur,(*A,42),(*A,46),'SINE'),
])
finish(sys.argv[-1])
