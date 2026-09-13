import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const verse = [
  'I sit with this, pick at it, get specific with the rhythm and',
  'Shift the stress, trim excess, give the sentence room to breathe,',
  'Write it then recite it, if I choke then I revise it,',
  'Make it sound like I just said it, even if it took all night.',
];
test('owner verse and engine marks stay intact', () => {
  const block = html.match(/<div class="verse lyrics" id="hero-verse">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(block, 'canonical hero verse exists');
  const lines = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => m[1].replace(/<span class="line-number"[^>]*>.*?<\/span>/g, '').replace(/<[^>]*>/g, ''));
  assert.deepEqual(lines, verse);
  assert.equal([...block.matchAll(/<mark /g)].length, 19);
  assert.match(html, /data-density>76</);
});
test('release boundary is honest', () => {
  assert.doesNotMatch(html, /1\.6 preview|COMING IN 1\.6|Not published yet|being prepared for release/);
  assert.match(html, /releases\/download\/v1\.6\.0\/Cadence_1\.6\.0_x64-setup\.exe/);
  assert.match(html, /data-download="android"[^>]*href="https:\/\/github\.com\/Insider-Trading\/cadence-site\/releases\/download\/v1\.6\.0\/cadence-v1\.6\.0-android\.apk"/);
  assert.match(html, /releases\/download\/v1\.6\.0\/SHA256SUMS\.txt/);
  assert.doesNotMatch(html, /releases\/download\/v1\.5\.1\//);
  assert.match(html, /not on Google Play/);
  assert.match(html, /Do not uninstall first/);
});
test('navigation and local resources resolve', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs are unique');
  for (const id of ['product', 'mobile', 'studio', 'guide', 'downloads']) assert.ok(ids.includes(id), id);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `target ${id}`);
  for (const [, url] of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
    assert.ok(existsSync(fileURLToPath(new URL(url.split('?')[0], root))), `local resource ${url}`);
  }
});
test('requested word and Lab examples remain', () => {
  for (const word of ['pressure','session','lesson','flow','glow','show','crazy broke','maybe','baby','wavy','both','bro','smoke','Maybe','Both']) assert.ok(html.includes(word), word);
  assert.match(html, /Write<\/mark> it then <mark class="violet">recite<\/mark> it then <mark class="violet">revise<\/mark> it/);
});
test('safety and accessibility are part of the page', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="site-nav"/);
  assert.match(html, /<details/);
  assert.doesNotMatch(html, /hear the rhyme|creativity, elevated|with room to work|still free\. still your writing/i);
});
test('social metadata points to the generated 1200 by 630 image', () => {
  assert.ok(html.includes('/assets/cadence-1-6-social.png'));
  const png = readFileSync(new URL('assets/cadence-1-6-social.png', root));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
