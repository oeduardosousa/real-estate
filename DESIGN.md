---
name: Curral Residências
description: "Onde a serra encontra o seu lar." A calm, cinematic real estate site drawn around the ridge line of the Serra do Curral.
colors:
  pedra: "#F1F1EC"
  pedra-raised: "#E7E8E1"
  pedra-deep: "#D3D5CB"
  grafite: "#1B1F1C"
  grafite-soft: "#4A4F47"
  serra-muted: "#62675D"
  canga: "#9C3F24"
  canga-deep: "#7A2F1A"
  noite: "#0F1519"
  noite-raised: "#182027"
  nevoa: "#ECEDE6"
  nevoa-muted: "#A3ABA6"
  canga-claro: "#E58A64"
  alvorada: "#EBCFB2"
  dia: "#B9C6CC"
  entardecer: "#6B4F5C"
  success: "#2F6045"
  warning: "#7A5A0C"
  error: "#A3322A"
  success-on-noite: "#7FC59A"
  warning-on-noite: "#E3B94F"
  error-on-noite: "#F08A80"
typography:
  display-xl:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 1.5rem + 7vw, 8.5rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 4.5vw, 5.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
  price:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "'lnum' 1, 'tnum' 1"
  numeral:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3rem, 1.5rem + 6vw, 7rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'lnum' 1"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
  5xl: "128px"
  6xl: "192px"
components:
  button-primary:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.pedra}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.canga}"
    textColor: "{colors.pedra}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.grafite}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.pedra}"
  button-on-noite:
    backgroundColor: "{colors.nevoa}"
    textColor: "{colors.noite}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "52px"
  button-on-noite-hover:
    backgroundColor: "{colors.canga-claro}"
    textColor: "{colors.noite}"
  input:
    backgroundColor: "{colors.pedra-raised}"
    textColor: "{colors.grafite}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "56px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.grafite-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.pedra}"
  card-listing:
    backgroundColor: "{colors.pedra}"
    textColor: "{colors.grafite}"
    rounded: "{rounded.none}"
    padding: "0"
  tag-fictional:
    backgroundColor: "{colors.pedra-raised}"
    textColor: "{colors.grafite-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0 8px"
    height: "24px"
  nav:
    backgroundColor: "{colors.pedra}"
    textColor: "{colors.grafite}"
    typography: "{typography.label}"
    height: "72px"
---

# Design System: Curral Residências

## Overview

**Creative North Star: "A Linha da Serra"** (the ridge line)

Belo Horizonte means "beautiful horizon", and the Serra do Curral is the line that closes it. This system uses that line as its single recurring idea. A hairline ridge profile draws the loader, runs under the hero, tracks scroll progress, wipes between pages, edges the photographs in the home story and underlines the map. Everything else stays quiet so that one line can carry the identity.

The personality is calm, precise and understated, matching the brand voice in BRIEF.md: short sentences, no hype. The palette comes from the place (soapstone, iron-ore rust, the blue-black of the serra at night), not from a luxury template. Headlines are large and light, set in a grotesque. A serif appears only where numbers matter: prices and statistics. Photography carries the emotion; the interface frames it with whitespace and hairlines. Motion is bold and cinematic in a few chosen places and invisible everywhere else.

The reference research (Azimute Residencial, Loam House, Vitacon, 360 Lexington, Aman; motion from Lando Norris, Lusion and Locomotive) shaped four deliberate departures: no beige-and-copper with a serif-italic headline, no loader that waits on assets, an agency's full browse-filter-compare flow instead of a single-project microsite, and a visible "animations on or reduced" control.

**Key Characteristics:**
- One motif only: the ridge line. No other decorative shapes, patterns or icons-as-ornament.
- Light "pedra" base with dark "noite" chapters used as designed sections, not as an OS-driven dark mode.
- Large light grotesque headlines; serif reserved for prices and numerals.
- Flat surfaces, hairline borders, square corners. Depth comes from tone and photography.
- Cinematic motion confined to the hero, the home story, the featured-property track and the card-to-detail transition.
- Mobile gets its own lighter interaction design, not a shrunk desktop.

### Named Rules

**The One Line Rule.** The ridge is the only recurring motif. If a new section wants an ornament, it uses the ridge or nothing.

