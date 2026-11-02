# PAINEL — business view (back-office) for Curral Residências (FICTIONAL)

> Demo only. Everything is simulated and stored in the visitor's own browser. No backend, no real auth, nothing sent. Personas are fictional. Status: DRAFT spec, nothing implemented yet.

## Goal
Show the other side of the agency: who registers, reviews and publishes listings. A listing published in the panel appears on the public site (same browser).

## Decisions
| Topic | Decision |
|---|---|
| Realism | Simulated, local only. Demo login with a persona picker |
| Location | Same app, `/painel` route, `noindex`, own layout |
| Visual tone | Restrained, functional UI. No cinematic motion, no pinned scroll |
| Scope | Listings CRUD and workflow, dashboard, team and roles. No leads (public forms stay demo-only) |
| Photos | Real file picker, compressed in-browser, stored in IndexedDB, with a count cap |
| Public link | Panel-published listings show in Imóveis, map and detail on the public site |
| Build order | Data layer, status machine and permissions first, then screens |

## Personas
From BRIEF.md (fictional):
- **Helena Vasconcelos** — Diretoria (sócia-diretora)
- **Rafael Mendonça** — Diretoria (diretor comercial)
- **Camila Drummond** — Corretor (alto padrão)
- **Bruno Teixeira** — Corretor (investimentos)
- **Marina Alvarenga** — Corretor (locação e relacionamento)

Invented for the panel (back-office; BRIEF team size is 14, so there is room):
- **Tiago Pimentel** — Back-office (cadastro)
- **Larissa Coelho** — Back-office (mídia e conteúdo)

## Roles and permissions
| Action | Diretoria | Corretor | Back-office |
|---|---|---|---|
| See all listings | yes | own only (read-only view of others' published) | yes |
| Create listing | yes | yes (becomes owner) | yes (assigns an owner) |
| Edit listing | any | own, while Rascunho or Devolvido | any, while Rascunho or Devolvido |
| Upload / reorder photos | yes | own | yes |
| Send to review | yes | own | yes |
| Approve / return | yes | no | no |
| Publish / unpublish | yes | no | no |
| Reserve / close (vendido, alugado) | yes | own | no |
| Reassign owner | yes | no | no |
| Team page | all | read-only | read-only |

## Status machine
```
Rascunho → Em revisão → Publicado → Reservado → Vendido | Alugado
              │             │           │
              ↓             ↓           ↓
          Devolvido      Retirado    Publicado (reserva cancelada)
              │             │
              ↓             ↓
          Rascunho      Rascunho (or Publicado by Diretoria)
```
- `Devolvido` carries a mandatory comment from Diretoria; the next edit returns it to `Rascunho` flow.
- `Retirado` hides it from the public site and keeps history.
- `Vendido`/`Alugado` are terminal. The listing leaves the public search; its public URL shows a "não disponível" state.
- Purpose rule: `venda` closes as Vendido, `aluguel` closes as Alugado.

## Review checklist (blocks "Enviar para revisão")
- Required fields valid (zod): title, type, purpose, price, area, bedrooms, neighborhood, city.
- At least 3 photos, each with alt text. Featured listings need 6.
- Description at least a minimum length; no exclamation marks (brand voice).
- Cover photo chosen.

## Screens
1. **Login (demo):** persona picker, banner "demo: dados só neste navegador".
2. **Dashboard:** counts by status, average days in each status, awaiting-review queue (Diretoria), my listings (Corretor).
3. **Imóveis:** table with status filters, search, sort, owner column.
4. **Editor:** steps — Dados, Valores, Características, Fotos, Texto, Pré-visualização. zod-validated, autosave draft.
5. **Revisão:** queue with checklist, approve or return with comment.
6. **Equipe:** members, roles, listing counts.
7. **Histórico:** per-listing activity log ("Camila enviou para revisão").

## Data layer (phase 1)
- Typed store; text data in localStorage, photos as compressed blobs in IndexedDB.
- The 12 BRIEF listings are the seed. Seed listings are status `Publicado`, owned by team members.
- "Restaurar dados de demonstração" resets everything.
- Pure functions for `canTransition(role, from, to)` and `can(role, action, listing)`, unit-tested.
- Activity log entry on every transition and edit.
- Photo limits: resize to about 1600px, JPEG/WebP, cap per listing and in total, clear error when exceeded.

## Public site integration (phase 5)
- The 12 seed pages stay statically generated.
- Panel-created listings use a client-rendered detail route that reads the store after hydration.
- Public index, map and filters merge static seed with published store entries on the client, after hydration, so LCP is not affected.
- Only `Publicado` and `Reservado` appear publicly (Reservado shows a badge).

## Phases
1. Data layer, status machine, permissions, seed, tests.
2. Shell: persona login, `/painel` layout, route guards, dashboard.
3. Imóveis table and editor, photo upload.
4. Revisão and histórico.
5. Public site integration.
6. Audit: accessibility, keyboard, performance budget on the public site.

## Risks
- CLAUDE.md says forms store nothing; the panel stores locally. Add one line to CLAUDE.md scoping the panel as demo-only and browser-local.
- Public performance must hold; the store is read only on the client after hydration.
- localStorage/IndexedDB can be cleared or blocked; every read and write needs a safe fallback.
- Keep a visible demo banner on every panel page, consistent with the fictional-company note.

## Out of scope
Leads/inbox, real auth, real upload, multi-user sync, notifications, portal syndication (ZAP, VivaReal), analytics of real visits.
