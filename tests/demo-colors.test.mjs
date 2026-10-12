import assert from 'node:assert/strict';
import test from 'node:test';
import { contrast, readableInk } from '../demo-colors.mjs';
const palettes = [
  ['#3ad8e6','#ff8a4c','#ff5d9e','#b08bff'],
  ['#0072b2','#e69f00','#cc79a7','#56b4e9']
];
for (const background of ['#191a1e','#100d0b','#fbf8f1']) {
  test('rhyme ink remains readable on ' + background, () => {
    for (const palette of palettes) for (const color of palette) {
      const result = readableInk(color,background);
      assert.ok(contrast(result,background) >= 4.5, color + ' became ' + result);
      if (contrast(color,background) >= 4.5) assert.equal(result,color);
    }
  });
}