**The Photograph Carries It Rule.** Emotion comes from graded photography, never from gradients, glass, glow or 3D. The interface frames; it does not compete.

## Colors

A warm-neutral stone base, a blue-black night, and one rust accent. Every text pairing below was computed against WCAG 2.2 (ratios in the Accessibility section).

### Primary
- **Canga** (`#9C3F24`): iron-ore rust, the colour of the ferruginous crust on Minas hillsides. Links, active filter indicators, price-change and "Venda" markers, button hover fill and the ridge line when it must stand out. On dark chapters it becomes **Canga Claro** (`#E58A64`).
- **Canga Deep** (`#7A2F1A`): pressed state for canga fills.

### Neutral (light, default)
- **Pedra** (`#F1F1EC`): soapstone off-white; the page background.
- **Pedra Raised** (`#E7E8E1`): input fills, skeletons, tag backgrounds, alternating bands.
- **Pedra Deep** (`#D3D5CB`): disabled fills and strong dividers.
- **Grafite** (`#1B1F1C`): body text, headlines, primary buttons.
- **Grafite Soft** (`#4A4F47`): secondary text, captions on pedra.
- **Serra Muted** (`#62675D`): metadata and placeholder text; the lowest-contrast text allowed (5.1:1 on pedra).

### Neutral (dark chapters)
- **Noite** (`#0F1519`): blue-black of the serra at night; the storytelling stage, footer, menu overlay and image scrims.
- **Noite Raised** (`#182027`): cards and panels on noite.
- **Névoa** (`#ECEDE6`): text on noite.
- **Névoa Muted** (`#A3ABA6`): secondary text on noite.

### Sky stages (decorative, home story only)
- **Alvorada** (`#EBCFB2`) → **Dia** (`#B9C6CC`) → **Entardecer** (`#6B4F5C`) → **Noite** (`#0F1519`). Four stacked layers crossfaded by opacity as the story scrolls. Never used behind body-size text without the contrast rule below.

### Status
- Light: **Success** `#2F6045`, **Warning** `#7A5A0C`, **Error** `#A3322A`.
- On noite: `#7FC59A`, `#E3B94F`, `#F08A80`.
- Status is always paired with an icon and text, never colour alone.

### Named Rules

**The Eight Percent Rule.** Canga occupies at most about 8% of any viewport. Its rarity is what makes a price tag or a link read as an action.

**The Stage Text Rule.** Over alvorada and dia use grafite; over entardecer and noite use névoa. Text over photography sits on a noite scrim of at least 45% opacity under the text block.

**The Two Themes Rule.** There are exactly two surface themes, `pedra` and `noite`, applied per section. There is no system dark mode: the photographic grade is tuned for these two stages.

## Typography

**Display and body font:** Hanken Grotesk (variable), fallback Helvetica Neue, Arial. Loaded with `next/font`.
**Numeric and quote font:** Newsreader (variable, optical size), fallback Georgia. Prices, statistics, pull quotes only.

**Character:** a light, wide-open grotesque at very large sizes feels architectural and confident; the editorial serif on figures gives money and measurements the weight of print. Two families, never a third. Instrument Serif and Cormorant are deliberately avoided: they define the look of the closest competitors.

### Hierarchy
- **Display XL** (300, `clamp(3rem, 1.5rem + 7vw, 8.5rem)`, 0.95, −0.035em): the hero line and the story's beat statements. One per screen.
- **Display** (300, `clamp(2.5rem, 1.5rem + 4.5vw, 5.5rem)`, 1.0, −0.03em): section openers.
- **Headline** (300, `clamp(1.75rem, 1.2rem + 2vw, 3rem)`, 1.1, −0.02em): property titles on detail pages, sub-sections.
- **Title** (400, 1.375rem, 1.3): card titles, list headings, form group titles.
- **Body Large** (400, 1.125rem, 1.6): lead paragraphs.
- **Body** (400, 1rem, 1.65): running text, maximum measure 65ch.
- **Label** (500, 0.8125rem, 0.12em tracking, uppercase): buttons, nav, filter chips, neighbourhood and type tags. Never for sentences.
- **Price** (Newsreader 400, `clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)`, lining and tabular figures): "R$ 6.800.000", "R$ 3.800/mês".
- **Numeral** (Newsreader 300, `clamp(3rem, 1.5rem + 6vw, 7rem)`): the number row (480, 17, R$ 1,2 bi, 96%).

