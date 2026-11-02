# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + GSAP (ScrollTrigger, SplitText, Flip) + Lenis + Motion, static typed data, hosted free on Vercel (Hobby). Three.js / React Three Fiber only if a 3D moment is approved later. Confirmed by the user; final stack is documented in BRIEF.md.

## Users

Primary: recruiters and prospective clients reviewing the developer's portfolio. They judge craft, motion quality, performance and polish in a few seconds on desktop and phone. The in-world audience is the fictional agency's property buyers, sellers and renters, whom the interface speaks to. The agency itself, its market and audience details are not yet defined.

## Product Purpose

A cinematic, highly animated, fully responsive website that looks and behaves like a real estate agency site. It is a portfolio piece for a fictional company. Success is a "who built this?" reaction: fast, accessible, polished, with one signature moment rather than many effects.

## Positioning

A portfolio-grade real estate site where craft is the proof: real-agency completeness (listings, filters, detail pages, contact flow) with award-level motion, while staying fast and accessible. The fictional agency's own positioning (luxury, modern, warm) is undecided and set in the next interview.

## Operating Context

Visitors browse listings, open property detail pages and use demo-only contact and inquiry flows. The site is reviewed as a portfolio, so it is judged on phone, on desktop, and with reduced motion enabled.

## Capabilities and Constraints

- Frontend only: no backend, database, SQL or payments. Everything runs on static, typed data in `src/data`.
- Forms are demo-only: validated, with a success state, nothing stored or sent.
- The company, people, listings and numbers are fictional and marked as such. The footer carries a "Concept project, fictional company" note.
- Planned scope per WORKFLOW.md: landing page, listings index (filters in URL params), property detail, about/team, contact, 404 and legal placeholders; optional favorites/compare, mortgage calculator with disclaimer, visit-scheduling demo, interactive map.
- Performance budget: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile.
- Undecided: agency name and positioning, city/market, site language(s), and which wow features are approved. Settled in the brief interview.

## Brand Commitments

None yet. The fictional agency's name, voice and identity are to be proposed and confirmed in BRIEF.md.

## Evidence on Hand

- `WORKFLOW.md`: phase plan, prompts and pitfalls for this project.
- No photography, video, logo or copy exists yet. The user plans 8-12 hero-quality exteriors/interiors plus about 6 fictional properties with 6+ images each, kept in a consistent color grade. Originals go in the git-ignored `raw-assets/`.
- No real testimonials, customers, benchmarks or press exist. Anything shown must be fictional and labeled.

## Product Principles

1. Craft is the product: every detail (loading, focus, 404, empty and form states) is part of the proof.
2. One signature moment beats ten effects; motion explains hierarchy, state or direction.
3. Fast and accessible by default: reduced motion, keyboard and contrast are requirements, and a slow site is a failed site.
4. Mobile is designed on its own terms, with touch-specific interactions.
5. Honest fiction: invent only what BRIEF.md states, and label it as a concept.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` with a fallback for every animation. Full keyboard navigation and visible focus, adequate contrast, screen-reader labels, and usable at 200% zoom. Formal standard (for example WCAG AA) not yet confirmed.
