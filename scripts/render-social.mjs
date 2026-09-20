import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(root, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: `
    .nav,.skip-link,footer,main>:not(.hero-a),.hero .actions,.hero .fine,.signature{display:none!important}
    .wrap{width:1088px}.mode-hybrid .hero-a{padding:0!important;min-height:630px;grid-template-columns:.95fr 1.15fr;gap:44px}
    .mode-hybrid .hero-a h1{font-size:70px;letter-spacing:-2.5px}.hero .lede{font-size:17px}
    .verse-sheet{padding-left:26px}.verse p{font-size:26px;line-height:1.4;margin-bottom:22px}.verse .line-number{left:-26px}
    .release-label{font-size:11px}.sheet-top{font-size:10px}
  ` });
  if (await page.evaluate(() => document.documentElement.scrollHeight > 630)) throw new Error('Social image overflow');
  const output = resolve(root, 'assets/cadence-1-7-social.png');
  await page.screenshot({ path: output });
  console.log('Rendered 1200 × 630 social image from the site hero.');
} finally { await browser.close(); }
