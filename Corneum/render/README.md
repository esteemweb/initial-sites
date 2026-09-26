# Vessel 01 renders

Two things are rendered here in Blender (Cycles), from a procedural model built to the brief's spec (§6):
- the home page's Vessel 01 flight;
- the Vessel 01 product image.

Nothing 3D ships to the site. Only encoded frames do.

## The flight (home page)
90 square frames. `src/lib/flight.ts` maps scroll to frames, and `src/components/site/VesselFlight.tsx` draws them.

| Frames | Scroll | Motion |
|---|---|---|
| 1 | hero, at rest | upright, −25°, standing on the floor with its shadow |
| 2–36 | top of page → pin | lifts off, rolls 32° and pitches 15° toward the camera while turning to its back, then lands |
| 37–66 | pin 0–0.5 | half-turn back to the front: the etching comes round through the glass |
| 67–82 | pin 0.5–0.75 | fills to 200 ML |
| 83–90 | pin 0.75–1 | the cap's quarter-turn |

The glass renders with transparent alpha (`film_transparent_glass`), so the page's type shows through it. Mid-flight there's no floor shadow. The tumble frames are rendered twice, with and without the floor, and the encoder fades the shadow out as the vessel lifts off.

```
B=E:/tools/blender/blender.exe
$B -b -P render/vessel.py -- --shot flight --samples 128 --width 1400 --height 1400 --frames 1-5,31-90 --out render/flight/shadow
$B -b -P render/vessel.py -- --shot flight --samples 128 --width 1400 --height 1400 --no-shadow --frames 2-35 --out render/flight/clear
node render/encode-flight.mjs      # --measure prints the crop only
```

This takes about 50 seconds a frame on an RTX 4050 (OptiX), or about 80 minutes for all 99.

## The product image (range pages, share cards)
```
$B -b -P render/vessel.py -- --frames 52 --out render/frames --samples 160
node render/encode.mjs
```
This is the turntable shot: front on, filled, 1600×2000.

After replacing either output, delete `.next/cache/images` and rebuild.

## Notes
- `--frames 36` or `--frames 1,12,24` renders single frames. Use `--width/--height/--samples` for quick tests.
- The fixed render seed keeps the noise identical from frame to frame, so the scrub doesn't flicker.

## What is modelled
- **Glass body:** IOR 1.47, 3 mm walls.
- **Etching:** graduations every 25 ml and one dose line with `200 ML` in Geist Mono Medium, as a frosted etch.
- **Steel:** a brushed 316 steel collar with `CORNEUM` laser-etched, a knurled quarter-turn cap and a weighted base.
- **Fill height:** assumes a 56 mm bore, so 200 ml sits 81.2 mm up (DATA-NOTES.md).

Fonts: Geist Mono (OFL, see `fonts/OFL.txt`).