### Named Rules

**The Two Fonts Rule.** Hanken Grotesk and Newsreader. Nothing else, including in the logo wordmark.

**The Light-at-Scale Rule.** Weight 300 applies only above 28px. Below that, weight 400 minimum, because light weights fail on photographs and small screens.

**The Figures Rule.** Money, area and counts are always lining and tabular so columns of prices align.

## Layout

A 12-column grid on desktop, 8 on tablet, 4 on mobile, with a fluid gutter and a content cap of 1600px (the design is checked to 1920px, where the cap centres the content and photographs may bleed).

- **Gutter (page margin):** `clamp(1.25rem, 5vw, 5rem)`. Column gap 24px desktop, 16px mobile.
- **Spacing scale:** 4-based: 4, 8, 16, 24, 32, 48, 64, 96, 128, 192.
- **Section spacing:** `clamp(5rem, 12vw, 12rem)` vertical between sections; sections are separated by whitespace and a hairline, never by background-colour boxes inside the same theme.
- **Asymmetry:** headlines start on column 1 and span 7–8 columns; supporting text sits offset on columns 8–12. Centred layouts are limited to the closing CTA and the 404.
- **Section label:** every section opens with a Label-style line preceded by a 24px ridge glyph (for example "A serra", "Imóveis em destaque"). No numbering scheme.
- **Header:** 72px, transparent over the hero, solid pedra with a hairline once scrolled; hides on scroll down and returns on scroll up. Right side: Imóveis, Sobre, Contato, favourites count, "Falar com a equipe".
- **Home order (by approved features):** hero → "A serra" pinned story (signature) → featured properties (horizontal) → services → number row → neighbourhoods and map teaser → team → labelled fictional testimonials → closing CTA → footer.
- **Listings grid:** 1 column below 640px, 2 from 640px, 3 from 1024px; cards share one 4:5 image ratio so rows align.
- **Property detail:** full-bleed hero image, then a two-column body (content 8 cols, sticky contact panel 4 cols). On mobile the contact panel becomes a fixed bottom bar of 64px.

### Breakpoints

| Name | Min width | Notes |
|---|---|---|
| base | 0 (design for 320–390) | single column, touch interactions |
| sm | 640px | 2-column listings |
| md | 768px | tablet, 8-column grid |
| lg | 1024px | desktop layout; pinned and horizontal motion enabled |
| xl | 1280px | wider gutters |
| 2xl | 1536px | content cap reached; imagery bleeds |

Pinned and scroll-scrubbed effects are enabled only at `lg` and above with a fine pointer. This also means they switch off at 200% browser zoom on a 1280px screen (640 CSS px).

### Mobile treatment by section

| Section | Mobile design |
|---|---|
| Hero | 100svh image, headline bottom-left, ridge line under it; no parallax layers |
| Story | Unpinned: four full-height stages stacked, each draws its ridge as it enters |
| Featured properties | Native horizontal scroll with snap, 80vw cards, arrow buttons visible |
| Filters | Bottom sheet with a 56px apply button; active filters as removable chips |
| Gallery | Swipe with visible position count; lightbox closes with a 44px button and swipe down |
| Menu | Full-screen noite overlay, large links, 56px rows |
| Map | List and map toggle, never both at once |

## Elevation & Depth

