import assert from 'node:assert/strict';
import test from 'node:test';
import { THEMES, PALETTES, INITIAL_THEME, updateTheme } from '../theme-state.mjs';
import { readableInk, contrast } from '../demo-colors.mjs';
test('theme changes preserve all writing and rhyme choices', () => {
  let draft = {...INITIAL_THEME, palette:'tritanopia', font:'mono', colors:false, patterns:true};
  for (const theme of Object.keys(THEMES)) {
    draft = updateTheme(draft,'theme',theme);
    assert.deepEqual(draft,{theme,palette:'tritanopia',font:'mono',colors:false,patterns:true});
  }
});
test('palette and patterns can be changed independently in either direction', () => {
  for (const palette of Object.keys(PALETTES)) for (const patterns of [false,true]) {
    const state = updateTheme({...INITIAL_THEME,patterns},'palette',palette);
    assert.equal(state.patterns,patterns);
    assert.equal(updateTheme(state,'patterns',!patterns).palette,palette);
    assert.deepEqual(INITIAL_THEME,{theme:'cadence',palette:'cadence',font:'newsreader',colors:true,patterns:false});
  }
});
test('all demo palettes stay readable on all theme writing surfaces', () => {
  for (const theme of Object.values(THEMES)) for (const colors of Object.values(PALETTES)) for (const color of colors) {
    assert.ok(contrast(readableInk(color,theme.tokens[3]),theme.tokens[3]) >= 4.5);
  }
});
