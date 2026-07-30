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
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0] && visible[0].target.id) {
          setActive(visible[0].target.id);
        }
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
