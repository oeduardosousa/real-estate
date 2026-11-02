/**
 * The ridge profile (DESIGN.md "Shapes"): a long, low, asymmetric crest with several gentle
 * inflections. Stylised, not cartographic. All paths share one 1600 x 200 viewBox and are
 * stretched to the container width (preserveAspectRatio="none"), so strokes use non-scaling-stroke.
 */

export const RIDGE_WIDTH = 1600;
export const RIDGE_HEIGHT = 200;

type Point = readonly [number, number];

/** The signature crest: seven inflections, rising to the east and falling away at the edge. */
const MAIN: readonly Point[] = [
  [0, 152],
  [150, 142],
  [300, 120],
  [450, 128],
  [600, 92],
  [740, 102],
  [880, 58],
  [1010, 74],
  [1140, 44],
  [1270, 84],
  [1420, 106],
  [1600, 96],
];

/** Back-to-front companions for layered scenes. Each is shifted and flattened from the main crest. */
const FAR: readonly Point[] = [
  [0, 96],
  [180, 84],
  [340, 98],
  [520, 66],
  [700, 78],
  [900, 48],
  [1080, 62],
  [1260, 34],
  [1440, 58],
  [1600, 50],
];

const MID: readonly Point[] = [
  [0, 124],
  [200, 108],
  [380, 118],
  [560, 84],
  [760, 96],
  [960, 70],
  [1160, 92],
  [1340, 64],
  [1500, 80],
  [1600, 74],
];

/** Catmull-Rom spline through the points, expressed as cubic Béziers. */
function smooth(points: readonly Point[]): string {
  const [first] = points;
  let d = `M${first[0]} ${first[1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 8;
    const c1y = p1[1] + (p2[1] - p0[1]) / 8;
    const c2x = p2[0] - (p3[0] - p1[0]) / 8;
    const c2y = p2[1] - (p3[1] - p1[1]) / 8;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export type RidgeShape = "main" | "far" | "mid";

const SHAPES: Record<RidgeShape, readonly Point[]> = { main: MAIN, far: FAR, mid: MID };

/** Open path, for the 1px line. */
export function ridgeLine(shape: RidgeShape = "main"): string {
  return smooth(SHAPES[shape]);
}

/** Closed path that fills everything below the crest, for layered scenes and ridge-edged frames. */
export function ridgeFill(shape: RidgeShape = "main"): string {
  return `${smooth(SHAPES[shape])} L${RIDGE_WIDTH} ${RIDGE_HEIGHT} L0 ${RIDGE_HEIGHT} Z`;
}

/** Closed path that fills everything ABOVE the crest: the sky behind a ridge. */
export function ridgeSky(shape: RidgeShape = "main"): string {
  return `${smooth(SHAPES[shape])} L${RIDGE_WIDTH} 0 L0 0 Z`;
}
