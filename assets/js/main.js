(function () {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  const cursorGlow = document.querySelector(".cursor-glow");
  const revealItems = document.querySelectorAll(".reveal");
  const tiltCards = document.querySelectorAll(".tilt-card");
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  const typeTarget = document.querySelector(".type-target");

  const setNavState = (open) => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const next = navToggle.getAttribute("aria-expanded") !== "true";
      setNavState(next);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }
  });

  if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = "none";
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.45 }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  tiltCards.forEach((card) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const reset = () => {
      card.style.transform = "";
    };

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
  });

  spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });

  if (typeTarget) {
    const words = (typeTarget.dataset.words || "")
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const currentWord = words[wordIndex] || "";
      typeTarget.textContent = currentWord.slice(0, charIndex);

      if (!deleting && charIndex < currentWord.length) {
        charIndex += 1;
        setTimeout(tick, 75);
        return;
      }

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(tick, 42);
        return;
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tick, 180);
    };

    tick();
  }
})();
