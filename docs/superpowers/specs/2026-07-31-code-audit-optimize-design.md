# Code Audit & Optimize Design

## Goal

Audit the academic homepage runtime/presentation code, fix correctness issues, remove redundancy, and tighten maintainability. No local verification required for this pass.

## Scope

- `assets/js/site.js`
- `assets/css/main.css`
- `_includes/publications.html`

Out of scope: visual redesign, content edits, restoring deleted historical docs, local build/serve verification.

## Findings

1. **P1 – Nav spy unlocks too early during long smooth scrolls**  
   `lockActive` arms a hard `1500ms` timeout alongside `scrollend`. Long in-page smooth scrolls can exceed 1500ms; unlocking then only sticks for 8px, so the active nav can drift mid-animation.

2. **P2 – Redundant section-range logic in `activeFromScroll`**  
   Computing `[start, end)` plus a second `start <= probe` fallback is equivalent to “last section whose top is at/above probe” for ordered sections.

3. **P3 – Duplicated helpers / dead wrappers**  
   Repeated `window.scrollY || window.pageYOffset`; `scrollend` listener wraps `clearLock` unnecessarily.

4. **P3 – CSS / markup redundancy**  
   `.logo-list` re-declares `ul` resets; publication link closing-tag formatting is noisy.

## Approach

Recommended: targeted cleanup (not a rewrite).

- Keep lock + short sticky hold; fix unlock timing for `scrollend` browsers.
- Simplify probe selection loop; extract `scrollY()` helper.
- Drop redundant CSS resets; tidy publication link markup.
- Preserve existing visual language and behavior contracts (reveal, reduced motion, sticky nav).

## Acceptance

- Clicking a distant nav target keeps the chosen item active until scrolling settles.
- Scroll spy still activates short trailing sections without large bottom padding.
- No unused selectors/helpers left from this pass; behavior unchanged aside from the unlock fix.
