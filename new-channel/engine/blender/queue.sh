#!/bin/bash
# Render queue: one Blender render at a time (it already uses every core). Lines in queue.txt: NN|slug|blend|dur
# Re-reads queue.txt forever, so new scenes can be appended while it runs. Each finished video is encoded and pushed.
cd "$(dirname "$0")"; REPO=/home/user/ytchannel; NC=$REPO/new-channel
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
while true; do
  did=0
  while IFS='|' read -r nn slug blend dur; do
    [ -z "$nn" ] && continue; dir=$(dirname "$blend")
    [ -f "$dir/.done" ] || [ ! -f "$blend" ] && continue
    end=$(python3 -c "import math;print(math.ceil($dur*24))")
    echo "$(date) start $nn"
    if [ "$nn" = "01" ]; then  # already rendering from earlier; frames past the loop cut aren't needed
      while [ ! -s "$dir/$(printf %04d $end).png" ]; do sleep 30; done; sleep 40; pkill -f "anim.py v01.blend"
    else
      python3 anim.py "$blend" > "$dir/render.log" 2>&1
    fi
    mkdir -p $NC/finished
    $FF -y -loglevel error -framerate 24 -start_number 1 -i "$dir/%04d.png" -i $NC/videos/$nn-$slug/voiceover/original.mp3 \
      -frames:v $end -t $dur -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k \
      -movflags +faststart $NC/finished/$nn-$slug.mp4 && touch "$dir/.done"
    echo "$(date) done $nn"
    for i in 1 2 3 4 5; do
      (cd $REPO && git add new-channel/finished/$nn-$slug.mp4 && git commit -qm "Render video $nn ($slug)" && git push -q origin new-channel) && break; sleep $((i*10))
    done
    did=1; break
  done < queue.txt
  [ $did = 0 ] && sleep 60
done
