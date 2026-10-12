import { readableInk } from './demo-colors.mjs';
import { THEMES, PALETTES, INITIAL_THEME, updateTheme } from './theme-state.mjs';
(() => {
  const host = document.querySelector('[data-theme-app]');
  if (!host) return;
  const workspace = host.querySelector('.theme-workspace');
  const verse = host.querySelector('[data-theme-verse]');
  const status = host.querySelector('[data-theme-status]');
  let state = { ...INITIAL_THEME };
  document.querySelectorAll('#hero-verse p').forEach(line => verse.append(line.cloneNode(true)));
  const render = () => {
    const theme = THEMES[state.theme];
    workspace.dataset.themeStyle = state.theme;
    workspace.dataset.colors = String(state.colors);
    workspace.dataset.patterns = String(state.patterns);
    ['workspace','surface','raised','editor','text','muted','border'].forEach((key,index) => workspace.style.setProperty('--sample-' + key,theme.tokens[index]));
    ['cyan','orange','pink','violet'].forEach((key,index) => workspace.style.setProperty('--' + key,readableInk(PALETTES[state.palette][index],theme.tokens[3])));
    verse.style.setProperty('--sample-writing',{newsreader:'var(--writing)',grotesk:'var(--ui)',mono:'ui-monospace, monospace'}[state.font]);
    host.querySelectorAll('[data-theme]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.theme === state.theme)));
  };
  host.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    state = updateTheme(state,'theme',button.dataset.theme);
    render();
    status.textContent = THEMES[state.theme].name + ' theme applied to preview.';
    window.cadenceDemoMotion?.press(button);
  }));
  for (const [selector,field] of [['[data-rhyme-palette]','palette'],['[data-theme-font]','font'],['[data-rhyme-colors]','colors'],['[data-rhyme-patterns]','patterns']]) {
    const input = host.querySelector(selector);
    input.addEventListener('change', () => {
      state = updateTheme(state,field,input.type === 'checkbox' ? input.checked : input.value);
      render();
    });
  }
  render();
  host.hidden = false;
  host.closest('section').querySelector('.demo-fallback').hidden = true;
})();
