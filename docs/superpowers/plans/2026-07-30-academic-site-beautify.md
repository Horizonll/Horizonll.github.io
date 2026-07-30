# Academic Site Beautification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Jekyll academic homepage into a cool gray-blue research-lab look with sticky anchor nav and light scroll motion, then push to `main` for GitHub Pages deploy.

**Architecture:** Keep single-page Jekyll content (`index.md` + `_data` + includes). Rebuild visual tokens and section chrome in `assets/css/main.css`, add sticky nav markup in `_layouts/default.html`, wrap sections with ids in `index.md`, and drive scroll-spy + reveal with `assets/js/site.js`.

**Tech Stack:** Jekyll (github-pages gem), vanilla CSS, vanilla JS, self-hosted woff2 fonts, GitHub Actions Pages deploy.

## Global Constraints

- Stay on Jekyll + existing `.github/workflows/jekyll.yml` deploy to `main`.
- Do not change profile copy, publication/education/internship YAML semantics, or SEO/JSON-LD behavior.
- Visual direction: cool gray-blue research lab; no purple gradients, no dark mode, no card-wall hero.
- Motion: nav active state, section reveal, link/marker micro-interaction; honor `prefers-reduced-motion`.
- Skip local Jekyll serve; acceptance is CI deploy + live site. Push to `main` when done.

---

## File Structure

| Path                                          | Responsibility                                                    |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `assets/fonts/source-serif-4-latin-600.woff2` | Heading/display font weight                                       |
| `assets/css/main.css`                         | Design tokens, layout, nav, profile, sections, responsive, motion |
| `assets/js/site.js`                           | Sticky-nav scroll-spy + section reveal observer                   |
| `_layouts/default.html`                       | Nav shell, font preload, script include                           |
| `index.md`                                    | Section ids/classes; unchanged prose/data includes                |
| `_includes/publications.html`                 | Optional class hooks only if needed                               |
| `_includes/logo-list.html`                    | Optional class hooks only if needed                               |

---

### Task 1: Add heading font asset

**Files:**

- Create: `assets/fonts/source-serif-4-latin-600.woff2`

**Interfaces:**

- Consumes: none
- Produces: self-hosted font file referenced later as `Source Serif 4` weight 600

- [ ] **Step 1: Download Source Serif 4 latin 600 woff2**

```powershell
New-Item -ItemType Directory -Force -Path assets\fonts | Out-Null
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/fontsource/fonts/source-serif-4@latest/latin-600-normal.woff2" -OutFile "assets\fonts\source-serif-4-latin-600.woff2"
```

Expected: file exists and size > 10KB.

- [ ] **Step 2: Commit**

```powershell
git add assets/fonts/source-serif-4-latin-600.woff2
git commit -m "Add Source Serif 4 heading font"
```

---

### Task 2: Sticky nav + layout shell

**Files:**

- Modify: `_layouts/default.html`
- Modify: `index.md` (section wrappers / ids)

**Interfaces:**

- Consumes: section ids listed in design spec
- Produces: `#site-nav` with `.nav-link[href^="#"]`; sections with `id` + `class="site-section"`; `#main` content unchanged semantically

- [ ] **Step 1: Update `_layouts/default.html`**

Add Source Serif preload, sticky nav before `<main>`, and deferred script:

```html
<!doctype html>
<html lang="en">
  <head>
    {% assign profile = site.author_profile %}
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {% seo %}
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "{{ profile.name }}",
        "alternateName": "{{ profile.alternate_name }}",
        "email": "mailto:{{ profile.email }}",
        "affiliation": {
          "@type": "CollegeOrUniversity",
          "name": "Tsinghua University"
        },
        "url": "{{ site.url }}",
        "sameAs": ["https://github.com/{{ profile.github }}", "{{ profile.scholar }}"]
      }
    </script>
    <link rel="icon" href="{{ '/favicon.ico' | relative_url }}" type="image/x-icon" />
    <link
      rel="preload"
      href="{{ '/assets/fonts/titillium-web-v19-latin-400.woff2' | relative_url }}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="{{ '/assets/fonts/source-serif-4-latin-600.woff2' | relative_url }}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="preload" as="image" href="{{ '/img/1.webp' | relative_url }}" type="image/webp" />
    <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <nav id="site-nav" class="site-nav" aria-label="Page sections">
        <div class="site-nav-inner">
          <a class="nav-brand" href="#about">{{ profile.name }}</a>
          <div class="nav-links">
            <a class="nav-link" href="#about">About</a>
            <a class="nav-link" href="#news">News</a>
            <a class="nav-link" href="#education">Education</a>
            <a class="nav-link" href="#publications">Publications</a>
            <a class="nav-link" href="#internships">Internships</a>
            <a class="nav-link" href="#awards">Awards</a>
            <a class="nav-link" href="#talks">Talks</a>
            <a class="nav-link" href="#teaching">Teaching</a>
            <a class="nav-link" href="#service">Service</a>
          </div>
        </div>
      </nav>
    </header>
    <main id="main">{{ content }}</main>
    <script src="{{ '/assets/js/site.js' | relative_url }}" defer></script>
  </body>
</html>
```

- [ ] **Step 2: Restructure `index.md` with section ids**

Keep all existing copy and includes; wrap as:

