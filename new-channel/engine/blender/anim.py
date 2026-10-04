# Render a scene's animation (resumes: existing frames are skipped). Optional 2nd arg: last frame to render.
import bpy,sys
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else sys.argv[1:]
bpy.ops.wm.open_mainfile(filepath=args[0]); sc=bpy.context.scene
if len(args)>1: sc.frame_end=int(args[1])
bpy.ops.render.render(animation=True); print('ANIM DONE')
