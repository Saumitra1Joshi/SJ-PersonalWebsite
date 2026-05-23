(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  const revealItems = document.querySelectorAll(".reveal");
  const tiltCards = document.querySelectorAll(".tilt-card");
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  const typeTarget = document.querySelector(".type-target");
  const contactForm = document.querySelector(".contact-form");
  const prefersFinePointer = window.matchMedia("(pointer:fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
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
      { threshold: 0.35 }
    );

    document.querySelectorAll("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (prefersFinePointer && !prefersReducedMotion) {
    tiltCards.forEach((card) => {
      const reset = () => {
        card.style.transform = "";
      };

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;
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
  }

  if (typeTarget && !prefersReducedMotion) {
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
        setTimeout(tick, 70);
        return;
      }

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(tick, 38);
        return;
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tick, 180);
    };

    tick();
  } else if (typeTarget) {
    const firstWord = (typeTarget.dataset.words || "").split(",")[0];
    typeTarget.textContent = firstWord ? firstWord.trim() : "";
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const loading = contactForm.querySelector(".loading");
      const sentMessage = contactForm.querySelector(".sent-message");
      const errorMessage = contactForm.querySelector(".error-message");

      if (loading) loading.classList.add("d-block");
      if (sentMessage) sentMessage.classList.remove("d-block");
      if (errorMessage) errorMessage.classList.remove("d-block");

      setTimeout(() => {
        if (loading) loading.classList.remove("d-block");
        if (sentMessage) sentMessage.classList.add("d-block");
        contactForm.reset();
      }, 1200);
    });
  }
})();
