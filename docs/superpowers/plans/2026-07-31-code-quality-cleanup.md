# Code Quality Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify nav-spy / About-top JS, remove the `100vh` scroll-margin hack, and clear dead/redundant code without changing visuals or information architecture.

**Architecture:** Keep the single-page Jekyll layout. Replace the sticky+locked nav state machine in `assets/js/site.js` with a lock-only model; About/brand share one `goToTop` path; CSS About override is deleted so scroll margin matches other sections. Template edits only for clear hygiene.

**Tech Stack:** Jekyll 4.3, vanilla JS (IIFE), static CSS, Liquid includes.

## Global Constraints

- Code-quality scope only (spec option B + approach 2); no visual redesign.
- No information-architecture changes; do not migrate Talks/Teaching/Service/Awards to `_data`.
- Do not change `viewport width=1024`.
- No local verification and no dependency installs; verify by static review against the spec.
- Do not commit unless the user explicitly asks.
- Spec: `docs/superpowers/specs/2026-07-31-code-quality-cleanup-design.md`

## File Map

| File | Responsibility |
|------|----------------|
| `assets/js/site.js` | Nav spy, About/brand top scroll, reveal |
| `assets/css/main.css` | Styles; remove About `100vh` override |
| `_config.yml` | Exclude internal `docs/` from site output |
| `_layouts/default.html` | Touch only if a clear a11y/markup defect is found during static review |
| `_includes/*.html` | Touch only for clear hygiene; otherwise leave |

---

### Task 1: Simplify `site.js` (lock-only nav spy + shared goToTop)

**Files:**
- Modify: `assets/js/site.js` (replace entire file)

**Interfaces:**
- Consumes: `#site-nav`, `.nav-link[href^='#']`, brand `a[href="#about"]`, section ids from those hashes, CSS classes `is-active` / `reveal-ready` / `is-revealed`
- Produces: same DOM contracts; no new global exports (IIFE)

- [ ] **Step 1: Replace `assets/js/site.js` with the simplified implementation**

Write the full file as:

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
  var topId = sections[0].id;
  var topLinks = Array.prototype.slice.call(
    nav.querySelectorAll('a[href="#' + topId + '"]')
  );
  var lockedId = null;
  var unlockTimer = 0;
  var settleTimer = 0;
  var ticking = false;
  var unlockOnScroll = null;
  var unlockOnScrollEnd = null;
  var settleDelay = reduceMotion ? 40 : 140;

  function scrollY() {
    return window.scrollY || window.pageYOffset;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.hash === "#" + id);
    });
  }

  function navOffset() {
    return nav.getBoundingClientRect().height + 14;
  }

  function activeFromScroll() {
    var y = scrollY();
    var doc = document.documentElement;
    var maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    var offset = navOffset();
    var progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
    // Probe moves down the viewport near page end so short trailing sections activate.
    var probe = Math.min(
      doc.scrollHeight - 1,
      y + offset + progress * Math.max(0, window.innerHeight - offset)
    );

    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= probe) current = sections[i].id;
      else break;
    }
    return current;
  }

  function updateActive() {
    if (lockedId) {
      setActive(lockedId);
      return;
    }
    setActive(activeFromScroll());
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateActive();
    });
  }

  function detachUnlockListeners() {
    if (unlockOnScroll) {
      window.removeEventListener("scroll", unlockOnScroll);
      unlockOnScroll = null;
    }
    if (unlockOnScrollEnd) {
      window.removeEventListener("scrollend", unlockOnScrollEnd);
      unlockOnScrollEnd = null;
    }
    window.clearTimeout(unlockTimer);
    window.clearTimeout(settleTimer);
  }

  function clearLock() {
    detachUnlockListeners();
    lockedId = null;
    updateActive();
  }

  function lockActive(id) {
    detachUnlockListeners();
    lockedId = id;
    setActive(id);

    if ("onscrollend" in window) {
      var startY = scrollY();
      unlockOnScrollEnd = clearLock;
      window.addEventListener("scrollend", unlockOnScrollEnd, { once: true });
      unlockTimer = window.setTimeout(function () {
        if (Math.abs(scrollY() - startY) < 1) {
          clearLock();
          return;
        }
        unlockTimer = window.setTimeout(clearLock, 4000);
      }, settleDelay);
      return;
    }

    unlockOnScroll = function () {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(clearLock, settleDelay);
    };
    window.addEventListener("scroll", unlockOnScroll, { passive: true });
    settleTimer = window.setTimeout(clearLock, settleDelay);
    unlockTimer = window.setTimeout(clearLock, 4000);
  }

  function syncHash(id) {
    var hash = "#" + id;
    if (window.history && window.history.pushState) {
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    } else if (window.location.hash !== hash) {
      window.location.hash = id;
    }
  }

  function goToTop(event) {
    if (event && event.preventDefault) event.preventDefault();
    lockActive(topId);
    syncHash(topId);
    scrollToTop();
  }

  function initialId() {
    var hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) return hash;
    return activeFromScroll();
  }

  setActive(initialId());

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("hashchange", function () {
    var hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      lockActive(hash);
      if (hash === topId) scrollToTop();
    } else {
      updateActive();
    }
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
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
  } else {
    sections.forEach(function (section) {
      section.classList.add("is-revealed");
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.hash.slice(1);
      if (!id) return;
      if (id === topId) {
        goToTop(event);
        return;
      }
      lockActive(id);
    });
  });

  topLinks.forEach(function (link) {
    if (links.indexOf(link) !== -1) return;
    link.addEventListener("click", goToTop);
  });

  if (window.location.hash.slice(1) === topId) {
    window.scrollTo(0, 0);
  }
})();
```

- [ ] **Step 2: Static review of `site.js` against the spec**

Check manually (do not run a server):

1. No `stickyId` / `stickyY` remain.
2. About/brand share `goToTop`; non-About clicks do not `preventDefault`.
3. Unlock uses `scrollend` when available, settle delay 40/140, safety 4000ms.
4. Probe-based `activeFromScroll` preserved.
5. Reveal + reduced-motion paths preserved.
6. No dead functions or unused variables.

Expected: all six checks pass.

- [ ] **Step 3: Commit only if the user explicitly asks**

If asked, commit message:

```text
Simplify nav spy and share About top-scroll path.
```

---

### Task 2: Remove About `100vh` scroll-margin hack

**Files:**
- Modify: `assets/css/main.css` (About override block near `.site-section` rules)

**Interfaces:**
- Consumes: shared `.site-section { scroll-margin-top: calc(var(--nav-height) + 14px); }`
- Produces: `#about` uses that shared margin; JS handles true top scroll

