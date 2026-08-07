(function () {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll(".nav-link[href^='#']"));
  const navLinks = nav.querySelector(".nav-links");
  const sections = links
    .map(function (link) {
      return document.getElementById(link.hash.slice(1));
    })
    .filter(Boolean);
  if (!sections.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const topId = sections[0].id;
  const topLinks = Array.from(nav.querySelectorAll('a[href="#' + topId + '"]'));
  let lockedId = null;
  let lockTimer = 0;
  let activeId = null;
  let spy = null;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  function updateNavOverflow() {
    if (!navLinks) return;

    const maxScroll = navLinks.scrollWidth - navLinks.clientWidth;
    navLinks.classList.toggle("can-scroll-left", navLinks.scrollLeft > 2);
    navLinks.classList.toggle(
      "can-scroll-right",
      navLinks.scrollLeft < maxScroll - 2,
    );
  }

  function revealActiveLink(link) {
    if (!navLinks || navLinks.scrollWidth <= navLinks.clientWidth) return;

    const padding = 16;
    const visibleLeft = navLinks.scrollLeft + padding;
    const visibleRight = navLinks.scrollLeft + navLinks.clientWidth - padding;
    const linkLeft = link.offsetLeft;
    const linkRight = linkLeft + link.offsetWidth;
    let targetLeft = null;

    if (linkLeft < visibleLeft) {
      targetLeft = Math.max(0, linkLeft - padding);
    } else if (linkRight > visibleRight) {
      targetLeft = linkRight - navLinks.clientWidth + padding;
    }

    if (targetLeft !== null) {
      navLinks.scrollTo({
        left: targetLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }

  function setActive(id) {
    if (activeId === id) return;
    activeId = id;

    links.forEach(function (link) {
      const isActive = link.hash === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
        revealActiveLink(link);
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function lockActive(id) {
    lockedId = id;
    setActive(id);
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(function () {
      lockedId = null;
    }, 1000);
  }

  function syncHash(id) {
    const hash = "#" + id;
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
    const hash = window.location.hash.slice(1);
    if (
      hash &&
      sections.some(function (section) {
        return section.id === hash;
      })
    ) {
      return hash;
    }
    // Sections use content-visibility:auto, so offsetTop can report the
    // contain-intrinsic-size placeholder instead of real layout. When the
    // observer is available it corrects the guess on its first callback.
    if ("IntersectionObserver" in window) return sections[0].id;

    const limit = nav.offsetHeight + 14;
    let current = sections[0].id;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= limit)
        current = sections[i].id;
      else break;
    }
    return current;
  }

  function createSpy() {
    if (spy) spy.disconnect();
    if (!("IntersectionObserver" in window)) return;

    const navH = nav.offsetHeight;
    spy = new IntersectionObserver(
      function (entries) {
        if (lockedId) return;
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            setActive(entries[i].target.id);
          }
        }
      },
      {
        rootMargin:
          "-" +
          (navH + 14) +
          "px 0px -" +
          (window.innerHeight - navH - 15) +
          "px 0px",
        threshold: 0,
      },
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  setActive(initialId());
  updateNavOverflow();
  createSpy();

  let resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      createSpy();
      updateNavOverflow();
      const activeLink = nav.querySelector(".nav-link.is-active");
      if (activeLink) revealActiveLink(activeLink);
    }, 150);
  });
  if (navLinks) {
    navLinks.addEventListener("scroll", updateNavOverflow, { passive: true });
  }
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash.slice(1);
    const isSection = sections.some(function (section) {
      return section.id === hash;
    });
    if (isSection) {
      if (lockedId !== hash) lockActive(hash);
      if (hash === topId) scrollToTop();
    }
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    const reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
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
      const id = link.hash.slice(1);
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

  function forceTopForAboutHash() {
    if (window.location.hash.slice(1) !== topId) return;
    window.scrollTo(0, 0);
  }

  window.requestAnimationFrame(forceTopForAboutHash);
  window.addEventListener("load", forceTopForAboutHash);
})();
