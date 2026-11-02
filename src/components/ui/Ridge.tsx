import type { CSSProperties } from "react";
import { RIDGE_HEIGHT, RIDGE_WIDTH, ridgeFill, ridgeLine, type RidgeShape } from "@/lib/ridge";

interface RidgeProps {
  /**
   * `static`: a divider. `draw`: starts clipped and is revealed left to right by GSAP (see `data-ridge`).
   * `progress`: scaleX is driven by scroll (origin left).
   */
  mode?: "static" | "draw" | "progress";
  shape?: RidgeShape;
  className?: string;
  style?: CSSProperties;
}

/**
 * The signature component: the ridge line as a 1px stroke in currentColor.
 * Decorative, so always aria-hidden. The draw mode has a defined end state without JavaScript:
 * CSS only hides it while `data-motion="full"` is set, and a failsafe reveals it if GSAP never runs.
 */
export function Ridge({ mode = "static", shape = "main", className = "", style }: RidgeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${RIDGE_WIDTH} ${RIDGE_HEIGHT}`}
      preserveAspectRatio="none"
      data-ridge={mode}
      className={`block w-full overflow-visible ${mode === "draw" ? "ridge-draw" : ""} ${
        mode === "progress" ? "origin-left" : ""
      } ${className}`}
      style={style}
    >
      <path
        d={ridgeLine(shape)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface RidgeFillProps {
  shape?: RidgeShape;
  className?: string;
  style?: CSSProperties;
}

/** A filled landform below the crest. Used for the layered hero and story scenes, not as an ornament. */
export function RidgeFill({ shape = "main", className = "", style }: RidgeFillProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${RIDGE_WIDTH} ${RIDGE_HEIGHT}`}
      preserveAspectRatio="none"
      className={`block h-full w-full ${className}`}
      style={style}
    >
      <path d={ridgeFill(shape)} fill="currentColor" />
    </svg>
  );
}

/** 24px ridge glyph that opens every section label. */
export function RidgeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 10"
      width="24"
      height="10"
      className={`inline-block shrink-0 ${className}`}
    >
      <path
        d="M0 8.5 C3 8 5 6 8 6.4 C10.5 6.8 12 3 14.5 2 C17 1 18 4.5 20.5 5.6 C22 6.3 23 6.2 24 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
