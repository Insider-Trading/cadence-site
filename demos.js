(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 720px)');
  const root = document.documentElement;
  const canMove = () => !reduced.matches && !document.hidden && root.classList.contains('motion-running');
  const running = new Set();
  const animate = (element, frames, duration, fill = 'none') => {
    if (!canMove() || !element.animate) return;
    const animation = element.animate(frames, {
      duration: phone.matches ? duration * .8 : duration,
      easing: getComputedStyle(root).getPropertyValue('--demo-spring').trim(),
      fill
    });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  };
  const settle = () => {
    for (const animation of running) animation.finish();
    running.clear();
  };
  new MutationObserver(() => { if (!canMove()) settle(); })
    .observe(root, { attributes:true, attributeFilter:['class'] });
  reduced.addEventListener('change', settle);
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });

  const verse = document.querySelector('#hero-verse');
  const families = document.querySelector('.family-controls');
  const hint = document.querySelector('.family-hint');
  if (verse && families && hint) {
    families.hidden = false;
    hint.hidden = false;
    document.querySelector('.highlight-key')?.setAttribute('hidden','');
    families.addEventListener('click', event => {
      const button = event.target.closest('[data-family]');
      if (!button) return;
      const family = verse.dataset.family === button.dataset.family ? '' : button.dataset.family;
      if (family) verse.dataset.family = family;
      else delete verse.dataset.family;
      for (const option of families.querySelectorAll('button'))
        option.setAttribute('aria-pressed', String(option.dataset.family === family));
      hint.textContent = family ? button.dataset.description + ' · Tap again to see all four.' : 'Pick a color to follow its sounds through the verse.';
      button.getAnimations().forEach(animation => animation.cancel());
      animate(button, [{transform:'scale(.96)'},{transform:'scale(1)'}],240);
    });
  }

  window.cadenceDemoMotion = { enter(element, direction = 1) {
    element.getAnimations().forEach(animation => animation.cancel());
    animate(element, [{transform:"translateX(" + (direction * 24) + "px)",opacity:.3},{transform:"translateX(0)",opacity:1}],320);
  }, press(element) {
    element.getAnimations().forEach(animation => animation.cancel());
    animate(element,[{transform:"scale(.96)"},{transform:"scale(1)"}],240);
  } };
})();
