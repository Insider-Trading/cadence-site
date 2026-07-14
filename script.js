const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function syncHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 18);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

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

const stage = document.querySelector("[data-tilt]");
const appWindow = stage?.querySelector(".app-window");
if (stage && appWindow && !prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    appWindow.style.transform = `rotateX(${2 - y * 2.4}deg) rotateY(${x * 2.2}deg)`;
  });
  stage.addEventListener("pointerleave", () => {
    appWindow.style.transform = "rotateX(2deg) rotateY(0deg)";
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
