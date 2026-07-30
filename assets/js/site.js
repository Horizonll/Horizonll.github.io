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
  var lockedId = null;
  var stickyId = null;
  var stickyY = 0;
  var unlockTimer = 0;
  var settleTimer = 0;
  var ticking = false;
  var unlockOnScroll = null;
  var unlockOnScrollEnd = null;

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.hash === "#" + id);
    });
  }

  function navOffset() {
    return nav.getBoundingClientRect().height + 14;
  }

  function activeFromScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var doc = document.documentElement;
    var maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    var offset = navOffset();
    var progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    // Move the probe down the viewport as we approach the page end so short
    // trailing sections can activate without inventing empty bottom space.
    var probe = Math.min(
      doc.scrollHeight - 1,
      scrollY + offset + progress * Math.max(0, window.innerHeight - offset)
    );

    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      var start = sections[i].offsetTop;
      var end =
        i + 1 < sections.length
          ? sections[i + 1].offsetTop
          : doc.scrollHeight;
      if (probe >= start && probe < end) return sections[i].id;
      if (start <= probe) current = sections[i].id;
    }
    return current;
  }

  function updateActive() {
    if (lockedId) {
      setActive(lockedId);
      return;
    }
    var y = window.scrollY || window.pageYOffset;
    if (stickyId && Math.abs(y - stickyY) < 8) {
      setActive(stickyId);
      return;
    }
    stickyId = null;
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
    stickyId = lockedId;
    stickyY = window.scrollY || window.pageYOffset;
    lockedId = null;
    updateActive();
  }

  function lockActive(id) {
    detachUnlockListeners();
    stickyId = null;
    lockedId = id;
    setActive(id);

    if ("onscrollend" in window) {
      unlockOnScrollEnd = function () {
        clearLock();
      };
      window.addEventListener("scrollend", unlockOnScrollEnd, { once: true });
      unlockTimer = window.setTimeout(clearLock, 1500);
      return;
    }

    unlockOnScroll = function () {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(clearLock, reduceMotion ? 40 : 140);
    };
    window.addEventListener("scroll", unlockOnScroll, { passive: true });
    settleTimer = window.setTimeout(clearLock, reduceMotion ? 40 : 140);
    unlockTimer = window.setTimeout(clearLock, 1500);
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
    link.addEventListener("click", function () {
      var id = link.hash.slice(1);
      if (id) lockActive(id);
    });
  });
})();
