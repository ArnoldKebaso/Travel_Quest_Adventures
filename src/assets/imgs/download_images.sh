#!/bin/bash
mkdir -p tour-images
cd tour-images

urls=(
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1601467034225-609c87b8e678?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1548625361-3c8b9d1c67d3?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1586276390037-9c09a71dd3d3?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1558618990-fbd2c02c45f5?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&h=350&fit=crop&auto=format&q=75"
  "https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=500&h=350&fit=crop&auto=format&q=75"
)

i=1
for url in "${urls[@]}"; do
  filename=$(printf "tour_image_%02d.jpg" "$i")
  echo "Downloading $filename ..."
  curl -L "$url" -o "$filename"
  ((i++))
done

echo " All downloads complete! Images saved in $(pwd)"
