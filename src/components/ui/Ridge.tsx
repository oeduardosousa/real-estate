import type { CSSProperties } from "react";
import { RIDGE_HEIGHT, RIDGE_WIDTH, ridgeFill, ridgeLine, type RidgeShape } from "@/lib/ridge";

interface RidgeProps {
  shape?: RidgeShape;
  className?: string;
  style?: CSSProperties;
}

/** The Serra do Curral crest as a filled landform below the line, in currentColor. Decorative. */
export function RidgeFill({ shape = "main", className = "", style }: RidgeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${RIDGE_WIDTH} ${RIDGE_HEIGHT}`}
      preserveAspectRatio="none"
      className={`ridge ${className}`}
      style={style}
    >
      <path d={ridgeFill(shape)} fill="currentColor" />
    </svg>
  );
}

/** The crest as a thin stroke in currentColor. Decorative. */
export function RidgeStroke({ shape = "main", className = "", style }: RidgeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${RIDGE_WIDTH} ${RIDGE_HEIGHT}`}
      preserveAspectRatio="none"
      className={`ridge ${className}`}
      style={style}
    >
      <path d={ridgeLine(shape)} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Small ridge glyph used in the wordmark and badges. */
export function RidgeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 10" width="24" height="10" className={className}>
      <path
        d="M0 8.5 C3 8 5 6 8 6.4 C10.5 6.8 12 3 14.5 2 C17 1 18 4.5 20.5 5.6 C22 6.3 23 6.2 24 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