```markdown
---
layout: default
image: /img/1.webp
---

<section id="about" class="site-section is-about">
<div class="profile">
  ...existing profile markup...
</div>

I am an undergraduate student at ...
</section>

<section id="news" class="site-section">
## News
...existing news list...
</section>

<section id="education" class="site-section">
## Education
{% include logo-list.html items=site.data.educations %}
</section>

<section id="publications" class="site-section">
## Publications
...
</section>

<section id="internships" class="site-section">
## Internships
...
</section>

<section id="awards" class="site-section">
## Awards and Honors
...
</section>

<section id="talks" class="site-section">
## Talks
...
</section>

<section id="teaching" class="site-section">
## Teaching
...
</section>

<section id="service" class="site-section">
## Professional Service
...
</section>
```

- [ ] **Step 3: Commit**

```powershell
git add _layouts/default.html index.md
git commit -m "Add sticky section nav and page anchors"
```

---

### Task 3: Rebuild CSS visual system

**Files:**

- Modify: `assets/css/main.css` (full replace)

**Interfaces:**

- Consumes: classes/ids from Task 2 (`site-nav`, `nav-link`, `site-section`, `profile`, publication/logo classes)
- Produces: cool gray-blue tokens; sticky nav; refined profile; section chrome; responsive rules; motion classes `.is-revealed` / `.reveal-ready`

- [ ] **Step 1: Replace `assets/css/main.css` with the full stylesheet**

Implement all of the following in one file:

1. `@font-face` for Titillium Web 400 and Source Serif 4 600
2. `:root` tokens:

```css
:root {
  --color-bg-0: #eef3f8;
  --color-bg-1: #f7fafc;
  --color-surface: rgba(247, 250, 252, 0.86);
  --color-text: #15202b;
  --color-muted: #5b6b7c;
  --color-accent: #1f4e79;
  --color-accent-soft: #d7e6f4;
  --color-link: #1a5f9e;
  --color-link-hover: #c45c16;
  --color-border: rgba(31, 78, 121, 0.14);
  --font-body: "Titillium Web", Verdana, Helvetica, sans-serif;
  --font-display: "Source Serif 4", Georgia, "Times New Roman", serif;
  --width-content: 880px;
  --nav-height: 56px;
  --space-page-x: 32px;
  --radius-photo: 10px;
  --shadow-photo: 0 10px 28px rgba(21, 32, 43, 0.12);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

3. `body` atmospheric background (radial + linear cool wash), not flat white
4. Sticky `.site-nav` translucent bar; horizontal scroll on small screens; `.nav-link.is-active` accent underline
5. `main` width `min(var(--width-content), calc(100% - var(--space-page-x)))`; top padding clears nav
6. Profile: flex photo + centered identity; name uses `--font-display`; photo soft shadow/border
7. `.site-section` with `scroll-margin-top: calc(var(--nav-height) + 12px)`; `h2` accent underline
8. News / awards / talks lists with improved spacing; muted dates if marked
9. Keep `.publication` marker as accent bar; refined `.pub-*` hierarchy
10. `.logo-item` alignment polish
11. Reveal: `.site-section.reveal-ready { opacity: 0; transform: translateY(12px); }` and `.is-revealed { opacity: 1; transform: none; transition: ... }`
12. `@media (prefers-reduced-motion: reduce)` disables reveal/transform transitions
13. Responsive breakpoints ~960 / 640 / 480 matching current behavior (stack profile, smaller photo)

- [ ] **Step 2: Commit**

```powershell
git add assets/css/main.css
git commit -m "Restyle site with cool gray-blue research look"
```

---

### Task 4: Scroll-spy and reveal JS

**Files:**

- Create: `assets/js/site.js`

**Interfaces:**

- Consumes: `#site-nav .nav-link`, `main .site-section[id]`
- Produces: toggles `.is-active` on nav links; adds `.reveal-ready` then `.is-revealed` on sections

- [ ] **Step 1: Create `assets/js/site.js`**

```javascript
(function () {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll(".nav-link[href^='#']"));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0] && visible[0].target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((section) => spy.observe(section));

    if (!reduceMotion) {
      const reveal = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      sections.forEach((section) => {
        section.classList.add("reveal-ready");
        reveal.observe(section);
      });
    } else {
      sections.forEach((section) => section.classList.add("is-revealed"));
    }
  } else if (sections[0]) {
    setActive(sections[0].id);
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      if (id) setActive(id);
    });
  });
})();
```

- [ ] **Step 2: Commit**

```powershell
git add assets/js/site.js
git commit -m "Add nav scroll-spy and section reveal"
```

---

### Task 5: Push and verify CI deploy

**Files:**

- None (git remote / Actions)

- [ ] **Step 1: Ensure working tree clean and push `main`**

```powershell
git status -sb
git push origin main
```

Expected: push succeeds; branch tracks `origin/main`.

- [ ] **Step 2: Watch GitHub Actions**

```powershell
gh run list --workflow "Build and deploy Jekyll site" --limit 1
gh run watch
```

Expected: workflow conclusion `success`.

- [ ] **Step 3: Spot-check live HTML markers**

```powershell
gh api repos/Horizonll/Horizonll.github.io/pages --jq .html_url
```

Then confirm deployed site HTML contains `site-nav`, `source-serif-4`, and section id `publications` (via fetch or browser). Local Jekyll serve is not required.

---

## Spec Coverage Check

| Spec requirement                   | Task                   |
| ---------------------------------- | ---------------------- |
| Cool gray-blue atmosphere + tokens | Task 3                 |
| Display + body fonts self-hosted   | Task 1, 3              |
| Sticky top anchor nav              | Task 2, 3, 4           |
| Profile polish                     | Task 2, 3              |
| Section hierarchy / lists / pubs   | Task 2, 3              |
| Motion x3 + reduced-motion         | Task 3, 4              |
| Keep YAML/content/SEO              | Task 2 (no data edits) |
| Push without local serve           | Task 5                 |
