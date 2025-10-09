#!/bin/bash
mkdir -p home-images
cd home-images

urls=(
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
)

i=1
for url in "${urls[@]}"; do
  filename=$(printf "home_image_%02d.jpg" "$i")
  echo "Downloading $filename ..."
  curl -L "$url" -o "$filename"
  ((i++))
done

echo " All downloads complete! Images saved in $(pwd)"
