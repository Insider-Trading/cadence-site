const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
let scrollFrame = 0;

function syncHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 18);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

function syncScrollEffects() {
  scrollFrame = 0;
  const scrollTop = window.scrollY;
  const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(scrollTop / scrollRange, 0), 1);

  root.style.setProperty("--scroll-progress", String(progress));
  if (prefersReducedMotion.matches) {
    root.style.setProperty("--grid-shift", "0px");
    root.style.setProperty("--orb-shift", "0px");
    root.style.setProperty("--orb-shift-reverse", "0px");
    root.style.setProperty("--ring-shift", "0px");
    root.style.setProperty("--ring-turn", "0deg");
    root.style.setProperty("--beam-shift", "0px");
    return;
  }

  root.style.setProperty("--grid-shift", `${Math.min(scrollTop * 0.08, 420)}px`);
  root.style.setProperty("--orb-shift", `${scrollTop * -0.035}px`);
  root.style.setProperty("--orb-shift-reverse", `${scrollTop * 0.025}px`);
  root.style.setProperty("--ring-shift", `${scrollTop * -0.06}px`);
  root.style.setProperty("--ring-turn", `${scrollTop * 0.012}deg`);
  root.style.setProperty("--beam-shift", `${scrollTop * -0.075}px`);
}

function scheduleScrollEffects() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(syncScrollEffects);
}

syncScrollEffects();
window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
window.addEventListener("resize", scheduleScrollEffects, { passive: true });
prefersReducedMotion.addEventListener?.("change", scheduleScrollEffects);

menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu?.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  });
});

const reveals = document.querySelectorAll(".reveal");
if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  reveals.forEach((node) => node.classList.add("in-view"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.13, rootMargin: "0px 0px -45px" },
  );
  reveals.forEach((node) => observer.observe(node));
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
