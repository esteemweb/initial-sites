#!/usr/bin/env python
"""
Le Comble — woven silk textures (user request, 24 September 2026).

    python scripts/generate_textures.py

Three seamless tiles in public/texture, each 960 × 960 px and shown at
480 × 480 CSS px (2× for sharp screens):

    silk-indigo-velvet.webp       the page ground: indigo crushed velvet
    silk-indigo-velvet-field.webp the same velvet, crushed differently: the
                                  "field" sections (rhythm without a new colour)
    silk-laque-brocade.webp       madder red damask with the figure shot in
                                  antique gold: the one band

The page moved to indigo velvet on 25 Sep 2026 (user's choice from five indigo
textures); before that it was red silk, emerald, ciel and chaux.

How it is woven (all periodic over the tile, so the tiles join invisibly):
  * threads    — one row/column per 4 px (2 CSS px), each with its own slight
                 thickness and tone, like real silk yarn;
  * twill      — a 3/1 diagonal float, the plain ground weave;
  * damask     — the canut technique: the motif is woven warp-faced
                 (vertical floats, more sheen) against a weft-faced ground
                 (horizontal floats), so it reads by the direction of the
                 thread, not by a second colour. The motif is an ogee
                 lattice with a flower at each crossing — the classic Lyon
                 silk layout;
  * sheen      — a very soft light falloff across the float, as silk has,
                 plus a slow shimmer that swells across the whole tile.

Colour: only the palette tokens. Velvet varies around indigo #12266B; the
band's red around laque #A5231A
(the ground since 24 Sep 2026, after ciel and emerald), their light side
pulled toward or #DDA73F; the indigo tile around #12266B.
The script prints the worst text contrast against each tile (chaux text on
both) so the texture can never quietly break readability.
"""

from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "texture"
N = 960  # tile size in px (shown at 480 CSS px)
THREAD = 4  # px per thread
T = N // THREAD  # threads per tile: 240
REPEAT = 1  # one large damask motif per tile (480 CSS px)

LAQUE = np.array([0xA5, 0x23, 0x1A], np.float64)
OR = np.array([0xDD, 0xA7, 0x3F], np.float64)
INDIGO = np.array([0x12, 0x26, 0x6B], np.float64)
CHAUX = np.array([0xFF, 0xFF, 0xFF], np.float64)

rng = np.random.default_rng(1831)
y, x = np.mgrid[0:N, 0:N].astype(np.float64)
u, v = x / N, y / N  # 0..1 over the tile, periodic

