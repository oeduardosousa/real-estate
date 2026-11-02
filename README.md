# Curral Residências

Fictional real estate site for a developer portfolio. Frontend only: static typed data, demo forms, no backend. Concept project, fictional company. See `BRIEF.md` (scope), `DESIGN.md` (visual system) and `CLAUDE.md` (working rules).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm run build` | Static export to `out/` |
| `npm run check` | Lint, typecheck and build in order |

## Structure

```
src/
  app/            Routes (App Router), global CSS, layout
  components/
    layout/       Page-transition shell, TransitionLink
    providers/    Client providers (Lenis, composition)
    ui/           Shared presentational components
  data/           Typed static data: listings, team, neighborhoods, site facts
  lib/
    fonts.ts      next/font setup (Hanken Grotesk, Newsreader)
    motion/       GSAP registration, motion config, useMotion, scroll helpers, reduced-motion state
  styles/
    tokens.css    Raw design tokens as CSS custom properties (palette, roles, layout, motion)
    theme.css     Tailwind theme that names those tokens and defines the type scale, radii, shadow, easings
```

## Motion conventions

- Create animation with `useMotion` (`src/lib/motion/use-motion.ts`): it wraps `gsap.matchMedia()` and `useGSAP`, hands you `mode` (`full`, `light` or `reduced`) and reverts everything on breakpoint change, on the animation switch and on unmount.
- Animate `transform` and `opacity` only. Durations and easings come from `src/lib/motion/config.ts` (GSAP) or the `duration-*` / `ease-*` utilities (CSS).
- Every animated element must have a visible end state without JavaScript. Reduced motion is the site switch (`data-motion="reduced"` on `<html>`, persisted in `localStorage`) or the OS setting.
- `SplitText` and `Flip` load on demand through `loadSplitText()` and `loadFlip()`.
