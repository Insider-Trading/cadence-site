import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verifyAtmosphere } from './atmosphere-check.mjs';

// Install Playwright locally, or point PLAYWRIGHT_MODULE at its index.mjs.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, '.superpowers/qa');
await mkdir(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('Outside site');
    res.setHeader('Content-Type', types[extname(target)] || 'application/octet-stream');
    res.end(await readFile(target));
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [1440, 820, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.url().startsWith(url) && r.status() >= 400) errors.push(r.url()); });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, width + ': overflow');
    assert.equal(await page.locator('#hero-verse mark').count(), 19);
    assert.equal(await page.locator('#hero-verse p').count(), 4);
    assert.ok(await page.locator('.hero-a').isVisible());
    assert.ok(await page.locator('#product').isVisible());
    if (width <= 900) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.ok(await menu.evaluate(el => el === document.activeElement));
      await menu.click();
      await page.getByRole('link', { name: 'Getting started', exact: true }).click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.goto(url + '/#drive-guide');
    assert.equal(await page.locator('#drive-guide').getAttribute('open'), '');
    await page.goto(url);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
    await page.keyboard.press('Enter');
    const shortTargets = await page.locator('a, button, summary').evaluateAll(nodes => nodes
      .filter(n => n.getClientRects().length && n.getBoundingClientRect().height < 43.9)
      .map(n => ({ text: n.textContent.trim(), height: n.getBoundingClientRect().height })));
    assert.deepEqual(shortTargets, [], width + ': touch targets');
    await page.evaluate(() => window.scrollTo(0, 0));
    // A full-page screenshot does not trigger loading for offscreen lazy images.
    for (const img of await page.locator('img').all()) {
      if (!await img.isVisible()) continue;
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
      assert.ok(await img.evaluate(el => el.naturalWidth > 0), 'preview image loaded');
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: resolve(output, 'site-' + width + '.png'), fullPage: true });
    if (width === 390) {
      await page.screenshot({ path: resolve(output, 'phone-opening.png') });
      await page.locator('#rhyme-families').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, 'phone-rhymes.png') });
      await page.locator('#downloads').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, 'phone-downloads.png') });
    }
    assert.deepEqual(errors, []);
    console.log(width + ': layout, navigation, keyboard, touch targets, resources PASS');
    await page.close();
  }
  const plain = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
  await plain.goto(url);
  assert.ok(await plain.getByRole('link', { name: 'Getting started', exact: true }).isVisible());
  assert.equal(await plain.locator('#hero-verse mark').count(), 19);
  assert.equal(await plain.locator('[data-motion-toggle]').isVisible(), false);
  assert.equal(await plain.locator('.atmosphere-cool').evaluate(node => getComputedStyle(node).animationName), 'none');
  assert.notEqual(await plain.locator('.atmosphere-cool').evaluate(node => getComputedStyle(node).backgroundImage), 'none');
  assert.equal(await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await plain.locator('#drive-guide summary').click();
  assert.equal(await plain.locator('#drive-guide').getAttribute('open'), '');
  console.log('JavaScript disabled: navigation, verse, disclosure and layout PASS');
  await plain.close();
  await verifyAtmosphere(browser, url, output);
} finally { await browser.close(); server.close(); }
