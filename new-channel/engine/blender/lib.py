# Shared building blocks for the channel's Blender scenes. Times are VO seconds.
import bpy, math, bmesh, random
from mathutils import Vector
FPS=24
def F(t): return int(round(t*FPS))+1
class S: pass
st=S()

def hexc(h): h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return [((x/12.92) if x<=0.04045 else ((x+0.055)/1.055)**2.4) for x in c]+[1]
def mat(name,col,rough=0.55,emit=0.0,metal=0.0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=hexc(col); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    b.inputs['Emission Color'].default_value=hexc(col); b.inputs['Emission Strength'].default_value=emit
    return m
def bsdf(m,name): return m.node_tree.nodes['Principled BSDF'].inputs[name]

C=dict(set='#E4DACB',white='#F4F1EB',grey='#A9B2BF',red='#E2432A',gold='#F0B23A',ink='#2A2F3A')
def setup(dur):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc=bpy.context.scene; st.sc=sc; st.END=int(math.ceil(dur*FPS)); st.dur=dur
    sc.render.fps=FPS; sc.frame_start=1; sc.frame_end=st.END
    st.M={k:mat(k,v) for k,v in C.items()}
    bsdf(st.M['red'],'Roughness').default_value=0.35
    st.M['gold']=mat('gold2',C['gold'],0.3,emit=0.15)
    st.PERIOD=st.END/max(1,round(st.END/48))
    return st.M

def done(o,m,bevel=0):
    if m is not None: o.data.materials.append(m)
    if bevel: md=o.modifiers.new('b','BEVEL'); md.width=bevel; md.segments=8; md.limit_method='ANGLE'
    if hasattr(o.data,'polygons'):
        for p in o.data.polygons: p.use_smooth=True
    return o
def sphere(r,loc,m,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r,location=loc,segments=64,ring_count=32); o=done(bpy.context.object,m); o.parent=parent; return o
def cyl(r,h,loc,m,bev,parent=None,verts=96):
    bpy.ops.mesh.primitive_cylinder_add(radius=r,depth=h,location=(loc[0],loc[1],loc[2]+h/2),vertices=verts); o=done(bpy.context.object,m,bev); o.parent=parent; return o
def cube(size,loc,m,bev,parent=None):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.scale=[s/2 for s in size]; bpy.ops.object.transform_apply(scale=True); o=done(o,m,bev); o.parent=parent; return o
def empty(name,parent=None,loc=(0,0,0)):
    o=bpy.data.objects.new(name,None); st.sc.collection.objects.link(o); o.parent=parent; o.location=loc; return o
def text(s,loc,m,size=0.5,parent=None,depth=0.05):
    bpy.ops.object.text_add(location=loc); o=bpy.context.object; o.data.body=s; o.data.size=size; o.data.extrude=depth; o.data.bevel_depth=0.012; o.data.bevel_resolution=3
    o.data.align_x='CENTER'; o.data.align_y='CENTER'; o.rotation_euler=(math.pi/2,0,0); o.data.materials.append(m); o.parent=parent; return o

def key(o,path,t,val,interp='BEZIER',frame=None):
    bpy.context.preferences.edit.keyframe_new_interpolation_type=interp
    setattr(o,path,val); o.keyframe_insert(path,frame=frame if frame is not None else F(t))
def keyv(sock,t,val,interp='BEZIER',frame=None):
    bpy.context.preferences.edit.keyframe_new_interpolation_type=interp; sock.default_value=val; sock.keyframe_insert('default_value',frame=frame if frame is not None else F(t))

# ---- motion vocabulary ----
def pop(o,t,s=1.0,hidden_before=True):
    sv=(s,s,s) if isinstance(s,(int,float)) else s
    if hidden_before: key(o,'scale',0,(0,0,0),'CONSTANT',F(t)-1)
    key(o,'scale',0,(0,0,0),'BACK',F(t)); key(o,'scale',0,sv,'BEZIER',F(t)+8)
def unpop(o,t,s=1.0):
    sv=(s,s,s) if isinstance(s,(int,float)) else s
    key(o,'scale',0,sv,'BEZIER',F(t)); key(o,'scale',0,(0,0,0),'CONSTANT',F(t)+5)
def move(o,t0,t1,a,b,interp='BEZIER'):
    key(o,'location',0,a,interp,F(t0)); key(o,'location',0,b,'BEZIER',F(t1))
def bounce(o,t,h=0.15,base=None):
    b=Vector(base) if base else o.location.copy()
    key(o,'location',0,b,'BEZIER',F(t)); key(o,'location',0,b+Vector((0,0,h)),'BEZIER',F(t)+4); key(o,'location',0,b,'BOUNCE',F(t)+5); key(o,'location',0,b,'BEZIER',F(t)+14)
def squash(o,t,amt=0.12,base=1.0):
    key(o,'scale',0,(base,)*3,'BEZIER',F(t)); key(o,'scale',0,(base*(1+amt/2),base*(1+amt/2),base*(1-amt)),'BEZIER',F(t)+3); key(o,'scale',0,(base,)*3,'ELASTIC',F(t)+5); key(o,'scale',0,(base,)*3,'BEZIER',F(t)+20)
def shake(o,t0,t1,amp=0.03,axis=0,step=2):
    b=o.location.copy(); f=F(t0); i=0
    key(o,'location',0,b,'BEZIER',f-1)
    while f<F(t1):
        v=b.copy(); v[axis]+=amp*(1 if i%2 else -1); key(o,'location',0,v,'BEZIER',f); f+=step; i+=1
    key(o,'location',0,b,'BEZIER',F(t1))
def color(m,t,col,dur=0.3,interp='BEZIER'):
    keyv(bsdf(m,'Base Color'),t,hexc(col),interp)
def bob(o,amp,phase):
    dr=o.driver_add('location',2).driver; dr.type='SCRIPTED'; dr.expression=f"{amp}*sin(frame*2*pi/{st.PERIOD:.4f}+{phase})"

# ---- cast ----
def glasses(parent,loc,m=None,s=1.0):
    gs=[]
    for dx in (-0.11,0.11):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.065*s,minor_radius=0.012*s,location=(loc[0]+dx*s,loc[1]-0.285*s,loc[2]+0.03*s),major_segments=64,minor_segments=16)
        g=done(bpy.context.object,m or st.M['ink']); g.rotation_euler=(math.pi/2,0,0); g.parent=parent; gs.append(g)
    return gs
