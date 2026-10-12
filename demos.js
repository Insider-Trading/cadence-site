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
  const settle = (container) => {
    for (const animation of running) {
      const target = animation.effect?.target;
      if (!container || container === target || container.contains(target)) {
        animation.finish();
        running.delete(animation);
      }
    }
  };
  new MutationObserver(() => { if (!canMove()) settle(); })
    .observe(root, { attributes:true, attributeFilter:['class'] });
  reduced.addEventListener('change', () => settle());
  window.addEventListener('resize', () => settle());
  window.visualViewport?.addEventListener('resize', () => settle());
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

  const moveTitle = (title, from) => {
    if (!title || !from) return;
    const to = title.getBoundingClientRect();
    const style = getComputedStyle(title);
    const font = parseFloat(style.fontSize);
    const insetX = (parseFloat(style.paddingLeft)||0) + (parseFloat(style.borderLeftWidth)||0);
    const insetY = (parseFloat(style.paddingTop)||0) + (parseFloat(style.borderTopWidth)||0);
    const dx = from.left - to.left - insetX * from.font/font;
    const dy = from.top - to.top - insetY * from.font/font;
    if (Math.abs(dy) > innerHeight || Math.abs(dx) > innerWidth) return;
    title.style.transformOrigin = 'top left';
    const scale = from.font / font;
    const frames = [{transform:'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')'},
      {transform:'translate(' + dx/2 + 'px,' + dy/2 + 'px) scale(' + (1+scale)/2 + ')',offset:.5}, {transform:'none'}];
    const animation = animate(title,frames,320);
    if (animation && title.matches?.('input')) {
      title.style.borderColor = 'transparent';
      animation.finished.catch(() => {}).finally(() => title.style.removeProperty('border-color'));
    }
  };
  window.cadenceDemoMotion = {
    finish: settle,
    capture(element, text = false) {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {left:rect.left + (text ? (parseFloat(style.paddingLeft)||0)+(parseFloat(style.borderLeftWidth)||0) : 0),top:rect.top + (text ? (parseFloat(style.paddingTop)||0)+(parseFloat(style.borderTopWidth)||0) : 0),width:rect.width,height:rect.height,font:parseFloat(style.fontSize)};
    },
    openNote(panel, origin, isNew) {
      if (!canMove()) return;
      const surface = panel.querySelector('.sample-note-surface');
      const title = panel.querySelector('.sample-title');
      const target = panel.getBoundingClientRect();
      const card = origin?.card;
      const nearby = card && Math.abs(card.top - target.top) < innerHeight / 3;
      const start = nearby
        ? 'translate(' + (card.left-target.left) + 'px,' + (card.top-target.top) + 'px) scale(' + card.width/target.width + ',' + card.height/target.height + ')'
        : 'translateY(' + (isNew ? 18 : 10) + 'px) scale(.985)';
      animate(surface,[{transform:start,opacity:.7},{transform:'none',opacity:1}],320);
      moveTitle(title,origin?.title);
      for (const child of panel.children) {
        if (child === surface || child.contains(title)) continue;
        animate(child,[{transform:'translateY(8px)',opacity:0},{transform:'none',opacity:1}],240);
      }
      if (isNew) animate(title,[{transform:'translateY(12px)',opacity:.4},{transform:'none',opacity:1}],320);
    },
    returnNote(card, origin) {
      if (!card || !canMove()) return;
      moveTitle(card.querySelector('.sample-card-title'),origin);
      animate(card,[{opacity:.5},{opacity:1}],180);
    },
    select(indicator, from) {
      const to = indicator.getBoundingClientRect();
      if (!from || !to.width || !to.height) return;
      indicator.getAnimations().forEach(animation => animation.cancel());
      animate(indicator,[{transform:'translate(' + (from.left-to.left) + 'px,' + (from.top-to.top) + 'px) scale(' + from.width/to.width + ',' + from.height/to.height + ')'}, {transform:'none'}],280);
    },
    enter(element, direction = 1) {
    element.getAnimations().forEach(animation => animation.cancel());
    animate(element, [{transform:"translateX(" + (direction * 24) + "px)",opacity:.3},{transform:"translateX(0)",opacity:1}],320);
  }, press(element) {
    element.getAnimations().forEach(animation => animation.cancel());
    animate(element,[{transform:"scale(.96)"},{transform:"scale(1)"}],240);
  } };
})();
