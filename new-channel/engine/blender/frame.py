import bpy, math, sys
from mathutils import Vector
out = sys.argv[-1] if sys.argv[-1].endswith('.png') else '/tmp/f.png'
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def hexc(h, a=1): h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return [((x/12.92) if x<=0.04045 else ((x+0.055)/1.055)**2.4) for x in c]+[a]
def mat(name, col, rough=0.55, sss=0.0, emit=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=hexc(col); b.inputs['Roughness'].default_value=rough
    b.inputs['Subsurface Weight'].default_value=sss; b.inputs['Subsurface Radius'].default_value=(0.05,0.03,0.02)
    if emit: b.inputs['Emission Color'].default_value=hexc(col); b.inputs['Emission Strength'].default_value=emit
    return m
def obj_done(o, m, bevel=0, sub=0, smooth=True):
    o.data.materials.append(m)
    if bevel:
        md=o.modifiers.new('b','BEVEL'); md.width=bevel; md.segments=8; md.limit_method='ANGLE'
    if sub: o.modifiers.new('s','SUBSURF').levels=sub; o.modifiers['s'].render_levels=sub
    if smooth: bpy.ops.object.shade_smooth()
    return o
def sphere(r, loc, m, scale=(1,1,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=96, ring_count=48); o=bpy.context.object; o.scale=scale; return obj_done(o,m)
def cyl(r, h, loc, m, bev):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=(loc[0],loc[1],loc[2]+h/2), vertices=128); return obj_done(bpy.context.object,m,bevel=bev)
def cube(size, loc, m, bev):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.scale=[s/2 for s in size]; bpy.ops.object.transform_apply(scale=True); return obj_done(o,m,bevel=bev)

C = dict(set='#E4DACB', white='#F4F1EB', grey='#A9B2BF', red='#E2432A', gold='#F0B23A', ink='#2A2F3A')
M = {k: mat(k, v) for k,v in C.items()}
M['red'].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.35
M['gold']=mat('gold2',C['gold'],0.3,emit=0.15)

# seamless cyclorama: floor + curved wall
bpy.ops.mesh.primitive_plane_add(size=1)
o=bpy.context.object; me=o.data
import bmesh
bm=bmesh.new(); prof=[]
for i in range(0,41):  # floor to wall curve in Y-Z
    if i<=10: prof.append((-8+ i*1.0, 0))
    elif i<=30: a=(i-10)/20*math.pi/2; prof.append((2+math.sin(a)*4, 4-math.cos(a)*4))
    else: prof.append((6, 4+(i-30)*1.2))
vs=[[bm.verts.new((x,y,z)) for (y,z) in prof] for x in (-15,15)]
for i in range(len(prof)-1): bm.faces.new((vs[0][i],vs[1][i],vs[1][i+1],vs[0][i+1]))
bm.to_mesh(me); bm.free(); obj_done(o, M['set'])

# box (open-front cubby), pigeon, button
bx,by=0.75,0.6
w,h,d,t=2.0,1.7,1.6,0.12
for size,loc in [((w,d,t),(0,0,t/2)),((w,d,t),(0,0,h)),((t,d,h),(-w/2,0,h/2)),((t,d,h),(w/2,0,h/2)),((w,t,h),(0,d/2,h/2))]:
    o=cube(size,(loc[0]+bx,loc[1]+by,loc[2]),M['white'],0.05)
cyl(0.16,0.06,(bx+0.5,by+d/2-0.06,0.95),M['red'],0.025).rotation_euler=(math.pi/2,0,0)
bpy.context.object.location=(bx+0.5,by+d/2-0.06,0.95)
# pigeon: egg body + floating head + beak
px,py=bx-0.2,by-0.05
sphere(0.32,(px,py,0.12+0.3),M['grey'],(0.95,1.15,0.9)).rotation_euler=(0.3,0,0.5)
sphere(0.17,(px+0.06,py-0.12,0.98),M['grey'])
bpy.ops.mesh.primitive_cone_add(radius1=0.045,depth=0.14,location=(px+0.14,py-0.27,0.96),vertices=48); b=obj_done(bpy.context.object,M['gold']); b.rotation_euler=(math.radians(90),0,math.radians(-25)+math.pi)
for dx in (-0.06,0.1): sphere(0.022,(px+dx,py-0.26,1.02),M['ink'])
# pellets
for i,(x,z) in enumerate([(0.35,0.45),(0.42,0.62),(0.33,0.78)]): sphere(0.05,(bx+x,by-0.05,z),M['gold'])

# scientist: pill body + floating head + glasses
sx,sy=-1.05,-0.55
cyl(0.38,1.4,(sx,sy,0),M['white'],0.19)
sphere(0.29,(sx,sy,1.85),M['white'])
for dx in (-0.11,0.11):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.065,minor_radius=0.012,location=(sx+dx,sy-0.285,1.88),major_segments=64,minor_segments=16)
    o=obj_done(bpy.context.object,M['ink']); o.rotation_euler=(math.pi/2,0,0)
sphere(0.09,(sx+0.45,sy-0.05,1.05),M['white'])

# camera
bpy.ops.object.camera_add(location=(0.2,-11.5,2.6)); cam=bpy.context.object; sc.camera=cam
cam.data.lens=52; cam.data.dof.use_dof=True; cam.data.dof.focus_distance=11.3; cam.data.dof.aperture_fstop=4.0
d=Vector((0.2,0,1.25))-cam.location; cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()

# lights: big soft key, rim, world
bpy.ops.object.light_add(type='AREA',location=(-5,-5,7)); k=bpy.context.object; k.data.size=3.5; k.data.energy=3200; k.data.color=(1,0.95,0.88)
d=Vector((0,0,0.8))-k.location; k.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
bpy.ops.object.light_add(type='AREA',location=(5,3,4)); rl=bpy.context.object; rl.data.size=3; rl.data.energy=500; rl.data.color=(0.85,0.9,1)
d=Vector((0,0,1))-rl.location; rl.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(*hexc('#DCE3EE')[:3],1); w.node_tree.nodes['Background'].inputs[1].default_value=0.12

sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=int(sys.argv[-2]) if sys.argv[-2].isdigit() else 64
sc.cycles.use_denoising=True; sc.render.resolution_x=1080; sc.render.resolution_y=1920
sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Medium High Contrast'
sc.render.filepath=out; bpy.ops.render.render(write_still=True); print('done',out)
