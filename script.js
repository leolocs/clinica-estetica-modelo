(() => {
  "use strict";

  const menu = document.querySelector("#mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");

  function setMenuOpen(isOpen) {
    if (!menu || !menuToggle) return;
    menu.hidden = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) menuClose?.focus();
    else menuToggle.focus();
  }

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  menuClose?.addEventListener("click", () => setMenuOpen(false));
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu && !menu.hidden) setMenuOpen(false);
    if (event.key === "Tab" && menu && !menu.hidden) {
      const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')]
        .filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  let activeSlide = 0;
  let slideTimer;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function showSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  }

  function stopSlideTimer() {
    window.clearInterval(slideTimer);
  }

  function startSlideTimer() {
    stopSlideTimer();
    if (slides.length > 1 && !motionPreference.matches && !document.hidden) {
      slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlideTimer();
    });
  });
  document.querySelector(".hero")?.addEventListener("mouseenter", stopSlideTimer);
  document.querySelector(".hero")?.addEventListener("mouseleave", startSlideTimer);
  document.querySelector(".hero")?.addEventListener("focusin", stopSlideTimer);
  document.querySelector(".hero")?.addEventListener("focusout", startSlideTimer);
  document.addEventListener("visibilitychange", startSlideTimer);
  motionPreference.addEventListener?.("change", startSlideTimer);
  startSlideTimer();

  const siteHeader = document.querySelector(".site-header");
  function updateHeaderOnScroll() {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const track = document.getElementById(button.dataset.scroll);
      if (!track) return;
      const card = track.querySelector(".treatment-card");
      const cardGap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = (card?.getBoundingClientRect().width || track.clientWidth) + cardGap;
      track.scrollBy({ left: distance * Number(button.dataset.direction), behavior: "smooth" });
    });
  });

  document.querySelectorAll(".compare-range").forEach((range) => {
    const frame = range.closest(".compare-frame");
    if (!frame) return;
    const updateComparison = () => {
      frame.style.setProperty("--compare-position", `${range.value}%`);
    };
    const updateFromPointer = (event) => {
      const bounds = frame.getBoundingClientRect();
      const percentage = Math.round(((event.clientX - bounds.left) / bounds.width) * 90 + 5);
      range.value = String(Math.max(5, Math.min(95, percentage)));
      updateComparison();
    };
    let isDragging = false;
    range.addEventListener("input", updateComparison);
    range.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      isDragging = true;
      range.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    });
    range.addEventListener("pointermove", (event) => {
      if (isDragging) updateFromPointer(event);
    });
    const finishDragging = () => {
      isDragging = false;
    };
    range.addEventListener("pointerup", finishDragging);
    range.addEventListener("pointercancel", finishDragging);
    updateComparison();
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const current = button.closest(".faq-item");
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-item").forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        const isOpen = item === current && shouldOpen;
        item.classList.toggle("is-open", isOpen);
        question.setAttribute("aria-expanded", String(isOpen));
        answer.hidden = !isOpen;
      });
    });
  });

  document.querySelectorAll('.social-links a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  if (window.lucide) window.lucide.createIcons();
})();
