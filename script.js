(() => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');
  if (menu && nav) {
    const setOpen = (open, restoreFocus = false) => {
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (restoreFocus) menu.focus();
    };
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !nav.contains(event.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', () => setOpen(false));
    document.documentElement.classList.add('enhanced-nav');
  }
  const exposeHashTarget = () => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.tagName === 'DETAILS') target.open = true;
  };
  exposeHashTarget();
  window.addEventListener('hashchange', exposeHashTarget);
})();

(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-motion-toggle]');
  const hero = document.querySelector('.hero-a');
  const atmosphere = document.querySelector('.atmosphere-follow');
  if (!toggle || !hero || !atmosphere) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const storageKey = 'cadence-site-motion-paused';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === '1'; } catch { /* Motion still works without storage. */ }
  let running = false;
  let frame = 0;
  let heroBounds = null;
  let heroX = 0;
  let heroY = 0;
  let activePanel = null;
  let panelBounds = null;
  let lightX = 0;
  let lightY = 0;
  const panels = [...document.querySelectorAll('.desktop,.backup-preview,.lab-preview,.share-canvas,.download-grid article')];
  panels.forEach(panel => panel.classList.add('light-panel'));

  const clearPanel = () => {
    if (activePanel) {
      activePanel.removeAttribute('data-lit');
      activePanel.style.removeProperty('--light-x');
      activePanel.style.removeProperty('--light-y');
    }
    activePanel = null;
    panelBounds = null;
  };
  const clearPointer = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    heroBounds = null;
    heroX = heroY = 0;
    atmosphere.style.setProperty('--atmosphere-x', '0px');
    atmosphere.style.setProperty('--atmosphere-y', '0px');
    clearPanel();
  };
  const syncMotion = () => {
    running = !paused && !reduced.matches && !document.hidden;
    root.classList.toggle('motion-running', running);
    toggle.hidden = reduced.matches;
    toggle.textContent = paused ? 'Resume animation' : 'Pause animation';
    clearPointer();
  };
  const canReact = event => running && finePointer.matches && event.pointerType !== 'touch';
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      atmosphere.style.setProperty('--atmosphere-x', `${heroX}px`);
      atmosphere.style.setProperty('--atmosphere-y', `${heroY}px`);
      if (activePanel) {
        activePanel.style.setProperty('--light-x', `${lightX}px`);
        activePanel.style.setProperty('--light-y', `${lightY}px`);
        activePanel.setAttribute('data-lit', '');
      }
    });
  };
  hero.addEventListener('pointermove', event => {
    if (!canReact(event)) return;
    // Read bounds only on entry or after scroll/resize, not on every frame.
    heroBounds ??= hero.getBoundingClientRect();
    const x = ((event.clientX - heroBounds.left) / heroBounds.width - .5) * 24;
    const y = ((event.clientY - heroBounds.top) / heroBounds.height - .5) * 24;
    const scale = Math.min(1, 12 / (Math.hypot(x, y) || 1));
    heroX = x * scale;
    heroY = y * scale;
    schedule();
  });
  hero.addEventListener('pointerleave', () => {
    heroBounds = null;
    heroX = heroY = 0;
    if (running) schedule();
  });
  panels.forEach(panel => {
    panel.addEventListener('pointermove', event => {
      if (!canReact(event)) return;
      if (activePanel !== panel) {
        clearPanel();
        activePanel = panel;
      }
      panelBounds ??= panel.getBoundingClientRect();
      lightX = event.clientX - panelBounds.left;
      lightY = event.clientY - panelBounds.top;
      schedule();
    });
    panel.addEventListener('pointerleave', clearPanel);
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? '1' : '0'); } catch { /* Keep the choice for this visit. */ }
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  finePointer.addEventListener('change', clearPointer);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', clearPointer, { passive:true });
  window.addEventListener('scroll', clearPointer, { passive:true });
  root.classList.add('motion-ready');
  syncMotion();
})();
