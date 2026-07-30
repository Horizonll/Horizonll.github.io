# Visual & Interaction Polish Design

Date: 2026-07-31  
Site: Ruize He academic homepage (`ruizehe.com`)  
Status: Approved in conversation; pending user review of this written spec

## Goal

Visible upgrade of visual hierarchy and interaction details while preserving the existing cool gray-blue academic identity. No structural redesign, no mobile viewport overhaul, no content data migration.

## Non-goals

- Full mobile responsive redesign (`viewport` stays as-is for this pass)
- Converting Awards / Talks / Teaching / Service into YAML
- Adding BibTeX, publication thumbnails, CV download, or dark mode
- Marketing-style card walls, hero overlays, or heavy motion

## Approach

Refine the current visual language (Approach 1): fix correctness bugs, tighten typography and list rhythm, stabilize nav spy, and strengthen publication hierarchy with restrained motion.

## 1. Typography & color baseline

**Keep**

- Background gradients, content width (`880px`), font families:
  - Body: Titillium Web
  - Display: Source Serif 4
  - Chinese name: Noto Serif SC (weight 300, accent color)
- Single-column section order and overall layout

**Change**

- Add a real Titillium Web **700** `woff2` file under `assets/fonts/`
- Point the `@font-face` for `font-weight: 700` at that file (today it incorrectly reuses the 400 file)
- Do **not** preload the 700 face (bold usage is below the fold); keep existing preloads for 400 / Source Serif 4 / Noto Serif SC
- Prefer hierarchy via size/weight/spacing over large palette shifts; optionally nudge `--color-muted` one step lighter (e.g. toward `#66727e`) so secondary lines read clearly subordinate to body text; leave accent/link tokens unchanged unless contrast regresses
- Keep Chinese name styling as-is (no heavier weight, no decorative treatment)

## 2. Navigation & motion

**Navigation**

- On first paint with no hash (or hash `#about`), activate **About**
- If URL hash matches a section, activate that section immediately
- Keep `IntersectionObserver` scroll spy; tune `rootMargin` / thresholds so active state does not jump to News while About still dominates the first viewport
- On nav click, set active state immediately for the target id

**Motion (exactly these three families)**

1. Section reveal (fade + slight translateY) with `prefers-reduced-motion` disable path
2. Nav active underline scale (existing behavior, keep)
3. Publication marker + link hover micro-emphasis (existing, slightly stronger but still subtle)

No parallax, no decorative floating chips, no additional animation systems.

## 3. Publications & list hierarchy

**Publications**

- Keep left accent marker + italic title pattern
- Strengthen hierarchy:
  - Title: most prominent
  - Authors / venue: quieter muted scale
  - Links row: clearer spacing for `arXiv · code`; bold links use accent + true 700 weight
- On hover of a publication row: marker color/scale and title color respond lightly together

**Other lists**

- Unify vertical padding and bottom-rule rhythm across News, Awards, Talks, Teaching, Service
- Keep News date styling (`tabular-nums`, muted)
- Education / Internships logo rows: spacing/type tweaks only; keep period-above-text structure

## Files expected to change

- `assets/css/main.css` — hierarchy, list rhythm, publication hover, font-face
- `assets/js/site.js` — initial active nav + spy tuning
- `assets/fonts/` — add Titillium Web 700 woff2
- `_layouts/default.html` — preload adjustment only if needed for the new face

## Success criteria

- Bold publication links and any intentional 700 text render as true bold, not faux/400
- Landing on `/` shows About as the active nav item until the user scrolls past it
- Publication entries read with clearer title → meta → links hierarchy at a glance
- List sections feel evenly spaced; no denser/looser mismatch between adjacent sections
- Motion remains subtle and fully disabled under `prefers-reduced-motion`
- Visual identity remains recognizably the same cool gray-blue academic site

## Verification

- Desktop visual check of About, News, Publications, Awards
- Confirm font network request loads Titillium 700 (or inspect computed font-weight face)
- Scroll through all sections and confirm nav active state tracks without early News activation
- Toggle/simulate reduced motion and confirm no reveal/hover transforms remain animated