Flat by default. Depth is carried by tonal layering (pedra, pedra-raised, pedra-deep), 1px hairlines, photography and the noite stages. There are no card shadows.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 24px 48px -24px rgb(15 21 25 / 0.35)`): only for floating UI that overlaps content: the compare bar, popovers, the mobile bottom sheet. One shadow, no variants.

### Hairlines
- Light: `1px solid rgb(27 31 28 / 0.14)`. On noite: `1px solid rgb(236 237 230 / 0.16)`.

### Named Rules

**The Flat-By-Default Rule.** Surfaces never carry shadows at rest. Lift appears only on UI that floats above scrolling content.

**The Scrim Rule.** Gradients exist only as image scrims and the sky stages. No decorative gradients, no gradient text, no glassmorphism.

## Shapes

Architectural: square corners on everything that holds content (buttons, inputs, cards, images). The only rounded elements are filter chips and the cursor (pill, 999px) and tag labels (2px). The ridge profile is the signature shape.

- **The ridge profile:** a long, low, asymmetric crest with five to seven gentle inflections, drawn at 1px stroke in grafite (or névoa on noite). It is stylised, not cartographic, and is drawn once as a reusable SVG in the landing-page phase. It is used as: divider under the hero, loader line, scroll progress, page-transition edge, top edge of story photographs (as a `clip-path`), and the map accent.
- **Image shapes:** rectangles at 4:5 (cards), 16:9 and 21:9 (heroes), 3:2 (gallery), 4:5 (team portraits). Only story photographs use the ridge-shaped top edge.
- **Focus ring:** 2px solid, 3px offset, square.

## Components

Every component is square, hairline-bordered where it needs an edge, and uses Label type for controls. Interaction timings come from the Motion section.

### Buttons
- **Shape:** square, 52px high (44px minimum touch target at all sizes), 32px horizontal padding, Label type.
- **Primary:** grafite fill, pedra text. Hover: a canga fill sweeps in from the left (240ms, `clip-path`), text stays pedra. Press: `scale(0.97)` over 100ms. Focus: 2px ring in grafite on light, canga-claro on dark.
- **Secondary:** transparent, 1px grafite border, grafite text. Hover fills grafite from the left; text flips to pedra.
- **On noite:** névoa fill, noite text; hover fills canga-claro.
- **Quiet (text link):** grafite or névoa text with a 1px underline that scales from the left on hover (160ms). Links inside body copy are canga with a persistent underline.
- **Disabled:** pedra-deep fill, serra-muted text, no hover.
- **Magnetic:** primary buttons only, fine pointers only (see Motion).

### Listing card
- **Image** 4:5 with no radius. Top-left tag "Venda" or "Aluguel" in Label type on a pedra chip. Top-right: favourite button (44px hit area, outline heart; filled canga when active) and a compare checkbox labelled "Comparar".
- **Text** below the image with no container: neighbourhood (Label, serra-muted), title (Title), specs line "420 m² · 4 quartos · 4 vagas" (Body, grafite-soft), price (Price).
- **Hover (fine pointer):** image scales to 1.04 over 700ms (ease-out), the title underline sweeps in, the cursor becomes the "Ver" ring. Touch: no hover, `:active` dims to 0.92 opacity.
- **Skeleton:** pedra-raised blocks with an opacity pulse (1.4s); no shimmer sweep.

### Inputs and filters
- **Field:** pedra-raised fill, 56px high, 1px hairline bottom, square. Label always visible above the field, never placeholder-only.
- **Focus:** bottom border becomes 2px grafite plus the focus ring. **Error:** border and message in error colour with an icon, text explains the fix. **Success (demo forms):** message states clearly that nothing was sent.
- **Chips:** pill, 40px high, 1px hairline; selected fills grafite with pedra text. Removing a chip animates out in 160ms.
- **Range slider (price, area):** 1px track, 24px square thumb inside a 44px hit area, values in Price type above.
- **Filter changes** never animate the list when triggered by keyboard; pointer changes re-order cards with a 300ms Flip.

### Navigation
- **Desktop:** wordmark left ("Curral Residências" in Hanken 400, 0.02em tracking, a small ridge glyph above the "ê"); Label links; the current page has a 1px canga underline. Header behaviour is in Layout.
- **Mobile:** wordmark and a "Menu" text button (no hamburger icon). The overlay is noite, links in Headline size, staggered in by 40ms.
- **Compare bar:** fixed at the bottom with Lift, shows up to 3 thumbnails and a "Comparar (n)" button; enters from below in 240ms.

### Footer
Noite theme. Giant wordmark on one line (Display XL, cropped by the viewport edge), neighbourhoods list, contact details from BRIEF facts only, legal links, and the mandatory line: "Projeto conceitual, empresa fictícia. / Concept project, fictional company."

### Fictional testimonials
Each carries a `tag-fictional` label reading "Depoimento fictício" next to the name. The quote is set in Newsreader italic at Headline size; the label is never removable by layout (it moves with the quote).

### Signature component: the ridge line
One shared SVG component with three modes: `static` (divider), `draw` (reveals left to right once), `progress` (width tied to scroll). It is the only component that appears in the loader, hero, story, page transition, 404 and map.

## Do's and Don'ts

### Do:
- **Do** let the ridge line be the one recurring idea, and keep every other decoration out.
- **Do** use Newsreader for prices, areas and statistics, always lining and tabular.
- **Do** set hero and story headlines in Display XL at weight 300 with tight tracking.
- **Do** keep canga to the Eight Percent Rule and use it for actions and prices, not for decoration.
- **Do** write short, calm PT-BR copy; invent no facts beyond BRIEF.md.
- **Do** label AI-rendered or illustrative images "Imagem ilustrativa" and fictional testimonials "Depoimento fictício".
- **Do** give every animated element a defined end state that exists without JavaScript.
- **Do** design the mobile and reduced-motion experience as complete, not as a degraded desktop.

### Don't:
- **Don't** use beige with a serif-italic headline and copper accents; that is the competitor look.
- **Don't** use purple-to-blue gradients, glassmorphism, gradient text, or emoji as icons.
- **Don't** build three identical feature cards in a row or centre every section.
- **Don't** use shadows on cards, or border radius on content surfaces.
- **Don't** add a third typeface, a second motif, or 3D (out of scope in BRIEF.md).
- **Don't** hide the system cursor; the custom cursor is a follower, not a replacement.
- **Don't** gate content, the first paint or the hero image behind a loader or an animation.
- **Don't** animate keyboard-initiated actions, or anything used dozens of times a day.

## Imagery and Icons

Photography is about 60% of the result. Originals live in git-ignored `raw-assets/`; only optimized AVIF/WebP files are committed.

- **Grade:** one grade for every image, "blue hour over the serra": warm golden highlights, cool blue-green shadows, blacks lifted slightly, greens desaturated, canga rust left intact. Apply the same grade to AI renders and stock.
- **Content:** exteriors at dusk or golden hour, interiors with daylight and a visible view of the horizon where possible. People appear only in the team section. Each image has PT-BR alt text describing the room or view.
- **Ratios:** 4:5 cards, 16:9 or 21:9 hero, 3:2 gallery, 4:5 team. Always reserve space with `aspect-ratio`; set `sizes`; `fetchpriority="high"` only on the hero.
- **Hero:** layered still (approved default): graded photograph, ridge line in the foreground, optional 6–10% parallax. A video loop (under 5 MB, poster required) is an upgrade path, not the default.
- **Icons:** one set, Lucide at 1.5px stroke, 20px or 24px, `currentColor`. Used for utilities only (favourite, compare, close, arrows, map pin). Never decorative.

## Motion

Direction: bold, cinematic and highly dynamic, but placed. Four moments carry the weight (hero intro, the "A serra" story, the featured track, the card-to-detail transition); everything else is fast and quiet. Interaction rules follow emil-design-eng: animate for a purpose, make frequent actions instant, exit faster than enter, never animate keyboard actions, nothing appears from `scale(0)`.

### Library roles

| Library | Owns | Never used for |
|---|---|---|
| **GSAP** (`gsap`, ScrollTrigger, SplitText, Flip) via `useGSAP` | loader, hero intro, scroll storytelling, pins, horizontal track, text and image reveals, parallax, magnetic and cursor, shared-element transition, page-transition timeline | simple hover or focus changes |
| **Lenis** | one instance, driven by the GSAP ticker, synced with ScrollTrigger | touch scrolling and reduced motion (native scroll is kept) |
| **Motion** (`motion/react`) | React presence UI: menu overlay, filter chips, compare bar, toasts, bottom sheets, lightbox, form states | anything tied to scroll |
| **CSS** | hover, focus, press, colour and underline transitions, skeleton pulse | multi-step choreography |

### Motion tokens

**Durations**

| Token | ms | Use |
|---|---|---|
| `instant` | 100 | press feedback |
| `fast` | 160 | hover, colour, underline, chip removal |
| `base` | 240 | menus, bars, button fill sweep, tooltips |
| `moderate` | 400 | card and filter transitions, sheets |
| `slow` | 700 | text and image reveals, card image hover |
| `cinematic` | 1200 | hero intro segments, ridge draw |
| `epic` | 1800 | image settle in hero, story stage crossfades (scrubbed) |

UI (interactive) transitions stay at or under 300ms. Longer values apply only to scroll-driven or one-time marketing motion.

**Easings**

| Token | Value | GSAP equivalent | Use |
|---|---|---|---|
| `ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | `power4.out` | entrances, hover, default |
| `ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | `power3.inOut` | on-screen movement, page wipe, Flip |
| `ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | custom | sheets, menu overlay |
| `ease-cinema` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | reveals, hero intro |
| `linear` | `linear` | `none` | scrubbed scroll, progress |

