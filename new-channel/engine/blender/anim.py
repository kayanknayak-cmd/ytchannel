import bpy,sys
bpy.ops.wm.open_mainfile(filepath=sys.argv[-1]); bpy.ops.render.render(animation=True); print('ANIM DONE')
