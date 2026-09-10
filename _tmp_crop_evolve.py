from PIL import Image
from pathlib import Path

src = Path(r"C:\Projects\AIWA Lander\public\images\visuals\evolve-it.png")
im = Image.open(src).convert("RGBA")
width, height = im.size
print("size", width, height)

# Find the inner UI: pixels that are not near-black and not fully transparent.
pixels = im.load()
min_x, min_y, max_x, max_y = width, height, 0, 0
hits = 0
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a < 20:
            continue
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        # Dark page chrome vs the card: keep anything that's not the void.
        if luma > 18 or r > 40 or g > 30:
            hits += 1
            if x < min_x:
                min_x = x
            if y < min_y:
                min_y = y
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

print("bbox", min_x, min_y, max_x, max_y, "hits", hits)
print("content", max_x - min_x + 1, "x", max_y - min_y + 1)