class Person: pass
def person(x,y,col='white',s=1.0,specs=False,phase=0.0,headmat=None):
    p=Person(); m=st.M[col] if isinstance(col,str) else col
    p.root=empty('person',loc=(x,y,0)); p.root.scale=(s,s,s)
    p.body=cyl(0.38,1.4,(0,0,0),m,0.19,p.root)
    p.hb=empty('hb',p.root); bob(p.hb,0.03,phase)
    p.hmove=empty('hm',p.hb)
    p.head=sphere(0.29,(0,0,1.85),headmat or m,p.hmove)
    p.specs=glasses(p.hmove,(0,0,1.85)) if specs else []
    p.hand=sphere(0.09,(0.45,-0.05,1.05),m,p.root)
    return p
def scientist(x,y,s=1.0): return person(x,y,'white',s,specs=True,phase=1.3)

# ---- set, light, camera, render ----
def cyclorama(col=None):
    st.setmat=mat('set',col or C['set'],0.6)
    bpy.ops.mesh.primitive_plane_add(size=1); o=bpy.context.object; bm=bmesh.new(); prof=[(-60,0),(2,0)]
    for i in range(1,21): a=i/20*math.pi/2; prof.append((2+math.sin(a)*4,4-math.cos(a)*4))
    prof+=[(6,10),(6,30)]
    vs=[[bm.verts.new((x,y,z)) for (y,z) in prof] for x in (-30,60)]
    for i in range(len(prof)-1): bm.faces.new((vs[0][i],vs[1][i],vs[1][i+1],vs[0][i+1]))
    bm.to_mesh(o.data); bm.free(); done(o,st.setmat); return o
def area(loc,tgt,size,energy,col=(1,0.95,0.88)):
    bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object; l.data.size=size; l.data.energy=energy; l.data.color=col
    l.rotation_euler=(Vector(tgt)-Vector(loc)).to_track_quat('-Z','Y').to_euler(); return l
def studio(cx=0,cy=0):
    k=area((cx-6,cy-4,6),(cx,cy,0.8),2.5,4200); area((cx+5,cy+3,4),(cx,cy,1),3,500,(0.85,0.9,1)); return k
def world():
    w=bpy.data.worlds.new('w'); st.sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=hexc('#DCE3EE'); w.node_tree.nodes['Background'].inputs[1].default_value=0.08
def camera():
    st.rig=empty('rig'); st.tgt=empty('tgt'); st.shk=empty('shake',st.rig)
    bpy.ops.object.camera_add(); cam=bpy.context.object; cam.parent=st.shk; st.sc.camera=cam; st.cam=cam
    tc=cam.constraints.new('TRACK_TO'); tc.target=st.tgt; tc.track_axis='TRACK_NEGATIVE_Z'; tc.up_axis='UP_Y'
    cam.data.dof.use_dof=True; cam.data.dof.focus_object=st.tgt; cam.data.dof.aperture_fstop=5.6; cam.data.sensor_fit='VERTICAL'; cam.data.sensor_height=36
    return cam
def shots(lst):
    """lst: (t0,t1,(pos0,tgt0,lens0),(pos1,tgt1,lens1),ease). Hard cuts between entries."""
    for t0,t1,(p0,g0,l0),(p1,g1,l1),ez in lst:
        f0=F(t0); f1=min(F(t1)-1,st.END)
        for o,a,b in ((st.rig,p0,p1),(st.tgt,g0,g1)):
            key(o,'location',0,a,ez,f0); key(o,'location',0,b,'CONSTANT',f1)
        bpy.context.preferences.edit.keyframe_new_interpolation_type=ez; st.cam.data.lens=l0; st.cam.data.keyframe_insert('lens',frame=f0)
        bpy.context.preferences.edit.keyframe_new_interpolation_type='CONSTANT'; st.cam.data.lens=l1; st.cam.data.keyframe_insert('lens',frame=f1)
def handheld(t0,t1,amp=0.012):
    random.seed(3); f=F(t0); key(st.shk,'location',0,(0,0,0),'BEZIER',f-1)
    while f<F(t1):
        key(st.shk,'location',0,(random.uniform(-amp,amp),random.uniform(-amp/2,amp/2),random.uniform(-amp,amp)),'BEZIER',f); f+=2
    key(st.shk,'location',0,(0,0,0),'BEZIER',F(t1))
def finish(path):
    sc=st.sc
    sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=16; sc.cycles.use_denoising=True
    sc.render.use_motion_blur=True; sc.render.motion_blur_shutter=0.5; sc.render.use_persistent_data=True
    sc.render.resolution_x=720; sc.render.resolution_y=1280
    sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Medium High Contrast'
    sc.render.use_overwrite=False; sc.render.use_placeholder=True
    sc.render.filepath=path; bpy.ops.wm.save_as_mainfile(filepath=path+'scene.blend'); print('saved',path)