# per-thread character (periodic because it is indexed by thread number)
warp_tone = rng.normal(0, 1, T)  # vertical threads
weft_tone = rng.normal(0, 1, T)  # horizontal threads
col = (x // THREAD).astype(int) % T
row = (y // THREAD).astype(int) % T
wx = (x % THREAD) / THREAD  # position across a vertical thread, 0..1
wy = (y % THREAD) / THREAD


def roundness(p):
    """A thread's cross-section: bright in the middle, dark at the edges."""
    return np.sin(np.pi * p) ** 0.8


warp_face = roundness(wx) * (1 + 0.18 * warp_tone[col])  # vertical floats
weft_face = roundness(wy) * (1 + 0.18 * weft_tone[row])  # horizontal floats


def twill_mask():
    """3/1 twill: warp floats over three weft threads, shifting one each row."""
    return ((col - row) % 4) != 0


def damask_mask():
    """Ogee lattice with a flower at each crossing, REPEAT× per tile."""
    a = 2 * np.pi * REPEAT * u
    b = 2 * np.pi * REPEAT * v
    # ogee: two families of sine curves crossing — the onion-shaped lattice
    lattice = np.abs(np.sin(a / 2 + 0.55 * np.sin(b))) < 0.16
    lattice |= np.abs(np.sin(a / 2 - 0.55 * np.sin(b))) < 0.16
    # flower at each lattice centre: eight petals
    cu = (REPEAT * u) % 1 - 0.5
    cv = (REPEAT * v) % 1 - 0.5
    r = np.hypot(cu, cv)
    th = np.arctan2(cv, cu)
    petals = r < 0.20 + 0.07 * np.cos(8 * th)
    heart = r < 0.06
    return lattice | (petals & ~heart)


def weave(motif):
    """Luminance offset field, mean ≈ 0: ground weft-faced, motif warp-faced."""
    ground = np.where(twill_mask(), weft_face, warp_face * 0.85)
    satin = warp_face * 1.08 + 0.10  # warp floats catch more light
    lum = np.where(motif, satin, ground) if motif is not None else ground
    # soft sheen band along the float direction, and fine yarn grain
    lum = lum + 0.04 * np.sin(2 * np.pi * (u + v))
    # silk shimmer: a slow, periodic swell of light across the cloth
    lum = lum + 0.12 * np.sin(2 * np.pi * u) * np.cos(2 * np.pi * v)
    lum = lum + rng.normal(0, 0.05, lum.shape)
    return lum - lum.mean()


def render(base, lum, amount, toward_light=CHAUX, toward_dark=None, light=1.0):
    """Push the base colour lighter/darker by at most `amount` of the way.
    `light` scales the lightening side only: on a dark ground under light text,
    the lightest threads are what erode contrast, so they are held back."""
    toward_dark = np.zeros(3) if toward_dark is None else toward_dark
    # scale by the 98th percentile, not the single brightest outlier, so the
    # threads themselves carry the texture instead of a few noise pixels
    k = np.clip(lum / (np.percentile(np.abs(lum), 98) + 1e-9), -1, 1)[..., None] * amount
    rgb = np.where(k > 0, base + (toward_light - base) * k * light, base + (base - toward_dark) * k)
    return np.clip(rgb, 0, 255)


def lum_rel(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def contrast(a, b):
    hi, lo = np.maximum(a, b), np.minimum(a, b)
    return (hi + 0.05) / (lo + 0.05)


def save(name, rgb, text):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(rgb.round().astype(np.uint8), "RGB")
    path = OUT / name
    img.save(path, "WEBP", quality=82, method=6)
    L = lum_rel(rgb)
    worst = contrast(L, lum_rel(text[None, None, :])).min()
    print(f"{name:26} {path.stat().st_size // 1024:4d} KB  worst text contrast {worst:.2f}:1")


def brocade(base, motif, gold, lum, amount, light):
    """Damask whose motif is shot with gold weft: the figure shifts `gold` of
    the way toward or, then the weave is rendered over it."""
    tinted = np.where(motif[..., None], base + (OR - base) * gold, base)
    k = np.clip(lum / (np.percentile(np.abs(lum), 98) + 1e-9), -1, 1)[..., None] * amount
    rgb = np.where(k > 0, tinted + (OR - tinted) * k * light, tinted - tinted * -k)
    return np.clip(rgb, 0, 255)


def velvet(seed):
    """Crushed velvet: no visible thread — the pile hides it — only soft pools
    where the nap catches the light, with creases between them. Built from
    whole-number frequencies over the tile, so it repeats seamlessly."""
    r = np.random.default_rng(seed)
    lum = np.zeros_like(u)
    for f in (1, 2, 3, 5):
        for _ in range(3):
            a, b, p = r.integers(-f, f + 1), r.integers(-f, f + 1), r.uniform(0, 2 * np.pi)
            lum += np.sin(2 * np.pi * (a * u + b * v) + p) / f
    lum = np.tanh(1.3 * lum)  # crushed: plateaus and sharp creases
    lum = lum + r.normal(0, 0.12, lum.shape)  # the pile's fine grain
    return lum - lum.mean()


motif = damask_mask()
save("silk-indigo-velvet.webp", render(INDIGO, velvet(7), 0.26), CHAUX)
save("silk-indigo-velvet-field.webp", render(INDIGO, velvet(19), 0.26), CHAUX)
save("silk-laque-brocade.webp", brocade(LAQUE, motif, 0.16, weave(motif), 0.26, light=0.20), CHAUX)
