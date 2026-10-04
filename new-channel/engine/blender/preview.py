# Contact sheet of chosen times at low quality: python3 preview.py scene.blend t1,t2,... out.png
import bpy, sys, os, subprocess
blend, times, out = sys.argv[-3], [float(x) for x in sys.argv[-2].split(',')], sys.argv[-1]
bpy.ops.wm.open_mainfile(filepath=blend); sc=bpy.context.scene
sc.cycles.samples=6; sc.render.use_motion_blur=False; sc.render.resolution_x=360; sc.render.resolution_y=640; sc.render.use_overwrite=True
fs=[]
for t in times:
    sc.frame_set(int(round(t*24))+1); p=f'{out}_{t:05.1f}.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True); fs.append(p)
from PIL import Image, ImageDraw
n=len(fs); cols=min(n,6); rows=(n+cols-1)//cols
s=Image.new('RGB',(cols*250+10,rows*455+10),'white'); d=ImageDraw.Draw(s)
for i,(f,t) in enumerate(zip(fs,times)):
    im=Image.open(f).resize((240,427)); x,y=10+(i%cols)*250,10+(i//cols)*455; s.paste(im,(x,y)); d.text((x+4,y+430),f'{t}s',fill='black'); os.remove(f)
s.save(out); print('sheet',out)
