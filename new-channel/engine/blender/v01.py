# Video 01 "The Pigeon Box": builds the animated scene and saves v01.blend. Times are VO seconds (words.json).
import bpy, math, bmesh, sys
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; FPS=24; END=1253
sc.render.fps=FPS; sc.frame_start=1; sc.frame_end=END
F=lambda t: int(round(t*FPS))+1
pref=bpy.context.preferences.edit

def hexc(h): h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return [((x/12.92) if x<=0.04045 else ((x+0.055)/1.055)**2.4) for x in c]+[1]
def mat(name,col,rough=0.55,emit=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=hexc(col); b.inputs['Roughness'].default_value=rough
    b.inputs['Emission Color'].default_value=hexc(col); b.inputs['Emission Strength'].default_value=emit
    return m
def done(o,m,bevel=0):
    o.data.materials.append(m)
    if bevel: md=o.modifiers.new('b','BEVEL'); md.width=bevel; md.segments=8; md.limit_method='ANGLE'
    for p in o.data.polygons: p.use_smooth=True
    return o
def sphere(r,loc,m,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r,location=loc,segments=64,ring_count=32); o=done(bpy.context.object,m); o.parent=parent; return o
def cyl(r,h,loc,m,bev,parent=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r,depth=h,location=(loc[0],loc[1],loc[2]+h/2),vertices=96); o=done(bpy.context.object,m,bev); o.parent=parent; return o
def cube(size,loc,m,bev,parent=None):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.scale=[s/2 for s in size]; bpy.ops.object.transform_apply(scale=True); o=done(o,m,bev); o.parent=parent; return o
def empty(name,parent=None,loc=(0,0,0)):
    o=bpy.data.objects.new(name,None); sc.collection.objects.link(o); o.parent=parent; o.location=loc; return o
def key(o,path,t,val,interp='BEZIER',frame=None):
    pref.keyframe_new_interpolation_type=interp
    setattr(o,path,val); o.keyframe_insert(path,frame=frame if frame is not None else F(t))
def keyv(sock,t,val,interp='BEZIER'):
    pref.keyframe_new_interpolation_type=interp; sock.default_value=val; sock.keyframe_insert('default_value',frame=F(t))

C=dict(set='#E4DACB',white='#F4F1EB',grey='#A9B2BF',red='#E2432A',gold='#F0B23A',ink='#2A2F3A')
M={k:mat(k,v) for k,v in C.items()}
M['red'].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.35
M['gold']=mat('gold2',C['gold'],0.3,emit=0.15)
M['bulb']=mat('bulb','#FFE7A8',0.3,emit=0.0)
M['btn']=mat('btn',C['red'],0.35,emit=0.0)

# cyclorama
bpy.ops.mesh.primitive_plane_add(size=1); o=bpy.context.object; bm=bmesh.new(); prof=[(-60,0),(2,0)]
for i in range(1,21): a=i/20*math.pi/2; prof.append((2+math.sin(a)*4,4-math.cos(a)*4))
prof+= [(6,10),(6,30)]
vs=[[bm.verts.new((x,y,z)) for (y,z) in prof] for x in (-20,50)]
for i in range(len(prof)-1): bm.faces.new((vs[0][i],vs[1][i],vs[1][i+1],vs[0][i+1]))
bm.to_mesh(o.data); bm.free(); done(o,mat('set',C['set'],0.6))

# ---------- Skinner box ----------
bx,by=0.75,0.6; w,h,d,t=2.0,1.7,1.6,0.12
for size,loc in [((w,d,t),(0,0,t/2)),((w,d,t),(0,0,h)),((t,d,h),(-w/2,0,h/2)),((t,d,h),(w/2,0,h/2)),((w,t,h),(0,d/2,h/2))]:
    cube(size,(loc[0]+bx,loc[1]+by,loc[2]),M['white'],0.05)
BX=bx+w/2-t/2-0.04  # right wall inner face
btn_e=empty('btn_e')
b=cyl(0.15,0.06,(0,0,0),M['btn'],0.025,btn_e); b.rotation_euler=(0,math.radians(90),0); b.location=(BX,0.75,0.95)
chute=cube((0.05,0.24,0.08),(BX,0.75,0.62),M['ink'],0.02)
dish=cyl(0.22,0.06,(1.38,0.75,0.12),M['ink'],0.03)
# switch on left outer wall
cube((0.06,0.3,0.3),(bx-w/2-0.09,0.15,1.1),M['ink'],0.03)
sw_e=empty('sw_e',loc=(bx-w/2-0.12,0.15,1.1))
cyl(0.025,0.18,(0,0,0),M['white'],0.01,sw_e).rotation_euler=(0,math.radians(-90),0)
sphere(0.05,(-0.18,0,0),M['red'],sw_e)
sw_e.rotation_euler=(0,math.radians(35),0)

# ---------- pigeon ----------
PERIOD=END/26.0
def bob(o,amp,phase):
    dr=o.driver_add('location',2).driver; dr.type='SCRIPTED'
    dr.expression=f"{amp}*sin(frame*2*pi/{PERIOD:.4f}+{phase})"
pig=empty('pig'); body=sphere(0.34,(0.75,0.75,0.46),M['grey'],pig)
lift=empty('lift',pig); hb=empty('hb',lift); bob(hb,0.025,0.0)
peck=empty('peck',hb); head=sphere(0.17,(0.85,0.75,1.05),M['grey'],peck)
bpy.ops.mesh.primitive_cone_add(radius1=0.07,depth=0.24,location=(0.85+0.26,0.75,1.04),vertices=48)
bk=done(bpy.context.object,M['gold']); bk.rotation_euler=(0,math.radians(90),0); bk.parent=peck

def peck_at(t0,off=(0.42,0,0),dur=0.24,button=True,squash=False):
    key(peck,'location',0,(0,0,0),'SINE',F(t0))
    key(peck,'location',0,off,'BACK',F(t0)+max(2,int(dur*FPS*0.4)))
    key(peck,'location',0,(0,0,0),'BEZIER',F(t0)+max(4,int(dur*FPS)))
    if button:
        f=F(t0)+max(2,int(dur*FPS*0.4))
        key(btn_e,'location',0,(0,0,0),'LINEAR',f-1); key(btn_e,'location',0,(0.035,0,0),'BEZIER',f); key(btn_e,'location',0,(0,0,0),'BEZIER',f+3)
    if squash:
        f=F(t0)+max(2,int(dur*FPS*0.4))
        key(body,'scale',0,(1,1,1),'BEZIER',F(t0)); key(body,'scale',0,(1.05,1.05,0.92),'BACK',f); key(body,'scale',0,(1,1,1),'BEZIER',F(t0)+max(4,int(dur*FPS)))
DISH=(0.6,0,-0.72)
pellets=[]
def pellet(t_drop,t_gone=None,slot=0):
    p=sphere(0.055,(BX-0.06,0.75,0.62),M['gold']); pellets.append(p)
    rest=(1.38+[-0.06,0.07,0.0][slot%3],0.75+[0.05,-0.04,0.08][slot%3],0.2)
    key(p,'scale',0,(0,0,0),'CONSTANT',F(t_drop)-1); key(p,'scale',0,(1,1,1),'BACK',F(t_drop))
    key(p,'location',0,(BX-0.06,0.75,0.62),'BOUNCE',F(t_drop)); key(p,'location',0,rest,'BEZIER',F(t_drop)+9)
    if t_gone: key(p,'scale',0,(1,1,1),'BEZIER',F(t_gone)); key(p,'scale',0,(0,0,0),'CONSTANT',F(t_gone)+3)
    else: key(p,'scale',0,(0,0,0),'CONSTANT',F(t_gone or 30.0))

# S2: peck the button, get food; S3: eats, gets full, boring
peck_at(3.5); pellet(4.6,6.5,0); pellet(5.6,6.95,1); pellet(5.9,7.4,2)
for tt in (6.35,6.9,7.35): peck_at(tt,DISH,0.3,button=False)
BL=lambda k:(0.75,0.75,0.12+0.34*k)
key(body,'scale',0,(1,1,1),'BEZIER',F(6.3)); key(body,'location',0,BL(1),'BEZIER',F(6.3)); key(lift,'location',0,(0,0,0),'BEZIER',F(6.3))
key(body,'scale',0,(1.4,1.4,1.4),'ELASTIC',F(8.4)); key(body,'location',0,BL(1.4),'ELASTIC',F(8.4))
key(lift,'location',0,(-0.06,0,0.14),'BEZIER',F(8.4))
key(lift,'location',0,(-0.06,0,0.14),'BEZIER',F(10.2)); key(lift,'location',0,(-0.04,0,0.02),'BEZIER',F(10.9))
# reset during scientist shot
key(body,'scale',0,(1.4,1.4,1.4),'BEZIER',F(12.2)); key(body,'scale',0,(1,1,1),'BACK',F(13.0)); key(body,'location',0,BL(1.4),'BEZIER',F(12.2)); key(body,'location',0,BL(1),'BACK',F(13.0))
key(lift,'location',0,(-0.04,0,0.02),'BEZIER',F(12.2)); key(lift,'location',0,(0,0,0),'BEZIER',F(13.0))

# S4: change one rule (scientist flips switch); random food
SX,SY=-1.05,-0.55
sci=empty('sci'); cyl(0.38,1.4,(SX,SY,0),M['white'],0.19,sci)
shb=empty('shb',sci); bob(shb,0.03,1.3); sh=sphere(0.29,(SX,SY,1.85),M['white'],shb)
for dx in (-0.11,0.11):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.065,minor_radius=0.012,location=(SX+dx,SY-0.285,1.88),major_segments=64,minor_segments=16)
    g=done(bpy.context.object,M['ink']); g.rotation_euler=(math.pi/2,0,0); g.parent=shb
