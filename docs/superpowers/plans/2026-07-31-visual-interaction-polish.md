# Visual & Interaction Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Visible polish of typography, nav spy, publication hierarchy, and list rhythm while keeping the cool gray-blue academic look.

**Architecture:** Keep the single-page Jekyll layout. Fix the Titillium 700 font-face, tighten CSS hierarchy/spacing/hover, and harden `site.js` initial/active nav + IntersectionObserver margins. No viewport/mobile redesign, no YAML content migration.

**Tech Stack:** Jekyll 4.3, static HTML/CSS/JS, self-hosted woff2 fonts

## Global Constraints

- Preserve cool gray-blue identity and single-column section order
- Do not preload Titillium 700
- Do not change `viewport` / add mobile breakpoints in this pass
- Motion limited to section reveal, nav underline, publication hover micro-emphasis
- Respect `prefers-reduced-motion`
- Commit messages in English

---

### Task 1: Add Titillium Web 700 font file and wire `@font-face`

**Files:**
- Create: `assets/fonts/titillium-web-v19-latin-700.woff2`
- Modify: `assets/css/main.css` (Titillium `@font-face` block for weight 700)
- Do not modify: `_layouts/default.html` preloads

**Interfaces:**
- Consumes: existing latin unicode-range from the 400 face
- Produces: `font-family: "Titillium Web"; font-weight: 700` served from the new woff2

- [ ] **Step 1: Download latin 700 normal woff2**

```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/fontsource/fonts/titillium-web@5.2.8/latin-700-normal.woff2" -OutFile "assets/fonts/titillium-web-v19-latin-700.woff2"
```

Expected: file exists and size is roughly 10–15 KB (not identical to the 400 file).

- [ ] **Step 2: Point weight 700 `@font-face` at the new file**

In `assets/css/main.css`, change the second Titillium block `src` from:

```css
src: url("../fonts/titillium-web-v19-latin-400.woff2") format("woff2");
```

to:

```css
src: url("../fonts/titillium-web-v19-latin-700.woff2") format("woff2");
```

Keep the same `unicode-range` and `font-display: swap`.

- [ ] **Step 3: Commit**

```bash
git add assets/fonts/titillium-web-v19-latin-700.woff2 assets/css/main.css
git commit -m "Fix Titillium Web 700 by shipping the real bold face."
```

---

### Task 2: Typography, list rhythm, and publication hierarchy CSS

**Files:**
- Modify: `assets/css/main.css`

**Interfaces:**
- Consumes: Task 1 font-face; existing class names (`.publication`, `.pub-title`, `.pub-authors`, `.pub-venue`, `.pub-links`, `.logo-*`, list selectors)
- Produces: clearer type hierarchy and unified list spacing; stronger but still subtle publication hover

- [ ] **Step 1: Nudge muted color and unify list item rhythm**

Update `:root`:

```css
--color-muted: #66727e;
```

Unify non-logo list items to shared padding and keep bottom rules:

```css
.site-section ul > li:not(.logo-item) {
  position: relative;
  padding: 0.5rem 0 0.5rem 1rem;
  border-bottom: 1px solid var(--color-rule);
}
```

Slightly tighten logo-list spacing if needed so Education/Internships match surrounding rhythm:

```css
.logo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-rule);
}
```

- [ ] **Step 2: Strengthen publication hierarchy and hover**

```css
.pub-title {
  font-size: 1.08rem;
  line-height: 1.45;
  color: var(--color-text);
  transition: color 180ms var(--ease-out);
}

.pub-authors,
.pub-venue,
.pub-links {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.pub-body .pub-authors {
  margin-top: 0.3rem;
}

.pub-body .pub-venue {
  margin-top: 0.12rem;
}

.pub-body .pub-links {
  margin-top: 0.4rem;
}

.pub-link-sep {
  margin: 0 8px;
  color: var(--color-muted);
}

.publication:hover .pub-marker {
  background: var(--color-link-hover);
  transform: scaleY(1.08);
}

.publication:hover .pub-title {
  color: var(--color-accent);
}

.pub-links .is-bold {
  color: var(--color-accent);
  font-weight: 700;
}
```

Keep marker base styles; ensure reduced-motion block still zeroes `.pub-marker` transitions/transforms.

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "Refine type hierarchy, list rhythm, and publication hover."
```

---

### Task 3: Harden nav initial state and scroll spy

**Files:**
- Modify: `assets/js/site.js`

**Interfaces:**
- Consumes: `#site-nav`, `.nav-link[href^='#']`, section ids
- Produces: About active on `/` (or `#about`); hash target active on load; tuned spy that does not prefer News while About still fills the first viewport

- [ ] **Step 1: Replace `site.js` with hardened version**

```javascript
(function () {
  var nav = document.getElementById("site-nav");
  if (!nav) return;

  var links = Array.prototype.slice.call(
    nav.querySelectorAll(".nav-link[href^='#']")
  );
  var sections = links
    .map(function (link) {
      return document.getElementById(link.hash.slice(1));
    })
    .filter(Boolean);
  if (!sections.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.hash === "#" + id);
    });
  }

  function initialId() {
    var hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) return hash;
    return sections[0].id;
  }

  setActive(initialId());

  if (!("IntersectionObserver" in window)) return;

  var spy = new IntersectionObserver(
    function (entries) {
      var visible = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        })[0];
      if (visible && visible.target.id) setActive(visible.target.id);
    },
    { rootMargin: "-28% 0px -55% 0px", threshold: [0.08, 0.2, 0.35, 0.5] }
  );
  sections.forEach(function (section) {
    spy.observe(section);
  });

  if (reduceMotion) {
    sections.forEach(function (section) {
      section.classList.add("is-revealed");
    });
  } else {
    var reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    sections.forEach(function (section) {
      section.classList.add("reveal-ready");
      reveal.observe(section);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var id = link.hash.slice(1);
      if (id) setActive(id);
    });
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/site.js
git commit -m "Stabilize nav active state on load and while scrolling."
```

---

### Task 4: Push

**Files:** none beyond prior commits

- [ ] **Step 1: Push `main` to origin**

```bash
git push origin HEAD
```

Expected: remote accepts commits including design/plan docs and the three implementation commits.

Note: Local Jekyll/browser verification intentionally skipped per user request for this pass.
