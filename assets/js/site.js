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
    var y = window.scrollY || window.pageYOffset;
    var offset = navOffset();
    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop - offset <= y + 1) {
        current = sections[i].id;
      }
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
