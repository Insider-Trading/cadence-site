import { createCorrections, familyNames } from './rhyme-state.mjs';

const host = document.querySelector('[data-rhyme-demo]');
if (host) {
  const verse = host.querySelector('[data-rhyme-verse]');
  const panel = host.querySelector('[data-rhyme-panel]');
  const dock = host.querySelector('[data-rhyme-dock]');
  const status = host.querySelector('[data-rhyme-status]');
  const phone = matchMedia('(max-width:720px)');
  const motion = window.cadenceDemoMotion;
  const words = [];
  const lines = [];
  document.querySelectorAll('#hero-verse p').forEach((source,index) => {
    const line = source.cloneNode(true);
    line.querySelector('.line-number')?.remove();
    line.className = 'rhyme-line';
    line.dataset.line = index;
    line.querySelectorAll('mark').forEach(mark => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rhyme-word';
      button.textContent = mark.textContent;
      button.dataset.original = mark.className;
      button.setAttribute('aria-controls','rhyme-correction-panel');
      words.push({button,word:mark.textContent,family:mark.className,line});
      mark.replaceWith(button);
    });
    lines.push(line);
    verse.append(line);
  });
  const state = createCorrections(words);
  let selected = words.find(item => item.word.toLowerCase() === 'stress') || words[0];
  const title = panel.querySelector('[data-selected-word]');
  const familyLabel = panel.querySelector('[data-selected-family]');
  const members = panel.querySelector('[data-family-members]');
  const choices = panel.querySelector('[data-family-choices]');
  const exclude = panel.querySelector('[data-exclude]');
  const undo = host.querySelector('[data-rhyme-undo]');
  const reset = host.querySelector('[data-rhyme-reset]');
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  const placePanel = () => {
    const focused = document.activeElement;
    if (phone.matches) {
      if (selected.line.nextElementSibling !== panel) selected.line.after(panel);
    } else if (panel.parentElement !== dock) dock.append(panel);
    if (focused instanceof HTMLElement && host.contains(focused)) focused.focus({preventScroll:true});
  };
  const render = () => {
    const activeFamily = state.family(selected.word);
    for (const item of words) {
      const family = state.family(item.word);
      item.button.dataset.family = family || 'none';
      item.button.dataset.related = String(!!activeFamily && family === activeFamily);
      item.button.setAttribute('aria-pressed',String(item === selected));
      item.button.setAttribute('aria-label',item.word + (family ? ', ' + familyNames[family] + ' family' : ', not a rhyme'));
    }
    panel.style.setProperty('--rhyme-accent',activeFamily ? 'var(--' + activeFamily + ')' : 'var(--sample-muted)');
    title.textContent = selected.word;
    familyLabel.textContent = activeFamily ? familyNames[activeFamily] + ' family' : 'Not a rhyme';
    members.textContent = activeFamily ? state.members(activeFamily).join(' · ') : 'This word is ungrouped. Choose a family to bring it back.';
    choices.querySelectorAll('button').forEach(button => {
      const current = button.dataset.targetFamily === activeFamily;
      button.setAttribute('aria-pressed',String(current));
      button.querySelector('small').textContent = state.members(button.dataset.targetFamily).filter(word => word !== selected.word.toLowerCase()).slice(0,3).join(' · ') || 'No other words';
    });
    exclude.disabled = !activeFamily;
    undo.disabled = !state.canUndo;
    reset.disabled = !state.changed;
    host.querySelector('[data-rhyme-count]').textContent = state.changed ? state.changed + (state.changed === 1 ? ' correction in this sample' : ' corrections in this sample') : 'Original analysis · Loose matching';
    placePanel();
  };
  for (const [family,label] of Object.entries(familyNames)) {
    const button = node('button','','rhyme-family-choice');
    button.type = 'button';
    button.dataset.targetFamily = family;
    button.style.setProperty('--choice-color','var(--' + family + ')');
    button.setAttribute('aria-label','Move selected word to ' + label + ' family');
    button.append(node('span',label),node('small',''));
    button.addEventListener('click',() => {
      if (!state.change(selected.word,family)) return;
      render();
      status.textContent = selected.word + ' now belongs to the ' + label + ' family. The verse and family list have changed.';
      motion?.press(selected.button);
    });
    choices.append(button);
  }
  words.forEach(item => item.button.addEventListener('click',() => {
    if (selected === item) return;
    selected = item;
    render();
    motion?.enter(panel);
    status.textContent = 'Selected ' + item.word + '. The correction panel shows its family.';
  }));
  exclude.addEventListener('click',() => {
    if (!state.change(selected.word,null)) return;
    render();
    selected.button.focus({preventScroll:true});
    status.textContent = selected.word + ' is no longer highlighted as a rhyme. You can choose another family or undo.';
  });
  undo.addEventListener('click',() => {
    if (!state.undo()) return;
    render();
    if (undo.disabled) selected.button.focus({preventScroll:true});
    status.textContent = 'Undid the last correction.';
  });
  reset.addEventListener('click',() => {
    if (!state.reset()) return;
    render();
    selected.button.focus({preventScroll:true});
    status.textContent = 'Original analysis restored. Your sample corrections have been cleared.';
  });
  panel.addEventListener('keydown',event => {
    if (event.key === 'Escape') { event.preventDefault(); selected.button.focus({preventScroll:true}); }
  });
  phone.addEventListener('change',placePanel);
  render();
  host.hidden = false;
  host.closest('section').querySelector('[data-rhyme-fallback]').hidden = true;
}