Never `ease-in` for UI. Springs (Motion) only for the cursor follower and drag: `stiffness 170, damping 26`; bounce 0 elsewhere.

**Stagger:** lines 60ms, words 35ms, cards 70ms, menu links 40ms. Characters only for the loader wordmark (18ms). Total stagger never exceeds 600ms.

**Allowed properties:** `transform` and `opacity` for everything, plus `clip-path: inset()` on isolated layers for image and ridge reveals. Never layout properties (`width`, `height`, `top`, `margin`, `padding`). `will-change` is set only while an element animates and removed after.

### Effects

| Effect | Library | Desktop (≥1024px, fine pointer) | Mobile / touch | Reduced motion | Budget |
|---|---|---|---|---|---|
| **Loading animation** | GSAP timeline | First visit only (localStorage flag). Noite panel; wordmark fades in by characters (18ms stagger) while the ridge line draws left to right (`cinematic`, `ease-cinema`); panel lifts away on `ease-in-out`. Runs on a fixed timeline and never waits on assets. | Same, shortened: no character split, ridge draws in 700ms. | Skipped. Hero fades in over 200ms. | ≤ 1.4s total; ≤ 4 KB own JS; no network; skipped on repeat visits and on save-data |
| **Hero intro** | GSAP + SplitText | Photograph settles `scale(1.12)→1` over `epic`; headline lines rise from a mask (`yPercent 110→0`, 60ms stagger, `cinematic`, `ease-cinema`); hero ridge draws; nav and CTA fade in last. Page is interactive from frame one. | Lines rise, photo settle at `scale(1.06)` over 1.2s; no parallax layers. | Static, final state; 200ms opacity fade only. | ≤ 2.2s sequence; LCP image preloaded, AVIF ≤ 350 KB desktop and ≤ 180 KB mobile; zero CLS |
| **Scroll storytelling ("A serra")** | GSAP ScrollTrigger + Lenis | Pinned stage, about 400vh of scroll, `scrub: 1`. Four beats (alvorada, dia, entardecer, noite): sky layers crossfade (opacity), three ridge layers drift at different speeds (translateX), the main ridge draws, and photographs rise into place with a ridge-shaped top edge (translateY). Beat text swaps by opacity and an 8px translate. Facts and figures come only from BRIEF.md. | No pin. Four stacked 100svh stages in their sky colours; each ridge draws once on enter (`toggleActions`, 700ms); one parallax layer at half amplitude. | No pin, no scrub. Four static stacked stages with a fully drawn ridge. | 1 pinned section; ≤ 6 scrubbed tweens live; ≤ 3 full-viewport layers; scrub handler ≤ 4ms per frame; holds ≥ 50fps at 4× CPU throttle |
| **Pinned sections** | GSAP ScrollTrigger | Maximum 2 per page (story, featured track). `pin`, `anticipatePin: 1`, `invalidateOnRefresh: true`; `ScrollTrigger.refresh()` after fonts and images settle. | Disabled. | Disabled. | Pin only on `lg`+; no pin when viewport height is under 560px |
| **Horizontal scroll (featured properties)** | GSAP ScrollTrigger (containerAnimation) | The six featured listings in a pinned horizontal track: `translateX` scrubbed to scroll, cards 38vw, a progress ridge below, next/prev buttons. Focusing a card off-screen scrolls the page to it; a "Ver todos os imóveis" link sits before the pin so keyboard users can skip it. | Native `overflow-x: auto` with `scroll-snap-type: x mandatory`, 80vw cards, visible arrows. | Same as mobile: native scroll track, no pin. | 1 pin; track images lazy-loaded except the first two; no layout reads in scroll handlers |
| **Text reveals** | GSAP SplitText | Display and Headline: line mask reveal (`yPercent 110→0`, 60ms stagger, `slow`, `ease-cinema`) at `top 85%`, once. One manifesto paragraph per page may use a word-by-word opacity scrub (0.2→1). Body paragraphs fade and rise 12px as blocks, never line by line. | Lines reveal as on desktop, no word scrub, no character splits. | No split; 200ms opacity fade or none. | Split after `document.fonts.ready` to avoid CLS; use `aria: "auto"` and revert split on resize; ≤ 12 split elements per page |
| **Parallax** | GSAP ScrollTrigger | Image 115% tall in an overflow-hidden frame, `yPercent −7.5→7.5` scrubbed; hero three layers at 6–10%. Never on text. | Hero only, amplitude halved. | Off. | ≤ 3 parallax elements in view at once; transform only |
| **Image reveals** | GSAP + CSS `clip-path` | `clip-path: inset(100% 0 0 0)→inset(0)` over `slow` with `ease-cinema`, and the inner image `scale(1.15→1)` over 1.4s; grids stagger 80ms; triggers once at `top 85%`. | Opacity and 24px rise over 600ms, no clip. | None; images are present. | ≤ 4 reveals running simultaneously; reserve space with `aspect-ratio` |
| **Magnetic buttons** | GSAP `quickTo` | Primary CTAs only (≤ 3 per viewport): pointer within 80px pulls the button up to 12px (strength 0.25), `duration 0.5`, `power3.out`; releases on leave. Enabled through `gsap.matchMedia` on `(hover: hover) and (pointer: fine)`. | Off; `:active` scale only. | Off. | 0 layout reads; ≤ 0.5ms per frame |
| **Cursor effects** | GSAP `quickTo` (Motion spring optional) | A 12px follower ring beside the system cursor, which stays visible. Grows to 72px with the label "Ver" over listing cards, "Arrastar" over the gallery, and hides over text inputs. | Off. | Off. | One element; transform only; pointer events none |
| **Hover states** | CSS | See Components: button fill sweep 240ms, underline scale 160ms, card image 1.04 over 700ms. Always inside `@media (hover: hover) and (pointer: fine)`. Press `scale(0.97)` at `instant`. | `:active` feedback only. | Colour and underline stay; movement removed. | Compositor-only properties; no `transition: all` |
| **Card-to-detail shared element** | GSAP Flip, crossfade fallback | Click stores the card image rect and source, then navigates. The detail page places the image at the stored rect and Flips it to the hero rect (`moderate`→700ms, `ease-in-out`, transform only) while the page content fades up behind it (stagger 70ms). Interruptible: a new navigation kills the tween. Back navigation reverses the Flip when the card is visible, else fades. | Same with 520ms. | 240ms crossfade. | One clone element; image decoded before start (`img.decode()`); if not ready within 150ms use the crossfade; ≤ 800ms total |
| **Page transitions** | GSAP timeline in a persistent shell (Next App Router) | Exit: a noite panel with a ridge-shaped top edge rises (320ms, `ease-in-out`); route swaps underneath; enter: panel lifts away (480ms). Total ≤ 800ms, always interruptible. Skipped for same-page hash links and for card-to-detail (Flip owns that). | Same, 240ms exit, 360ms enter. | Instant route change with a 150ms opacity fade. | Panel is one composited layer; no route blocking beyond 320ms |
| **Smooth scroll** | Lenis | One instance, `duration 1.1`, `ease-out`-style curve, `smoothWheel: true`, `syncTouch: false`, driven by `gsap.ticker` with `lagSmoothing(0)`; the native document scroller is kept, no scroller proxy. Anchor links use `lenis.scrollTo`. | Off; native touch scroll. | Off; native scroll. | One `requestAnimationFrame` source (the GSAP ticker) |
| **UI presence** | Motion | Menu overlay (`ease-drawer`, 400ms), filter chips, compare bar (240ms), bottom sheets, lightbox, toasts. Exit is 60% of enter duration. | Same. | Opacity only, 120ms. | Interruptible; no keyframes for rapidly-triggered items |

