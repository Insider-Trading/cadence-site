import assert from 'node:assert/strict';
import { resolve } from 'node:path';

export async function verifyAtmosphere(browser, url, output) {
  const page = await browser.newPage({ viewport:{width:1440,height:1000}, reducedMotion:'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const running = () => page.evaluate(() => document.documentElement.classList.contains('motion-running'));
  const motion = () => page.locator('.atmosphere-field').evaluateAll(nodes => nodes.map(node => ({
    state:getComputedStyle(node).animationPlayState, duration:getComputedStyle(node).animationDuration,
  })));
  const offset = () => page.evaluate(() => [
    parseFloat(document.querySelector('.atmosphere-follow').style.getPropertyValue('--atmosphere-x')),
    parseFloat(document.querySelector('.atmosphere-follow').style.getPropertyValue('--atmosphere-y')),
  ]);
  try {
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await running(), true);
    assert.deepEqual(await motion(), [{state:'running',duration:'24s'},{state:'running',duration:'32s'}]);
    assert.equal(await page.locator('.site-atmosphere').getAttribute('aria-hidden'), 'true');
    assert.equal(await page.locator('.site-atmosphere').evaluate(node => getComputedStyle(node).pointerEvents), 'none');
    const hero = await page.locator('.hero-a').boundingBox();
    await page.mouse.move(hero.x + hero.width - 4, hero.y + hero.height - 4);
    await page.waitForFunction(() => parseFloat(document.querySelector('.atmosphere-follow').style.getPropertyValue('--atmosphere-x')) > 0);
    assert(Math.hypot(...await offset()) <= 12.001, 'Pointer response is bounded to 12px');
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector('.atmosphere-follow').style.getPropertyValue('--atmosphere-x') === '0px');
    assert.deepEqual(await offset(), [0,0]);

    const burst = await page.evaluate(async () => {
      const hero = document.querySelector('.hero-a');
      const request = window.requestAnimationFrame;
      const measure = hero.getBoundingClientRect;
      let requests = 0;
      let measurements = 0;
      window.requestAnimationFrame = callback => { requests++; return request(callback); };
      hero.getBoundingClientRect = () => { measurements++; return measure.call(hero); };
      try {
        for (let i = 0; i < 200; i++) hero.dispatchEvent(new PointerEvent('pointermove', {
          pointerType:'mouse', clientX:300 + i, clientY:300,
        }));
        await new Promise(resolve => request(resolve));
        return {requests,measurements};
      } finally {
        window.requestAnimationFrame = request;
        hero.getBoundingClientRect = measure;
        hero.dispatchEvent(new PointerEvent('pointerleave'));
      }
    });
    assert.deepEqual(burst, {requests:1,measurements:1}, 'A pointer burst shares one frame and one bounds measurement');

    await page.locator('.desktop').scrollIntoViewIfNeeded();
    // Let the scroll event invalidate cached pointer bounds before entering the panel.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const panel = await page.locator('.desktop').boundingBox();
    await page.mouse.move(panel.x + 20, panel.y + 6);
    await page.waitForFunction(() => document.querySelector('.desktop').hasAttribute('data-lit'));
    assert((await page.locator('.desktop').evaluate(node => getComputedStyle(node,'::after').maskComposite))
      .split(',').every(value => value.trim() === 'exclude'));
    await page.mouse.move(0,0);
    await page.waitForFunction(() => !document.querySelector('[data-lit]'));
    assert.equal(await page.locator('.desktop').evaluate(node => node.style.getPropertyValue('--light-x')), '');

    const pause = page.getByRole('button', {name:'Pause animation',exact:true});
    await pause.focus();
    await page.keyboard.press('Enter');
    assert.equal(await running(), false);
    assert((await motion()).every(value => value.state === 'paused'));
    await page.reload();
    assert.equal(await running(), false);
    await page.getByRole('button', {name:'Resume animation',exact:true}).click();
    assert.equal(await running(), true);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(() => !document.documentElement.classList.contains('motion-running'));
    assert.equal(await page.locator('[data-motion-toggle]').isVisible(), false);
    assert.equal(await page.locator('.atmosphere-cool').evaluate(node => getComputedStyle(node).animationName), 'none');
    assert.deepEqual(await offset(), [0,0]);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-running'));

    // Exercise the visibility handler deterministically; actual tab switching is checked separately.
    await page.evaluate(() => {
      Object.defineProperty(document,'hidden',{configurable:true,get:() => true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await running(), false);
    assert((await motion()).every(value => value.state === 'paused'));
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await running(), true);
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({path:resolve(output,'atmosphere-desktop.png')});
    assert.deepEqual(errors, []);
    console.log('Atmosphere: timing, 12px pointer bound, exit reset, masked borders, keyboard pause, persistence, reduced motion and visibility handler PASS');
  } finally { await page.close(); }

  const mobile = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
  try {
    await mobile.goto(url);
    await mobile.evaluate(() => document.fonts.ready);
    assert.equal(await mobile.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches), false);
    await mobile.mouse.move(250,250);
    assert.equal(await mobile.evaluate(() => document.querySelector('.atmosphere-follow').style.getPropertyValue('--atmosphere-x')), '0px');
    assert.equal(await mobile.locator('[data-lit]').count(), 0);
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await mobile.screenshot({path:resolve(output,'atmosphere-phone.png')});
    await mobile.getByRole('button',{name:'Pause animation',exact:true}).tap();
    assert.equal(await mobile.getByRole('button',{name:'Resume animation',exact:true}).isVisible(), true);
    await mobile.screenshot({path:resolve(output,'atmosphere-phone-footer.png')});
    console.log('Atmosphere touch: static pointer response, readable layout and pause control PASS');
  } finally { await mobile.close(); }

  const blocked = await browser.newPage({reducedMotion:'no-preference'});
  try {
    await blocked.addInitScript(() => {
      Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new DOMException('Blocked','SecurityError'); };
    });
    await blocked.goto(url);
    await blocked.getByRole('button',{name:'Pause animation',exact:true}).click();
    assert.equal(await blocked.getByRole('button',{name:'Resume animation',exact:true}).isVisible(), true);
    await blocked.getByRole('button',{name:'Resume animation',exact:true}).click();
    assert.equal(await blocked.evaluate(() => document.documentElement.classList.contains('motion-running')), true);
    console.log('Atmosphere storage unavailable: usable pause/resume PASS');
  } finally { await blocked.close(); }
}