- [ ] **Step 1: Delete the About-only override**

Remove this entire block from `assets/css/main.css`:

```css
/* First section: oversized margin clamps native #about jumps to scrollY=0. */
#about.site-section {
  scroll-margin-top: 100vh;
}
```

Leave the preceding `.site-section` rule unchanged:

```css
.site-section {
  margin: 0 0 0.35rem;
  padding: 0.35rem 0 0.15rem;
  scroll-margin-top: calc(var(--nav-height) + 14px);
}
```

- [ ] **Step 2: Static CSS dead-code scan**

Confirm these selectors still have DOM/JS producers after Task 1:

- `.is-active` (nav links via `setActive`)
- `.reveal-ready` / `.is-revealed` (reveal path)
- `.news-date`, `.logo-item`, `.publication`, `.pub-*`, `.profile-*`, `.skip-link`, `.nav-brand`, `.nav-link`

Do not delete any of the above. Only delete a rule if it has zero references in HTML/MD/JS/CSS and is clearly orphaned. Expected for this repo: no additional CSS deletions required beyond the `#about` override.

- [ ] **Step 3: Commit only if the user explicitly asks**

If asked, commit message:

```text
Remove About 100vh scroll-margin hack.
```

---

### Task 3: Build hygiene — exclude internal docs from Jekyll output

**Files:**
- Modify: `_config.yml`

**Interfaces:**
- Consumes: existing `exclude` list
- Produces: `docs` (and existing entries) omitted from `_site`

- [ ] **Step 1: Extend `exclude` so internal specs/plans are not published**

Update the `exclude` block in `_config.yml` to:

```yaml
exclude:
  - Gemfile
  - Gemfile.lock
  - .gitignore
  - docs
```

Rationale: `docs/superpowers/**` is agent/process documentation, not site content. Publishing it would be incorrect for the public homepage.

- [ ] **Step 2: Static review of templates for clear defects only**

Read `_layouts/default.html`, `_includes/news.html`, `_includes/publications.html`, `_includes/logo-list.html`.

Apply a change only if it is clearly non-standard and does not alter visuals/IA. Concrete allowed fix if still present:

- In `publications.html`, keep trusted HTML in `pub.authors` (do not escape); no structural change required if markup is already valid.
- In `logo-list.html`, keep decorative `alt=""` + `aria-hidden="true"`.
- In `default.html`, do **not** change viewport, nav labels/order, SEO, or JSON-LD unless a syntax error is found.

Expected outcome for current tree: likely **no template edits** after review.

- [ ] **Step 3: Final static checklist**

1. Spec goals covered: simpler JS, no `100vh` hack, docs excluded, no IA/visual changes.
2. `viewport` still `width=1024`.
3. Talks/Teaching/Service/Awards still in `index.md`.
4. No new dependencies; CI untouched.
5. No install / local serve performed.

- [ ] **Step 4: Commit only if the user explicitly asks**

If asked, commit message:

```text
Exclude internal docs from Jekyll site output.
```

---

## Spec Coverage Check

| Spec requirement | Task |
|------------------|------|
| Simplify `site.js`; remove sticky layer | Task 1 |
| Shared About/brand `goToTop` | Task 1 |
| Keep probe spy + reveal + reduced motion | Task 1 |
| Remove `#about` `100vh` scroll-margin | Task 2 |
| Dead CSS only if confirmed unused | Task 2 |
| Template hygiene only if clearly warranted | Task 3 |
| No IA/visual/viewport/data-migration changes | All tasks (constraints) |
| No local verify / no installs | All tasks (static review) |
| Keep CI/deps unless defective | Task 3 (CI untouched) |
