# BRIEF — Curral Residências (FICTIONAL)

> Everything about the company, people, listings, prices and numbers below is **fictional**, invented for a developer portfolio. Street names are not used; neighborhood and city names are real places used only as setting. No real person, brand or listing is represented. The agency name is a placeholder and has not been checked for trademarks.

## Concept
A modern-luxury real estate agency in Belo Horizonte and its metropolitan area (Minas Gerais, Brazil). The city's name means "beautiful horizon" and the Serra do Curral ridge defines its skyline; the site uses that horizon as its recurring idea. Frontend-only portfolio piece, cinematic and highly animated, behaving like a real agency site.

## Audience
- Primary: recruiters and prospective clients reviewing the portfolio (see PRODUCT.md).
- In-world: affluent buyers and families in BH and Nova Lima, investors, and owners wanting to list a property.

## Goals
1. A "who built this?" reaction in the first 5 seconds, on phone and desktop.
2. Real-agency completeness: browse, filter, inspect, compare, contact.
3. One signature moment (see Features), not ten effects.
4. Fast and accessible: meets the performance budget and reduced-motion support.

## Language and locale
PT-BR only, prices in BRL (R$), areas in m². Code, comments and docs in English.

## Fictional brand
- **Name:** Curral Residências. **Tagline:** "Onde a serra encontra o seu lar."
- **Voice:** calm, precise, understated; short sentences; no hype or exclamation marks.
- **Founded (fictional):** 2009. **Team size:** 14. **Numbers (fictional):** 480 imóveis negociados, 17 bairros atendidos, R$ 1,2 bi em transações, 96% de clientes que indicam.
- **Neighborhoods served:** Lourdes, Savassi, Funcionários, Santo Agostinho, Serra, Sion, Mangabeiras, Belvedere, Pampulha, Vila da Serra and Vale do Sol (Nova Lima).
- **Team (fictional):** Helena Vasconcelos (fundadora e sócia-diretora), Rafael Mendonça (diretor comercial), Camila Drummond (especialista em alto padrão), Bruno Teixeira (investimentos), Marina Alvarenga (locação e relacionamento).
- **Testimonials:** fictional, labeled as such in the UI.

## Pages
Home · Imóveis (listings index) · Imóvel (detail, one per listing) · Sobre/Equipe · Contato · 404 · Privacidade e Termos (placeholders). Neighborhood pages are out of scope.

## Listings (12, fictional)
Fields: id, slug, title, type, purpose (venda/aluguel), price, condominio, iptu, area (m²), bedrooms, suites, bathrooms, parking, neighborhood, city, coordinates, features, description, images (alt text), agent, featured, floorplan.

| # | Title | Neighborhood | Type | m² | Qtos | Price |
|---|---|---|---|---|---|---|
| 1 | Cobertura Horizonte | Belvedere | Cobertura | 420 | 4 | R$ 6.800.000 |
| 2 | Casa Serra do Curral | Mangabeiras | Casa | 680 | 5 | R$ 9.500.000 |
| 3 | Apartamento Lourdes 14 | Lourdes | Apartamento | 240 | 4 | R$ 4.200.000 |
| 4 | Loft Savassi | Savassi | Loft | 95 | 1 | R$ 1.350.000 |
| 5 | Casa Vale do Sol | Nova Lima | Casa em condomínio | 750 | 5 | R$ 8.900.000 |
| 6 | Apartamento Santo Agostinho | Santo Agostinho | Apartamento | 180 | 3 | R$ 2.950.000 |
| 7 | Residência Pampulha Lago | Pampulha | Casa | 520 | 4 | R$ 5.400.000 |
| 8 | Studio Funcionários | Funcionários | Studio | 48 | 1 | R$ 3.800/mês |
| 9 | Apartamento Vila da Serra | Vila da Serra | Apartamento | 210 | 3 | R$ 3.600.000 |
| 10 | Casa Sion Jardim | Sion | Casa | 390 | 4 | R$ 4.750.000 |
| 11 | Cobertura Serra | Serra | Cobertura | 350 | 4 | R$ 5.900.000 |
| 12 | Apartamento Funcionários | Funcionários | Apartamento | 130 | 2 | R$ 12.500/mês |

Listings 1–6 are featured and need 6+ images each; 7–12 need at least 3. Final copy, descriptions and coordinates are produced in the content phase.

## Features (approved)
- **Signature moment:** pinned scroll storytelling on the Home page, the Serra do Curral horizon revealed across the brand story. Final choice made in DESIGN.md.
- **Cinematic hero:** layered image or short compressed loop (< 5 MB) with poster; loading animation skipped on repeat visits and never blocking LCP.
- **Card-to-detail shared-element transition** (GSAP Flip or View Transitions API, with fallback).
- **Filters, favorites, compare:** filters by type, purpose, price, bedrooms, area and neighborhood, with sorting and URL-param state; favorites and compare (max 3) in localStorage; skeleton and empty states.
- **Interactive map** (MapLibre with a free tile source) with pins linked to cards.
- **Mortgage calculator** (Price/SAC choice optional) with a clear disclaimer that it is a simulation.
- Also: smooth scroll, text and image reveals, parallax, horizontal scroll for featured properties, page transitions, magnetic buttons (no custom cursor).
- **Out of scope:** 3D (no Three.js), language switch, visit scheduling, blog, neighborhood pages, any backend.

## Content and assets
Photography decides the result. Needed: 8–12 hero-grade exteriors/interiors, a consistent color grade, license-checked or AI-rendered. Originals stay in git-ignored `raw-assets/`; only optimized files are committed. No assets exist yet.

## Stack (approved)
Next.js (App Router) + TypeScript + plain CSS + GSAP (ScrollTrigger, SplitText, Flip) via `@gsap/react` + Lenis + Motion, static typed data in `src/data`, MapLibre for the map, zod for demo-form validation.
**Why:** static export keeps hosting free and fast; App Router gives per-property static pages with metadata; GSAP handles pinned and scroll-linked work, Motion handles small UI transitions. No server runtime is required.

## Deployment
Vercel Hobby (free) from the GitHub repo `oeduardosousa/real-estate`, default `*.vercel.app` URL; custom domain optional later. No environment variables. The user pushes and deploys; Claude never does.

## Acceptance criteria
- All pages in scope render responsively from 320 px to 1920 px and work with keyboard only.
- `prefers-reduced-motion` yields a complete, non-animated experience; mobile/touch gets lighter variants.
- Mobile LCP < 2.5 s, CLS < 0.1, INP < 200 ms; Lighthouse mobile Performance ≥ 90.
- Each listing has a statically generated page with metadata and Open Graph image.
- Forms validate, show a success state, and state they are demos; nothing is stored or sent.
- Footer shows "Concept project, fictional company"; fictional testimonials are labeled.
- Lint, typecheck and production build pass with no console errors.

## Assumptions
- PT-BR copy will be written by Claude in the content phase and reviewed by the user.
- Real neighborhood names and approximate coordinates are used only as setting.
- Prices are plausible but invented.

## Open questions
- Photography source: Unsplash/Pexels, own shots, or AI-generated renders?
- Hero: video loop or layered still image?
- Inspiration and competitor references (2–3 links); to be researched and approved in Phase 2.
- Custom domain, if any.
- Accessibility standard: WCAG 2.2 AA assumed.
