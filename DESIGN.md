---
name: Curral Residências
description: "Onde a serra encontra o seu lar." A soft, ambient real estate site: warm sand surfaces, pastel aurora light, a serif display face and slow, constant motion.
colors:
  sand: "#F5F0E8"
  sand-2: "#ECE5D9"
  paper: "#FFFAF2"
  ink: "#1D1B18"
  ink-2: "#5A554D"
  night: "#16201C"
  peach: "#F6C3A2"
  rose: "#F0B8B3"
  butter: "#F2DFAE"
  sage: "#B8CEB9"
  sky: "#C4D7E8"
  lilac: "#D4C9E4"
  accent: "#E0714A"
  accent-text: "#B44A27"
typography:
  display: "Instrument Serif (regular + italic), headlines, prices, numerals"
  body: "Manrope, variable, UI and running text"
---

# Design system

Rewritten in the soft redesign. Plain CSS, no framework: tokens in `src/styles/base.css`, shell in
`layout.css`, home sections in `home.css`.

## Principles
- **Soft, not flat.** Warm sand page, paper cards, large radii (24–48px), pastel gradients instead of hard colour blocks. Ink is for text and the primary action only.
- **Always moving, never loud.** Ambient loops run on their own; scroll adds a second layer. Everything animates `transform` and `opacity` only.
- **One idea.** The Serra do Curral ridge: it is the shape in every illustrated scene, the hero horizon and the footer wordmark glyph.
- **Serif italic as the accent.** One or two words per headline are set in italic (`*word*` markers in `<Heading>`).

## Type
Instrument Serif for `h1–h4`, prices and numerals; Manrope for everything else. Scale: `t-hero`, `t-display`, `t-headline`, `t-title`, `t-lead`, `t-small`.

## Shape and surfaces
Pills (999px) for buttons, chips, nav and neighbourhoods; `--r-lg` 36px cards; `--r-xl` 48px for panels (numbers, footer, CTA, story scene). Page background `sand`; cards `paper` or a pastel tint mixed with paper. Dark panels use `night`.

## Motion
- Easings: `--ease` cubic-bezier(.22,1,.36,1) for entrances and hovers; `--ease-soft` for loops.
- **Ambient (CSS keyframes):** aurora blobs, floating hero cards, rotating badge, marquee, swaying ridges, drifting clouds, pulsing dot. Paused and hidden when offscreen (`AmbientObserver`).
- **Entrance (IntersectionObserver + CSS):** `Reveal` (fade + rise) and `Heading` (words rise from a mask).
- **Scroll (GSAP ScrollTrigger + Lenis):** story paragraph lights up word by word; the Serra scene runs a day (sun along an arc, sky dawn to dusk, ridges at three speeds); numbers count up.
- **Pointer (fine pointers only):** hero layers follow the pointer via `--mx/--my`; tiles and people cards get a soft glow via `--px/--py`; primary buttons are magnetic. There is **no custom cursor**.
- **Page transition:** a dark curved curtain rises and lifts.
- **Reduced motion** (OS setting or the footer switch, `data-motion="reduced"`): loops stop, content is simply visible, no Lenis. Mobile/touch keeps ambient CSS and entrances but no pointer effects or smooth scroll.
- Avoid `backdrop-filter` over animated content (it breaks rendering in some engines); use opaque soft fills. The header and listing chips are the only blurred surfaces.

## Imagery
No photography yet. `Scene` draws a gradient sky, a sun and three ridge layers in six pastel tones as a stand-in at the final aspect ratio; swap for `<img>` when assets arrive. People cards use initials until portraits exist.
