# Academic Site Beautification Design

Date: 2026-07-30  
Site: https://ruizehe.com (Jekyll + GitHub Pages)  
Status: Approved for implementation planning

## Goal

Refresh the personal academic homepage so it feels more polished and memorable than a plain white CV page, while staying clearly academic. Visual direction: cool gray-blue research-lab atmosphere. Scope covers the profile header, content sections, overall typography/color/spacing, sticky top anchor navigation, and light scroll-linked motion.

Out of scope: content rewrites, new sections, dark mode, framework migration, blog/CMS features, local serve verification before deploy.

## Constraints

- Keep Jekyll + existing GitHub Actions deploy to `main`.
- Keep data sources: `index.md`, `_data/publications.yml`, `_data/educations.yml`, `_data/internships.yml`, `_config.yml` profile fields.
- Preserve SEO plugins, Person JSON-LD, favicon, and image preload behavior.
- Prefer CSS-first styling; allow a small vanilla JS file for nav scroll-spy and section reveal.
- Respect `prefers-reduced-motion`.
- Delivery preference: commit and push to `main` without requiring local Jekyll verification.

## Visual System

### Atmosphere

- Page background: soft cool gray-blue gradient / subtle atmospheric wash (not flat `#fff`).
- Text: near-ink primary (`~#15202b`), secondary muted slate for meta lines.
- Accent: deep research blue for links, nav active state, section markers, and publication markers.
- Hover accent: warmer blue-orange only on interactive hover/focus (keep current link-hover spirit, retuned to the new palette).
- Avoid: purple gradients, cream+terracotta academic cliché, broadsheet dense rules, glow effects, card grids in the hero/profile.

### Typography

- Body: keep Titillium Web (already self-hosted).
- Display/headings: add one expressive self-hosted face (geometric sans or restrained serif) distinct from default system stacks; preload the critical weight.
- Hierarchy: name is the strongest type signal in the first viewport; `h2` section titles clearly secondary; body readable at ~1rem / 1.6 line-height.

### Layout tokens

- Content width: ~880px centered.
- Generous section spacing; consistent horizontal page padding.
- CSS custom properties for colors, spacing, radii, and motion durations.

## Information Architecture

Single page, top-to-bottom, with sticky anchor nav:

| Nav label    | Anchor          | Source               |
| ------------ | --------------- | -------------------- |
| About        | `#about`        | profile + bio        |
| News         | `#news`         | News list            |
| Education    | `#education`    | educations data      |
| Publications | `#publications` | publications data    |
| Internships  | `#internships`  | internships data     |
| Awards       | `#awards`       | Awards and Honors    |
| Talks        | `#talks`        | Talks                |
| Teaching     | `#teaching`     | Teaching             |
| Service      | `#service`      | Professional Service |

No hamburger menu. On small screens the nav is horizontally scrollable.

## Component Design

### Sticky navigation

- Fixed/sticky top bar with translucent cool background and thin bottom border.
- Links jump to section ids; active item updates via IntersectionObserver scroll-spy.
- Active state: deeper blue + underline or stronger weight.
- Account for sticky offset when scrolling to anchors (`scroll-margin-top` on sections).

### Profile / About

- Keep photo + identity composition (not a full-bleed marketing hero).
- Photo: existing asset, refined border/soft depth, no floating badges/overlays.
- Name (EN + ZH) as primary brand signal; affiliation meta; Email / GitHub / Scholar icon links.
- Bio paragraph immediately below, inside `#about`.
- Copy and URLs unchanged.

### Content sections

Shared section chrome: `h2` + subtle accent rule + one content block.

- **News**: date/meta tone separated from event text; keep existing emoji/copy.
- **Education / Internships**: keep logo-list include; tighten alignment and vertical rhythm.
- **Publications**: keep left marker bar; clearer title / authors / venue / links hierarchy; preserve bold-self author markup and link bold flags.
- **Awards**: year `h3` more distinct; list items with improved spacing.
- **Talks / Teaching / Service**: simple lists sharing the same quiet list language as awards.

No card walls. Borders/backgrounds only where they aid scanning (e.g., sticky nav, optional soft section separators via whitespace).

### Motion

Exactly three intentional motion families:

1. Nav active-state transition while scrolling.
2. Section enter: light fade + short translate-up when intersecting viewport (once or gently).
3. Micro-interactions on links / publication marker hover.

All disabled or reduced under `prefers-reduced-motion: reduce`.

## File-level Plan

| File                     | Change                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| `_layouts/default.html`  | Add nav shell, font preloads, script tag for `site.js`              |
| `index.md`               | Wrap sections with ids/classes for anchors and reveal; keep content |
| `assets/css/main.css`    | Rebuild token system, nav, profile, sections, responsive, motion    |
| `assets/js/site.js`      | New: scroll-spy + reveal observer                                   |
| `assets/fonts/*`         | Add heading font woff2 if not already present                       |
| `_includes/*`            | Minimal class hooks only if needed; keep data contracts             |
| `_data/*`, `_config.yml` | No semantic content changes                                         |

## Testing / Acceptance

Because local verification is skipped by request, acceptance is defined as:

1. CI GitHub Actions Jekyll build/deploy succeeds on `main`.
2. Live site shows: sticky nav, cool gray-blue atmosphere, clearer type hierarchy, section anchors working.
3. Desktop and mobile: nav usable, profile stacks correctly, publications readable.
4. Reduced-motion path does not rely on motion for meaning.
5. No broken profile links, publication links, or logo paths.

## Non-goals

- Rewriting biography, news, or award text.
- Adding blog, CV PDF pipeline, or multilingual toggle (unless requested later).
- Migrating off Jekyll.
- Dark mode.
