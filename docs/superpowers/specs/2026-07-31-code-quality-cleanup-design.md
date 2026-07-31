# Code Quality Cleanup Design

Date: 2026-07-31  
Project: Horizonll.github.io (Jekyll personal academic homepage)  
Approach: Option B (code quality) + Approach 2 (equivalent refactor + hygiene)

## Goals

- Remove dead code and redundant implementation branches.
- Replace fragile About-top / nav-spy logic with a simpler, maintainable model.
- Fix clear non-standard template/accessibility issues without changing look or content architecture.
- Preserve core behavior: scroll spy highlighting, click-to-section navigation, About/brand scroll to true page top, `prefers-reduced-motion` handling.

## Non-Goals

- No visual redesign (colors, fonts, spacing, motion feel, layout).
- No information-architecture changes (section order, nav labels, content structure).
- Do not migrate Talks / Teaching / Service / Awards into `_data`.
- Do not change the existing `viewport width=1024` desktop strategy.
- No local verification and no dependency installs.
- Do not change CI unless a clear config defect is found.

## Success Criteria

- Fewer JS state variables and clearer responsibilities; no unused CSS/JS paths.
- About / brand / `#about` land at `scrollY ≈ 0` with correct active nav.
- Other anchors lock highlight during navigation, then resume scroll-based spy.
- User-visible appearance and content remain effectively unchanged.

## Architecture

Single-page Jekyll site:

- Content: `index.md` sections + `_data/*` for news / education / publications / internships
- Chrome: `_layouts/default.html` (nav, SEO, JSON-LD, font/image preloads)
- Behavior: `assets/js/site.js` (nav spy, About top, reveal)
- Style: `assets/css/main.css`

Cleanup stays inside these surfaces. No new libraries or build steps.

## `site.js` Design

### Responsibilities (keep)

1. Highlight the current section from scroll position.
2. Temporarily lock highlight after nav clicks to avoid flicker during smooth scroll.
3. Force About / brand / `#about` to true page top and sync hash.
4. Section reveal via `IntersectionObserver`, with reduced-motion / no-IO fallback.

### State model (simplify)

| State | Keep? | Role |
|-------|-------|------|
| `lockedId` | Yes | Temporary highlight lock after navigation |
| `stickyId` / `stickyY` | No | Remove; unlock then immediately recompute active section |
| Dual unlock timers + scrollend | Yes, simplified | Prefer `scrollend` when available; short timeout fallback otherwise |

### Interaction rules

- **Non-About nav links:** do not `preventDefault`; rely on native hash jump + CSS `scroll-behavior`. On click, `lockActive(id)`. Unlock on `scrollend`, or after settle delay (`40ms` reduced-motion / `140ms` otherwise) if `scrollend` is unavailable or no scroll starts. Keep a `4000ms` safety unlock as last resort.
- **About / brand / `#about`:** shared `goToTop` path — prevent default on click, sync history to `#about`, `scrollTo({ top: 0, behavior })`. Do not depend on CSS `scroll-margin: 100vh`.
- **hashchange:** about → scroll top + lock; other valid section → lock; invalid → update active only.
- **Initial `#about`:** `scrollTo(0, 0)` on load.

### Scroll spy algorithm

Keep the existing progressive probe near page end so short trailing sections can become active. Refactor for readability only; do not change the probe intent.

### Reveal

Unchanged behavior: observe sections when IO exists and motion is allowed; otherwise mark `is-revealed` immediately.

### Removals

- Sticky post-unlock layer (`stickyId` / `stickyY` / 8px tolerance).
- Duplicate About-top handlers; brand and About share one path.

## CSS / Template Hygiene

### CSS (`main.css`)

- Remove `#about.site-section { scroll-margin-top: 100vh; }` so About uses the same nav-offset scroll margin as other sections (or inherits the shared `.site-section` rule with no override).
- Do not alter visual tokens, typography, spacing, reveal timing, or nav underline styling.
- Delete unused selectors only if confirmed unused; otherwise leave alone.

### Templates / Liquid

- `_includes/news.html`, `publications.html`, `logo-list.html`: keep trusted HTML content behavior (e.g. publication authors with `<b>`); tidy markup/semantics only where clearly beneficial.
- `_layouts/default.html`: keep SEO/JSON-LD/preload/nav copy and order; fix only clear accessibility or markup hygiene issues.
- `index.md`: no content/structure changes.

### Explicitly untouched

- Visual system and motion parameters
- Viewport meta strategy
- Data migration of remaining hardcoded sections
- Dependency and CI changes (unless defective)

## Error Handling / Compatibility

- Missing `#site-nav` or zero sections: early return (unchanged).
- Missing `scrollend`: timeout-based unlock fallback.
- Missing `IntersectionObserver` or reduced motion: skip reveal animation, show content.
- Missing `history.pushState`: fall back to `location.hash`.

## Testing / Verification

Per project constraints for this task:

- No local install, serve, or browser verification.
- Verification is static review against this spec (logic completeness, dead-code absence, no intentional visual/content diffs).

## Implementation Scope Summary

1. Rewrite/simplify `assets/js/site.js` per state model above.
2. Remove About `100vh` scroll-margin hack in `assets/css/main.css`.
3. Small template hygiene only if clearly warranted; no IA/visual changes.
4. Leave Gemfile, workflow, and content data unchanged unless a defect blocks the above.
5. Exception for `_config.yml`: add `docs` to `exclude` so internal specs/plans are not published with the site.
