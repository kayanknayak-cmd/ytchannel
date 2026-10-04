# Render frames [start, end] of a built scene into outdir (used by the GitHub Actions render farm).
import bpy, sys, glob
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else sys.argv[1:]
blend=glob.glob(args[0]+'/*.blend')[0]; start,end,out=int(args[1]),int(args[2]),args[3]
bpy.ops.wm.open_mainfile(filepath=blend); sc=bpy.context.scene
sc.frame_start=start; sc.frame_end=end; sc.render.filepath=out.rstrip('/')+'/'
bpy.ops.render.render(animation=True); print('CHUNK DONE',start,end)
