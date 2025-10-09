#!/bin/bash
mkdir -p tour_details-images
cd tour_details-images

urls=(
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format&q=75',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format&q=75',
  'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop&auto=format&q=75',
  'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop&auto=format&q=75'
)

i=1
for url in "${urls[@]}"; do
  filename=$(printf "tour_deyails_image_%02d.jpg" "$i")
  echo "Downloading $filename ..."
  curl -L "$url" -o "$filename"
  ((i++))
done

echo " All downloads complete! Images saved in $(pwd)"
