# 07 The Gorilla (Simons & Chabris 1999). VO cut at 31.85s. The backdrop slowly changes color and snaps back on "changed".
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
M=setup(31.85); cyclorama(); world(); studio(0,0); studio(20,0); camera()
W=M['white']; G=M['gold']; dark=mat('dark','#4A505C',0.5); gor=mat('gor','#25282E',0.6)
cube((4.4,3.2,0.04),(0,0.4,0.02),mat('court','#D8CCBA',0.6),0.02)
cen=Vector((0,0.4,0)); R=1.25
def at(deg,r=R): a=math.radians(deg); return cen+Vector((math.cos(a)*r,math.sin(a)*r*0.8,0))
whites=[person(*at(d)[:2],'white',0.62,phase=i) for i,d in enumerate((90,210,330))]
blacks=[person(*at(d)[:2],dark,0.62,phase=i+2) for i,d in enumerate((30,150,270))]
team=whites+blacks
# 39 passes so the ball is back where it started when the loop restarts
N=39; dt=st.dur/N; ball=sphere(0.09,(0,0,0),G)
hand=lambda p: p.root.location+Vector((0,-0.05,0.75))
nums=[]
for k in range(N+1):
    t=k*dt; a=whites[k%3]; b=whites[(k+1)%3]; pa=hand(a); pb=hand(b)
    key(ball,'location',0,pa,'BEZIER',F(t) if k<N else st.END)
    if k<N:
        mid=(pa+pb)/2+Vector((0,0,0.55)); key(ball,'location',0,mid,'BEZIER',F(t+dt/2))
        if 7.6<=t+dt<=21.6:
            n=text(str(len(nums)+1),(0,0.4,2.35),M['ink'],0.6); nums.append(n); pop(n,t+dt); unpop(n,min(t+2*dt,21.75) if t+2*dt<=21.6 else 21.75)
for p in blacks:
    for t in (3.0,9.0,17.5,23.0,28.5): bounce(p.root,t+random.random()*0.6,0.12)
# the gorilla
g=empty('gorilla',loc=(3.2,0.4,0)); g.scale=(1,1,1)
gb=cyl(0.62,1.5,(0,0,0),gor,0.25,g); ghb=empty('ghb',g); bob(ghb,0.03,0.4); sphere(0.36,(0,0,2.0),gor,ghb)
gl=sphere(0.15,(-0.55,-0.1,1.05),gor,g); gr=sphere(0.15,(0.55,-0.1,1.05),gor,g)
key(g,'location',0,(0,-1.6,0),'CONSTANT',F(0)); key(g,'scale',0,(0,0,0),'CONSTANT',F(0)); pop(g,4.4,0.75,False); unpop(g,5.7,0.75)
key(g,'location',0,(0,-1.6,0),'CONSTANT',F(5.75)-2); key(g,'location',0,(3.4,0.4,0),'CONSTANT',F(5.75)); key(g,'scale',0,(0.75,)*3,'CONSTANT',F(12.7))
key(g,'location',0,(3.4,0.4,0),'BEZIER',F(12.8)); key(g,'location',0,(0,0.4,0),'BEZIER',F(13.7))
for i in range(8):
    t=14.2+i*0.1; o=gl if i%2==0 else gr; base=o.location.copy()
    key(o,'location',0,base,'BEZIER',F(t)); key(o,'location',0,Vector((base.x*0.35,-0.45,1.25)),'BEZIER',F(t)+1); key(o,'location',0,base,'BEZIER',F(t)+3)
squash(gb,14.25,0.08); squash(gb,14.6,0.08)
key(g,'location',0,(0,0.4,0),'BEZIER',F(15.8)); key(g,'location',0,(-3.6,0.4,0),'BEZIER',F(16.7)); unpop(g,16.75,0.75)
# viewers: half say no
for i in range(10):
    p=person(18.0+(i%5)*1.0,(i//5)*1.0,'grey',0.7,phase=i)
    if i in (0,2,3,6,9): shake(p.hmove,20.6+i*0.03,21.5,0.06,0,3)
    else: key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(20.7)); key(p.hmove,'rotation_euler',0,(0.18,0,0),'BEZIER',F(20.95)); key(p.hmove,'rotation_euler',0,(0,0,0),'BEZIER',F(21.3))
# tunnel vision: everyone but the ball disappears, then returns off the cut
for i,p in enumerate(team):
    key(p.root,'scale',0,(0.62,)*3,'BEZIER',F(24.3+i*0.1)); key(p.root,'scale',0,(0,0,0),'BEZIER',F(24.6+i*0.1))
    key(p.root,'scale',0,(0,0,0),'CONSTANT',F(26.3)); key(p.root,'scale',0,(0.62,)*3,'CONSTANT',F(26.38))
# the backdrop drifts to mint, then snaps back
sm=st.setmat; color(sm,2.0,C['set']); color(sm,27.0,'#C9DDD3'); color(sm,30.1,'#C9DDD3'); color(sm,30.18,C['set'],interp='CONSTANT')
A=((0,-8.8,3.4),(0,0.4,0.9))
shots([
 (0,6.0,(*A,48),(*A,51),'SINE'),
 (6.0,10.0,((0,-7.2,3.0),(0,0.4,1.55),40),((0,-6.8,3.0),(0,0.4,1.55),40),'SINE'),
 (10.0,16.9,((0,-9.2,3.2),(0,0.4,1.0),44),((0,-8.8,3.2),(0,0.4,1.0),44),'SINE'),
 (16.9,21.8,((20,-6.6,2.2),(20,0.5,0.9),40),((20,-6.1,2.2),(20,0.5,0.9),40),'SINE'),
 (21.8,26.4,((0,-6.5,2.1),(0,0.4,1.2),45),((0,-6.2,2.1),(0,0.4,1.2),55),'SINE'),
 (26.4,st.dur,(*A,45),(*A,48),'SINE'),
])
finish(sys.argv[-1])
