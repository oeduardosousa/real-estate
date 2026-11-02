/**
 * Motion constants from DESIGN.md. CSS reads the same values from tokens.css / theme.css;
 * GSAP and Motion read them here. Keep the three in sync.
 */

/** GSAP works in seconds. */
export const duration = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  moderate: 0.4,
  slow: 0.7,
  cinematic: 1.2,
  epic: 1.8,
} as const;

/** GSAP equivalents of the DESIGN.md easings. */
export const ease = {
  out: "power4.out",
  inOut: "power3.inOut",
  cinema: "expo.out",
  linear: "none",
} as const;

/** Cubic béziers for Motion (motion/react) and CSS-like consumers. ease-drawer has no GSAP name. */
export const bezier = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
  cinema: [0.16, 1, 0.3, 1],
} as const;

/** Stagger steps in seconds. Total stagger never exceeds 0.6s. */
export const stagger = {
  line: 0.06,
  word: 0.035,
  card: 0.07,
  menu: 0.04,
  char: 0.018,
} as const;

/** Spring for the cursor follower and drag only. Bounce is 0 everywhere else. */
export const spring = { stiffness: 170, damping: 26 } as const;

/** Page-transition timings (seconds) per mode. Reduced motion swaps routes at once and fades. */
export const pageTransition = {
  full: { exit: 0.32, enter: 0.48 },
  light: { exit: 0.24, enter: 0.36 },
  reducedFade: 0.15,
} as const;

/**
 * Media queries behind gsap.matchMedia. `full` and `light` partition the no-preference space,
 * so exactly one of the three is true at any time.
 */
export const MEDIA = {
  full: "(min-width: 1024px) and (min-height: 560px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  light:
    "(prefers-reduced-motion: no-preference) and (not ((min-width: 1024px) and (min-height: 560px) and (hover: hover) and (pointer: fine)))",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export const OS_REDUCED_QUERY = MEDIA.reduced;

export type MotionMode = "full" | "light" | "reduced";

