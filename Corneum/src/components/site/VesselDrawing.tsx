import { useId } from "react";

/* A technical drawing of Vessel 01, drawn from BRIEF §6: 180 × 62 mm,
   graduations every 25 ml, the 200 ML line. Scale: 2 units per mm.
   The fill level is placed from the stated volumes, assuming 3 mm walls
   (56 mm bore): 200 ml stands ~81 mm above the base. That wall thickness
   is a drafting assumption (DATA-NOTES.md).

   Layers can be shown or hidden so the drawing can be assembled step by
   step (home page pin) or shown whole (product page). Hidden layers fade
   with ease-enter; `fill` is 0–1 of the 200 ml level. */

const TOP = 30; // cap top
const GLASS_TOP = 70;
const FLOOR = 366; // top of the steel base
const BASE_BOTTOM = 390;
const LEFT = 60;
const RIGHT = 184; // 62 mm wide
const BORE_L = 66;
const BORE_R = 178;
const ML_25 = 20.3; // 25 ml of height in a 56 mm bore, in drawing units
const DOSE_Y = FLOOR - ML_25 * 8; // 200 ml

export type VesselLayers = {
  body?: boolean;
  ticks?: boolean;
  line?: boolean;
  cap?: boolean;
  capNote?: boolean;
  /** 0–1 of the 200 ml level */
  fill?: number;
  /** Animate fill changes (920ms) instead of following the value directly. */
  animateFill?: boolean;
};

const layer = (on: boolean) => `transition-opacity duration-720 ease-enter ${on ? "opacity-100" : "opacity-0"}`;

export function VesselDrawing({
  body = true,
  ticks = true,
  line = true,
  cap = true,
  capNote = false,
  fill = 1,
  animateFill = false,
  className = "",
  ref,
}: VesselLayers & { className?: string; ref?: React.Ref<SVGSVGElement> }) {
  const titleId = useId();
  const tickYs = Array.from({ length: 7 }, (_, i) => FLOOR - ML_25 * (i + 1));

  return (
    <svg ref={ref} viewBox="0 0 320 450" role="img" aria-labelledby={titleId} className={`w-full text-ink ${className}`}>
      <title id={titleId}>
        Technical drawing of Vessel 01: 180 mm tall, 62 mm across, with graduation marks every 25 ml and a dose line at
        200 ml. Pour the concentrate to the collar, fill with water to the line, shake once.
      </title>

      {/* fill, up to the dose line */}
      <rect
        x={BORE_L}
        y={DOSE_Y}
        width={BORE_R - BORE_L}
        height={FLOOR - DOSE_Y}
        className={`fill-hairline ${animateFill ? "transition-transform duration-920 ease-enter" : ""}`}
        style={{ transformBox: "fill-box", transformOrigin: "bottom", transform: `scaleY(${Math.max(0, Math.min(1, fill))})` }}
      />

      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <g className={layer(cap)}>
          {/* cap, knurled */}
          <rect x={LEFT + 4} y={TOP} width={RIGHT - LEFT - 8} height={20} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={LEFT + 12 + i * 8} x2={LEFT + 12 + i * 8} y1={TOP + 4} y2={TOP + 16} strokeWidth="0.75" />
          ))}
          {/* collar */}
          <rect x={LEFT} y={TOP + 20} width={RIGHT - LEFT} height={GLASS_TOP - TOP - 20} />
        </g>

        <g className={layer(body)}>
          {/* glass body */}
          <rect x={LEFT} y={GLASS_TOP} width={RIGHT - LEFT} height={FLOOR - GLASS_TOP} />
          <line x1={BORE_L} x2={BORE_L} y1={GLASS_TOP} y2={FLOOR} strokeOpacity="0.12" />
          <line x1={BORE_R} x2={BORE_R} y1={GLASS_TOP} y2={FLOOR} strokeOpacity="0.12" />
          {/* weighted base */}
          <rect x={LEFT} y={FLOOR} width={RIGHT - LEFT} height={BASE_BOTTOM - FLOOR} />
          {/* dimension: height */}
          <line x1={252} x2={252} y1={TOP} y2={BASE_BOTTOM} strokeWidth="1" />
          <line x1={246} x2={258} y1={TOP} y2={TOP} strokeWidth="1" />
          <line x1={246} x2={258} y1={BASE_BOTTOM} y2={BASE_BOTTOM} strokeWidth="1" />
          {/* dimension: diameter */}
          <line x1={LEFT} x2={RIGHT} y1={414} y2={414} strokeWidth="1" />
          <line x1={LEFT} x2={LEFT} y1={408} y2={420} strokeWidth="1" />
          <line x1={RIGHT} x2={RIGHT} y1={408} y2={420} strokeWidth="1" />
        </g>

        {/* graduations every 25 ml */}
        <g className={layer(ticks)}>
          {tickYs.map((y) => (
            <line key={y} x1={BORE_L} x2={BORE_L + 14} y1={y} y2={y} strokeWidth="1" />
          ))}
        </g>

        {/* the dose line */}
        <line className={layer(line)} x1={BORE_L} x2={BORE_R} y1={DOSE_Y} y2={DOSE_Y} strokeWidth="1" />

        {/* leader to the cap note */}
        <line className={layer(capNote)} x1={(LEFT + RIGHT) / 2} x2={(LEFT + RIGHT) / 2} y1={TOP - 10} y2={TOP - 2} strokeWidth="1" />
      </g>

      <g className="type-data" fill="currentColor">
        <text className={layer(line)} x={RIGHT + 8} y={DOSE_Y + 5}>
          200 ML
        </text>
        <g className={layer(body)}>
          <text transform={`translate(270 ${(TOP + BASE_BOTTOM) / 2}) rotate(90)`} textAnchor="middle">
            180 MM
          </text>
          <text x={(LEFT + RIGHT) / 2} y={442} textAnchor="middle">
            Ø 62 MM
          </text>
        </g>
        <text className={layer(capNote)} x={(LEFT + RIGHT) / 2} y={TOP - 14} textAnchor="middle">
          90° TURN
        </text>
      </g>
    </svg>
  );
}
