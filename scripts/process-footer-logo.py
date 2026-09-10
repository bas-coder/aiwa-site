"""
Bake footer wordmark FX into aiwa-logo-footer.webp.

Stack (filters → layer style):
  1. Pixel-sort distortion — threshold 137, direction left, key SAT
  2. Light & FX — Floyd–Steinberg dither, scale 3
  3. Grain — 7%
  4. Pattern overlay — plus, #ffffff, opacity 10%, blend Normal
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "aiwa-logo.webp"
OUT = ROOT / "public" / "images" / "aiwa-logo-footer.webp"

GRAIN_AMOUNT = 0.07
PIXEL_SORT_THRESHOLD = 137
PIXEL_SORT_DIRECTION = "left"
PIXEL_SORT_KEY = "sat"
FS_SCALE = 3
PATTERN_OPACITY = 0.10
PATTERN_COLOR = np.array([255, 255, 255], dtype=np.float64)
PLUS_TILE = 8


def saturation(rgb: np.ndarray) -> np.ndarray:
    """HSV-style saturation in 0..1 from float RGB 0..255."""
    r = rgb[..., 0]
    g = rgb[..., 1]
    b = rgb[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    delta = mx - mn
    sat = np.zeros_like(mx, dtype=np.float64)
    nonzero = mx > 1e-6
    sat[nonzero] = delta[nonzero] / mx[nonzero]
    return sat


def luminance(rgb: np.ndarray) -> np.ndarray:
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def pixel_sort_row(row_rgba: np.ndarray, threshold: int, key: str, direction: str) -> np.ndarray:
    """Interval pixel-sort one RGBA row (Asendorf-style). Threshold on luminance 0..255."""
    rgb = row_rgba[:, :3].astype(np.float64)
    alpha = row_rgba[:, 3]
    lum = luminance(rgb)
    # Only opaque-ish logo pixels participate in sort intervals.
    mask = (lum >= threshold) & (alpha > 8)

    if key == "sat":
        keys = saturation(rgb)
    else:
        keys = lum / 255.0

    out = row_rgba.copy()
    n = len(mask)
    i = 0
    while i < n:
        if not mask[i]:
            i += 1
            continue
        j = i
        while j < n and mask[j]:
            j += 1
        interval = out[i:j]
        order = np.argsort(keys[i:j], kind="stable")
        if direction == "left":
            # High-sat / high-key drifts left (descending).
            order = order[::-1]
        out[i:j] = interval[order]
        i = j
    return out


def apply_pixel_sort(rgba: np.ndarray) -> np.ndarray:
    out = rgba.copy()
    for y in range(out.shape[0]):
        out[y] = pixel_sort_row(
            out[y],
            threshold=PIXEL_SORT_THRESHOLD,
            key=PIXEL_SORT_KEY,
            direction=PIXEL_SORT_DIRECTION,
        )
    return out


def floyd_steinberg_channel(channel: np.ndarray, levels: int = 16) -> np.ndarray:
    """Quantize one float channel 0..255 with Floyd–Steinberg error diffusion."""
    h, w = channel.shape
    work = channel.astype(np.float64).copy()
    step = 255.0 / max(1, levels - 1)
    for y in range(h):
        for x in range(w):
            old = work[y, x]
            new = round(old / step) * step
            work[y, x] = new
            err = old - new
            if x + 1 < w:
                work[y, x + 1] += err * 7 / 16
            if y + 1 < h:
                if x > 0:
                    work[y + 1, x - 1] += err * 3 / 16
                work[y + 1, x] += err * 5 / 16
                if x + 1 < w:
                    work[y + 1, x + 1] += err * 1 / 16
    return np.clip(work, 0, 255)


def apply_floyd_steinberg_scaled(rgba: np.ndarray, scale: int) -> np.ndarray:
    """Light & FX: F-S dither at `scale` (process at 1/scale, nearest up)."""
    img = Image.fromarray(rgba, mode="RGBA")
    w, h = img.size
    small_w = max(1, w // scale)
    small_h = max(1, h // scale)
    small = img.resize((small_w, small_h), Image.Resampling.BOX)
    arr = np.asarray(small).astype(np.float64)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    dithered = np.zeros_like(rgb)
    for c in range(3):
        dithered[:, :, c] = floyd_steinberg_channel(rgb[:, :, c], levels=24)
    out_small = np.dstack([dithered, alpha]).astype(np.uint8)
    out_img = Image.fromarray(out_small, mode="RGBA").resize((w, h), Image.Resampling.NEAREST)
    return np.asarray(out_img)


def apply_grain(rgba: np.ndarray, amount: float, seed: int = 1847) -> np.ndarray:
    rng = np.random.default_rng(seed)
    rgb = rgba[:, :, :3].astype(np.float64)
    alpha = rgba[:, :, 3]
    noise = rng.normal(0.0, 255.0 * amount, size=rgb.shape[:2])
    # Monochrome grain (film-like), only on logo pixels.
    for c in range(3):
        rgb[:, :, c] = np.where(alpha > 8, rgb[:, :, c] + noise, rgb[:, :, c])
    out = rgba.copy()
    out[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return out


def plus_tile(size: int = PLUS_TILE) -> np.ndarray:
    """White plus on transparent — Photoshop-style plus pattern cell."""
    tile = np.zeros((size, size), dtype=np.float64)
    mid = size // 2
    arm = max(1, size // 8)
    tile[mid - arm : mid + arm + 1, mid] = 1.0
    tile[mid, mid - arm : mid + arm + 1] = 1.0
    return tile


def apply_plus_pattern(rgba: np.ndarray, opacity: float) -> np.ndarray:
    h, w = rgba.shape[:2]
    tile = plus_tile(PLUS_TILE)
    th, tw = tile.shape
    ys = np.arange(h) % th
    xs = np.arange(w) % tw
    pattern = tile[np.ix_(ys, xs)]  # 0..1
    rgb = rgba[:, :, :3].astype(np.float64)
    alpha = rgba[:, :, 3].astype(np.float64)
    # Normal blend of white pattern at `opacity`, masked to logo alpha.
    cover = pattern * opacity * (alpha / 255.0)
    for c in range(3):
        rgb[:, :, c] = rgb[:, :, c] * (1.0 - cover) + PATTERN_COLOR[c] * cover
    out = rgba.copy()
    out[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return out


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    rgba = np.asarray(img).copy()

    rgba = apply_pixel_sort(rgba)
    rgba = apply_floyd_steinberg_scaled(rgba, FS_SCALE)
    rgba = apply_grain(rgba, GRAIN_AMOUNT)
    rgba = apply_plus_pattern(rgba, PATTERN_OPACITY)

    out_img = Image.fromarray(rgba, mode="RGBA")
    out_img.save(OUT, "WEBP", quality=92, method=6)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes) from {SRC.name} {img.size}")


if __name__ == "__main__":
    main()