### Global fallbacks

All GSAP setup runs inside `gsap.matchMedia()` so every tween and ScrollTrigger is reverted on change and on unmount.

| Context | Media query | Behaviour |
|---|---|---|
| Full | `(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` | everything above |
| Light | `(max-width: 1023px), (hover: none)` with reduced motion off | no pins, no scrub, no cursor, no magnet, shorter durations |
| Reduced | `(prefers-reduced-motion: reduce)` or the site's own switch | no movement; opacity and colour only; Lenis, loader, parallax, pins and page transitions off |

**Reduced motion is not zero motion.** Opacity fades up to 200ms, colour transitions and focus rings remain because they aid comprehension. Autoplaying video is replaced by its poster.

**Animation switch.** The footer and menu carry an "Animações: completas / reduzidas" control. It sets the same state as `prefers-reduced-motion` and persists in `localStorage`. Without JavaScript, content is simply visible.

### Performance budget (mobile, 4× CPU throttle, mid-tier phone)

| Metric | Budget |
|---|---|
| LCP | < 2.5s; hero image preloaded, never behind the loader |
| CLS | < 0.1; all animated media reserve space; splits wait for fonts |
| INP | < 200ms; no handler over 50ms; animations start within one frame of input |
| Animation JS (GSAP core + ScrollTrigger + SplitText + Flip + Lenis + Motion) | target ≤ 90 KB gzip total, loaded after the hero; Flip, SplitText and the story chunk are dynamic imports |
| Frame rate | ≥ 50fps through the story, track and transitions at 4× CPU throttle |
| Concurrency | ≤ 1 active pin, ≤ 6 scrubbed tweens, ≤ 3 parallax, ≤ 4 reveals, ≤ 8 `will-change` layers |
| Assets | hero ≤ 350 KB desktop / ≤ 180 KB mobile AVIF; gallery images lazy; no autoplay video on mobile |

