// Values match the application appearance presets. Pattern cues remain independent.
export const THEMES = {
  cadence: { name: 'Cadence', tokens: ['#101114','#15161a','#24262d','#191a1e','#e3e2df','#a6a8b0','#353840'] },
  warm: { name: 'Warm studio', tokens: ['#0d0b0a','#15110f','#221b17','#100d0b','#f3e9da','#9b8d80','#3d312a'] },
  paper: { name: 'Paper', tokens: ['#eee9df','#f7f3eb','#ffffff','#fbf8f1','#211f1b','#6d675d','#c9c0b3'] },
};
export const PALETTES = {
  cadence: ['#3ad8e6','#ff8a4c','#ff5d9e','#b08bff'],
  protanopia: ['#56b4e9','#e69f00','#f0e442','#0072b2','#cc79a7'],
  deuteranopia: ['#0072b2','#e69f00','#cc79a7','#56b4e9','#f0e442'],
  tritanopia: ['#f26b8a','#46c3bc','#b5415b','#23827b','#f5b5c4'],
};
export const INITIAL_THEME = Object.freeze({ theme: 'cadence', palette: 'cadence', font: 'newsreader', colors: true, patterns: false });
export function updateTheme(state, field, value) {
  const valid = field === 'theme' ? Object.hasOwn(THEMES,value)
    : field === 'palette' ? Object.hasOwn(PALETTES,value)
    : field === 'font' ? ['newsreader','grotesk','mono'].includes(value)
    : ['colors','patterns'].includes(field) && typeof value === 'boolean';
  return valid ? { ...state, [field]: value } : state;
}
