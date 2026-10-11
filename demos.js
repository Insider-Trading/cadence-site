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

  document.querySelectorAll('[data-demo]').forEach(demo => {
    const controls = demo.querySelector('.demo-controls');
    const buttons = [...controls.querySelectorAll('button')];
    const stage = demo.querySelector('.demo-stage');
    const status = demo.querySelector('[data-demo-status]');
    const fullsize = demo.querySelector('[data-demo-fullsize]');
    let current = buttons[0];
    let request = 0;
    const asset = button => './assets/cadence-1-8-' + button.dataset.asset + (phone.matches ? '-phone.jpg' : '-desktop.jpg');
    const show = async (button, resized = false) => {
      const ticket = ++request;
      buttons.forEach(item => item.removeAttribute('aria-busy'));
      if (button === current && !resized && stage.querySelector('picture:not([data-leaving]) img').currentSrc.endsWith(asset(button).slice(1))) {
        status.textContent = button.dataset.caption;
        return;
      }
      button.setAttribute('aria-busy','true');
      const image = new Image();
      image.alt = button.dataset.alt;
      image.src = asset(button);
      try {
        await image.decode();
        if (ticket !== request) return;
        const visible = stage.querySelector('picture:not([data-leaving])');
        const outgoingStyle = getComputedStyle(visible);
        const outgoingTransform = outgoingStyle.transform;
        const outgoingOpacity = outgoingStyle.opacity;
        settle();
        stage.querySelectorAll('[data-leaving]').forEach(item => item.remove());
        const previous = stage.querySelector('picture');
        const next = document.createElement('picture');
        next.append(image);
        stage.append(next);
        previous.dataset.leaving = '';
        const backwards = buttons.indexOf(button) < buttons.indexOf(current);
        current = button;
        stage.href = image.src;
        fullsize.href = image.src;
        stage.setAttribute('aria-label', 'Open ' + button.dataset.label + ' preview at full size');
        status.textContent = button.dataset.caption;
        buttons.forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
          item.removeAttribute('aria-busy');
        });
        const direction = backwards ? -1 : 1;
        if (!resized && canMove()) {
          // Move the captured content itself. The surrounding frame stays still.
          const entrance = animate(next, [
            { transform:'translateX(' + (24 * direction) + 'px)', opacity:0 },
            { transform:'translateX(0)', opacity:1 }
          ],320);
          animate(previous, [
            { transform:outgoingTransform, opacity:outgoingOpacity },
            { transform:'translateX(' + (-12 * direction) + 'px)', opacity:0 }
          ],180,'forwards');
          animate(button, [{transform:'scale(.97)'},{transform:'scale(1)'}],240);
          if (entrance) entrance.finished.catch(() => {}).finally(() => previous.remove());
          else previous.remove();
        } else previous.remove();
      } catch {
        if (ticket !== request) return;
        button.removeAttribute('aria-busy');
        status.textContent = 'That preview could not load. Your current view is still here. Try the choice again.';
      }
    };
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => show(button)));
    phone.addEventListener('change', () => show(current,true));
    // The initial responsive picture also determines the full-size link.
    fullsize.href = stage.href = asset(current);
  });
})();