Per-effect budgets in the Effects table are checked in the Phase 8 motion and performance passes.

## Accessibility

Target: **WCAG 2.2 AA**, with 7:1 for body text in the base theme.

- **Contrast (computed):** grafite on pedra 14.7:1; grafite-soft on pedra 7.4:1; serra-muted on pedra 5.1:1 (on pedra-raised 4.7:1); canga on pedra 5.9:1 (on pedra-raised 5.4:1); pedra on canga 5.9:1; névoa on noite 15.6:1; névoa-muted on noite 7.8:1; canga-claro on noite 7.1:1; noite on canga-claro 7.1:1; success 6.4:1, warning 5.6:1, error 6.1:1 on pedra; the dark status colours 7.6–9.9:1 on noite. Serra-muted is the floor; nothing lighter carries text.
- **Focus:** always visible: 2px ring, 3px offset, grafite on light, canga-claro on dark (both ≥ 7:1). Never removed. Focus order matches DOM order, including pinned sections.
- **Targets:** 44px minimum for every touch control; 24px is the AA floor and is never used alone.
- **Keyboard:** skip link first; menu, filters, gallery, lightbox, compare bar and map all work with keyboard only; Escape closes overlays and returns focus; the pinned horizontal track never traps focus (see its skip link and focus-to-scroll rule).
- **Screen readers:** SplitText uses `aria: "auto"` so headlines read as one string; decorative ridge SVGs are `aria-hidden`; the map has a list equivalent; favourite and compare buttons expose state with `aria-pressed`; form errors are tied with `aria-describedby`; live regions announce result counts after filtering.
- **Motion and vestibular:** reduced motion and the in-site switch (see Motion). No flashing above 3 per second; no parallax on reduced motion.
- **Zoom and reflow:** usable at 200% and at 320 CSS px without horizontal scrolling; pins switch off automatically below 1024 CSS px.
- **Colour independence:** status, selection and errors always combine colour with an icon, text or shape change.
- **Language and forms:** `lang="pt-BR"`; every field has a visible label; demo forms state they send nothing.

## Open Items

- Photography source (stock, own shots or AI renders) is still open in BRIEF.md; the grade above applies to any of them, and AI renders carry "Imagem ilustrativa".
- Final font specimens (Hanken Grotesk, Newsreader) are confirmed in the foundation phase, including PT-BR diacritics and lining figures.
- The ridge profile SVG is drawn in the landing-page phase against the final hero photograph.
- This file is a design contract written before any code exists; re-run `/impeccable document` once the app is built to capture the shipped tokens and components.
