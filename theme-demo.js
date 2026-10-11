import { readableInk } from './demo-colors.mjs';
(() => {
  const host = document.querySelector('[data-theme-app]');
  if (!host) return;
  const workspace = host.querySelector('.theme-workspace');
  const verse = host.querySelector('[data-theme-verse]');
  const name = host.querySelector('[data-theme-name]');
  const status = host.querySelector('[data-theme-status]');
  const colors = host.querySelector('[data-rhyme-colors]');
  const patterns = host.querySelector('[data-rhyme-patterns]');
  const font = host.querySelector('[data-theme-font]');
  const themes = {
    cadence:{name:'Cadence',tokens:['#101114','#15161a','#24262d','#191a1e','#e3e2df','#a6a8b0','#353840']},
    warm:{name:'Warm studio',tokens:['#0d0b0a','#15110f','#221b17','#100d0b','#f3e9da','#9b8d80','#3d312a']},
    paper:{name:'Paper',tokens:['#eee9df','#f7f3eb','#ffffff','#fbf8f1','#211f1b','#6d675d','#c9c0b3']},
    patterns:{name:'Patterned',tokens:['#101114','#15161a','#24262d','#191a1e','#e3e2df','#a6a8b0','#353840']}
  };
  let current = 'cadence';
  document.querySelectorAll('#hero-verse p').forEach(line => verse.append(line.cloneNode(true)));
  const update = () => {
    workspace.dataset.colors = String(colors.checked);
    workspace.dataset.patterns = String(patterns.checked);
    const theme = themes[current];
    status.textContent = theme.name + '. ' + (colors.checked ? 'Rhyme colors on.' : 'Rhyme colors off.') + (patterns.checked ? ' Pattern cues on.' : '');
  };
  host.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    current = button.dataset.theme;
    workspace.dataset.themeStyle = current;
    const theme = themes[current];
    ['workspace','surface','raised','editor','text','muted','border'].forEach((key,index) => workspace.style.setProperty('--sample-' + key,theme.tokens[index]));
    const palette = current === 'patterns' ? ['#0072b2','#e69f00','#cc79a7','#56b4e9'] : ['#3ad8e6','#ff8a4c','#ff5d9e','#b08bff'];
    ['cyan','orange','pink','violet'].forEach((key,index) => workspace.style.setProperty('--' + key,readableInk(palette[index],theme.tokens[3])));
    colors.checked = true;
    patterns.checked = current === 'patterns';
    host.querySelectorAll('[data-theme]').forEach(option => option.setAttribute('aria-pressed',String(option === button)));
    name.textContent = theme.name;
    update();
    window.cadenceDemoMotion?.press(button);
  }));
  colors.addEventListener('change',update);
  patterns.addEventListener('change',update);
  font.addEventListener('change',() => {
    verse.style.setProperty('--sample-writing',{newsreader:'var(--writing)',grotesk:'var(--ui)',mono:'ui-monospace, monospace'}[font.value]);
    status.textContent = 'Writing type changed to ' + font.options[font.selectedIndex].text + '.';
  });
  update();
  host.hidden = false;
  host.closest('section').querySelector('.demo-fallback').hidden = true;
})();