hand=sphere(0.09,(SX+0.45,SY-0.05,1.05),M['white'])
H0=(SX+0.45,SY-0.05,1.05); H1=(bx-w/2-0.32,0.15,1.12)
key(hand,'location',0,H0,'BEZIER',F(11.9)); key(hand,'location',0,H1,'BACK',F(12.55)); key(hand,'location',0,H1,'BEZIER',F(13.1)); key(hand,'location',0,H0,'BEZIER',F(13.6))
key(sw_e,'rotation_euler',0,(0,math.radians(35),0),'BEZIER',F(12.6)); key(sw_e,'rotation_euler',0,(0,math.radians(-35),0),'BACK',F(12.85))
key(sw_e,'rotation_euler',0,(0,math.radians(-35),0),'BEZIER',F(45.0)); key(sw_e,'rotation_euler',0,(0,math.radians(35),0),'BACK',F(45.5))
# scientist nod at "you're the scientist now"
key(shb,'rotation_euler',0,(0,0,0),'BEZIER',F(45.9)); key(shb,'rotation_euler',0,(math.radians(8),0,0),'BACK',F(46.3)); key(shb,'rotation_euler',0,(0,0,0),'BEZIER',F(46.9))
pellet(14.8,15.6,0)
peck_at(16.45); peck_at(16.78); pellet(17.05,17.7,1)
tt=17.5
while tt<19.25: peck_at(tt,dur=0.16); tt+=0.16
pellet(19.35,20.2,2)
# S5: goes nuts
tt=20.5
while tt<25.7: peck_at(tt,dur=0.15,squash=True); tt+=0.15
for i,tt in enumerate((21.3,22.4,23.6,25.0)): pellet(tt,tt+0.7,i)
# S6: button glows on "addictive reward", blinks on "Maybe"
bn=M['btn'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
keyv(bn,26.6,0.0); keyv(bn,28.4,1.2); keyv(bn,29.05,1.2); keyv(bn,29.15,0.0,'CONSTANT'); keyv(bn,29.4,1.2,'CONSTANT'); keyv(bn,30.1,0.0,'CONSTANT')

# ---------- slot machines (in a giant open-top box at x=20) ----------
X0,Y0=20.0,-7.5
bulb=M['bulb'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
keyv(bulb,0,0.0,'CONSTANT'); keyv(bulb,36.1,0.0); keyv(bulb,36.4,6.0,'BACK')
def machine(x,y,hero=False):
    root=empty('slot',loc=(x,y,0))
    bodyo=cube((1.5,1.1,2.3),(0,0,1.15),M['white'],0.22,root)
    cube((1.15,0.1,0.55),(0,-0.55,1.5),M['ink'],0.08,root)
    reels=[sphere(0.14,(dx,-0.64,1.5),M[c],root) for dx,c in ((-0.36,'gold'),(0,'red'),(0.36,'grey'))]
    for i in range(5): sphere(0.06,(-0.5+i*0.25,-0.45,2.25),M['bulb'],root)
    cube((1.0,0.35,0.16),(0,-0.62,0.55),M['ink'],0.07,root)
    piv=empty('lever',root,(0.82,0,1.3)); cyl(0.04,0.7,(0,0,0),M['white'],0.0,piv); sphere(0.12,(0,0,0.75),M['red'],piv)
    return root,reels,piv
hero,hreels,hpiv=machine(X0,Y0,True)
others=[machine(X0+dx,Y0+dy) for dx,dy in ((-3,0.8),(3,0.8),(-6,2.2),(6,2.2))]
def spin(reels,t0,t1,phase=0):
    for i,r in enumerate(reels):
        z0=r.location.z; f=F(t0); stop=F(t1)+i*4
        key(r,'location',0,r.location.copy(),'CONSTANT',f-1)
        while f<stop:
            v=r.location.copy(); v.z=z0+(0.09 if (f+i+phase)%2 else -0.09); key(r,'location',0,v,'LINEAR',f); f+=1
        v=r.location.copy(); v.z=z0; key(r,'location',0,v,'BACK',stop)
spin(hreels,30.1,31.6)
for k,(_,rr,_) in enumerate(others): spin(rr,32.3,35.2,k)
spin(hreels,32.3,35.2)
spin(hreels,39.45,41.0)
# "sounds": hero wobble
key(hero,'scale',0,(1,1,1),'BEZIER',F(36.9)); key(hero,'scale',0,(1.06,1.06,0.93),'BEZIER',F(37.05)); key(hero,'scale',0,(1,1,1),'ELASTIC',F(37.5))
# lever: wiggle on "a lever", pulled by the person
def pull(t0):
    key(hpiv,'rotation_euler',0,(0,0,0),'BEZIER',F(t0)); key(hpiv,'rotation_euler',0,(math.radians(65),0,0),'BEZIER',F(t0)+6); key(hpiv,'rotation_euler',0,(0,0,0),'ELASTIC',F(t0)+20)
key(hpiv,'rotation_euler',0,(0,0,0),'BEZIER',F(37.85)); key(hpiv,'rotation_euler',0,(math.radians(12),0,0),'ELASTIC',F(38.0)); key(hpiv,'rotation_euler',0,(0,0,0),'BEZIER',F(38.6))
pull(39.3); pull(42.0)
# the person ("you"): same grey as the pigeon
you=empty('you'); PX,PY=X0+1.45,Y0-0.35
cyl(0.38,1.4,(PX,PY,0),M['grey'],0.19,you); yhb=empty('yhb',you); bob(yhb,0.03,2.1); sphere(0.29,(PX,PY,1.85),M['grey'],yhb)
yh=sphere(0.09,(0,0,0.75),M['grey'],hpiv); yh.location=(0.1,0,0.72)
# giant box (open top) + giant scientist peering in
GW,GD,GH,GT=18.0,11.0,9.0,0.5; gy=Y0+1.5
for size,loc in [((GT,GD,GH),(X0-GW/2,gy-GD/2+GD/2,GH/2)),((GT,GD,GH),(X0+GW/2,gy,GH/2)),((GW+GT,GT,GH),(X0,gy+GD/2,GH/2))]:
    cube(size,loc,M['white'],0.2)
G=empty('giant',loc=(X0+3.0,gy+GD/2+2.4,0)); G.scale=(5.5,5.5,5.5)
cyl(0.38,1.4,(0,0,0),M['white'],0.19,G); ghb=empty('ghb',G); bob(ghb,0.02,0.7); sphere(0.29,(0,0,1.85),M['white'],ghb)
for dx in (-0.11,0.11):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.065,minor_radius=0.012,location=(dx,-0.285,1.88),major_segments=64,minor_segments=16)
    g=done(bpy.context.object,M['ink']); g.rotation_euler=(math.pi/2,0,0); g.parent=ghb

# ---------- lights ----------
def area(loc,tgt,size,energy,col):
    bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object; l.data.size=size; l.data.energy=energy; l.data.color=col
    l.rotation_euler=(Vector(tgt)-Vector(loc)).to_track_quat('-Z','Y').to_euler(); return l
area((-6,-4,6),(0,0,0.8),2.5,4200,(1,0.95,0.88)); area((5,3,4),(0,0,1),3,500,(0.85,0.9,1))
area((X0-6,Y0-4,6.5),(X0,Y0,0.8),2.5,4200,(1,0.95,0.88)); area((X0+5,Y0+2,4),(X0,Y0,1),3,500,(0.85,0.9,1))
area((X0-6,Y0-34,20),(X0,Y0,4),10,9000,(1,0.95,0.88))
wd=bpy.data.worlds.new('w'); sc.world=wd; wd.use_nodes=True; wd.node_tree.nodes['Background'].inputs[0].default_value=hexc('#DCE3EE'); wd.node_tree.nodes['Background'].inputs[1].default_value=0.08

# ---------- camera: one rig, hard cuts between shots ----------
rig=empty('rig'); tgt=empty('tgt'); shake=empty('shake',rig)
bpy.ops.object.camera_add(); cam=bpy.context.object; cam.parent=shake; sc.camera=cam
tc=cam.constraints.new('TRACK_TO'); tc.target=tgt; tc.track_axis='TRACK_NEGATIVE_Z'; tc.up_axis='UP_Y'
cam.data.dof.use_dof=True; cam.data.dof.focus_object=tgt; cam.data.dof.aperture_fstop=5.6; cam.data.sensor_fit='VERTICAL'; cam.data.sensor_height=36
A=((0.2,-11.5,2.6),(0.2,0,1.25))
CL=((-0.45,-4.2,1.55),(1.1,0.75,0.85)); CL2=((-0.2,-3.9,1.45),(1.15,0.75,0.88))
shots=[ # t0,t1,(pos0,tgt0,lens0),(pos1,tgt1,lens1),ease
 (0.0,3.4,(*A,60),(*A,66),'SINE'),
 (3.4,6.2,(*CL,45),(*CL2,45),'SINE'),
 (6.2,11.7,((0.75,-6.6,1.6),(0.9,0.6,0.85),45),((0.75,-5.9,1.5),(0.9,0.6,0.85),45),'SINE'),
 (11.7,13.7,((-2.3,-5.4,1.9),(-0.55,0,1.15),45),((-2.05,-5.1,1.9),(-0.55,0,1.15),45),'SINE'),
 (13.7,19.45,(*CL,45),(*CL2,45),'SINE'),
 (19.45,25.8,((-0.3,-4.0,1.5),(1.2,0.75,0.9),45),((0.2,-3.0,1.35),(1.25,0.75,0.92),45),'SINE'),
 (25.8,30.1,((0.3,-3.0,1.2),(BX,0.75,0.95),45),((1.05,0.25,0.97),(BX,0.75,0.95),45),'CUBIC'),
 (30.1,32.25,((X0,Y0-5.2,1.6),(X0,Y0,1.45),45),((X0,Y0-4.7,1.6),(X0,Y0,1.45),45),'SINE'),
 (32.25,36.0,((X0,Y0-5.5,1.7),(X0,Y0+0.5,1.3),35),((X0,Y0-15.5,2.6),(X0,Y0+1,1.4),35),'CUBIC'),
 (36.0,38.8,((X0-1.2,Y0-4.6,1.9),(X0+0.25,Y0,1.6),45),((X0-1.0,Y0-4.3,1.85),(X0+0.25,Y0,1.6),45),'SINE'),
 (38.8,43.6,((X0+3.4,Y0-4.2,1.75),(X0+1.0,Y0-0.2,1.25),45),((X0+3.0,Y0-3.6,1.65),(X0+1.0,Y0-0.2,1.25),45),'SINE'),
 (43.6,45.1,((X0+2.6,Y0-3.6,1.7),(X0+1.2,Y0,1.2),45),((X0,Y0-42,8.5),(X0,gy,4.2),40),'CUBIC'),
 (45.1,49.1,(*A,70),(*A,60),'SINE'),
 (49.1,END/FPS,(*A,60),(*A,60),'SINE'),
]
for t0,t1,(p0,g0,l0),(p1,g1,l1),ez in shots:
    f0=F(t0); f1=min(F(t1)-1,END)
    for o,a,b_ in ((rig,p0,p1),(tgt,g0,g1)):
        key(o,'location',0,a,ez,f0); key(o,'location',0,b_,'CONSTANT',f1)
    pref.keyframe_new_interpolation_type=ez; cam.data.lens=l0; cam.data.keyframe_insert('lens',frame=f0)
    pref.keyframe_new_interpolation_type='CONSTANT'; cam.data.lens=l1; cam.data.keyframe_insert('lens',frame=f1)
# handheld micro-shake during "goes nuts"
import random; random.seed(3); f=F(20.5)
key(shake,'location',0,(0,0,0),'BEZIER',f-1)
while f<F(25.8):
    key(shake,'location',0,(random.uniform(-.012,.012),random.uniform(-.006,.006),random.uniform(-.012,.012)),'BEZIER',f); f+=2
key(shake,'location',0,(0,0,0),'BEZIER',F(25.8))

# ---------- render ----------
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=16; sc.cycles.use_denoising=True
sc.render.use_motion_blur=True; sc.render.motion_blur_shutter=0.5; sc.render.use_persistent_data=True
sc.render.resolution_x=720; sc.render.resolution_y=1280
sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Medium High Contrast'
sc.render.use_overwrite=False; sc.render.use_placeholder=True
sc.render.filepath=sys.argv[-1] if sys.argv[-1].endswith('/') else '/tmp/v01/'
bpy.ops.wm.save_as_mainfile(filepath=sc.render.filepath+'v01.blend'); print('saved')
