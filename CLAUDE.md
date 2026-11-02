# Curral Residências — fictional real estate site (portfolio, frontend only)

- Stack and scope live in BRIEF.md; visual system in DESIGN.md (once created). Use the approved stack.
- Commit each completed, verified step with a clear message. Test before committing.
- Never push, force-push, or commit .env files or secrets. Keep `.env*` in .gitignore; allow only `.env.example`.
- Obtain approval before any deploy.
- Use emil-design-eng for animations and interactions; use Impeccable for design and UI audits.
- No backend, database or payments. Forms are demo-only: validated (zod), success state, nothing stored or sent.
- Motion: GSAP via useGSAP with cleanup; animate transform/opacity only; respect prefers-reduced-motion (gsap.matchMedia).
- Lighter motion variants on mobile/touch; one Lenis instance synced with ScrollTrigger; no custom cursor (removed by the user).
- Performance budget (mobile): LCP < 2.5s, CLS < 0.1, INP < 200ms; lazy-load heavy assets.
- Footer carries a small "Concept project, fictional company" note; fictional testimonials are labeled.
- Site copy is PT-BR; code, comments and docs are English. Invent no facts outside BRIEF.md.
