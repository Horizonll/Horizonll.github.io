# Code Slim Design (Option A)

Date: 2026-07-30  
Status: Approved

## Goal

Slim CSS/JS/markup without changing content structure, data semantics, navigation, or visual direction.

## Changes

- Unify list styles via `.site-section ul > li:not(.logo-item)`; drop per-section id selector repetition
- Move repeated border colors into CSS tokens; remove unnecessary `!important`
- Drop unused `.is-about` / `news-item` classes
- Trim font-face unicode-range boilerplate; keep behavior of `site.js` with smaller code

## Non-goals

- No YAML extraction for awards/talks/teaching/service
- No nav/profile include refactor
- No deletion of historical docs beyond this short note
- No visual redesign
