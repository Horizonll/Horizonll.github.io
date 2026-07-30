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
