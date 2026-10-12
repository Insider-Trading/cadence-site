(() => {
  const app = document.querySelector('[data-notes-app]');
  if (!app) return;
  const panel = app.querySelector('[data-notes-panel]');
  const status = app.querySelector('[data-notes-status]');
  const createButton = app.querySelector('[data-new-note]');
  const motion = window.cadenceDemoMotion;
  const originalVerse = [...document.querySelectorAll('#hero-verse p')]
    .map(line => [...line.childNodes].filter(node => !node.classList?.contains('line-number')).map(node => node.textContent).join('')).join('\n');
  const notes = [
    { id:1, title:'Verse notes', body:'## First pass\n\n' + originalVerse + '\n\n## Next listen\n\n- [ ] Read the verse aloud\n- [ ] Check the last line', tags:['verse','in progress'] },
    { id:2, title:'Session checklist', body:'## Before recording\n\n- [x] Open the song\n- [ ] Warm up\n- [ ] Record a take\n- [ ] Listen back', tags:['session'] },
    { id:3, title:'Loose lines', body:'Write it then recite it then revise it', tags:['loose lines'] },
    { id:4, title:'Stage notes', body:'## Rehearsal\n\nCheck the order of the songs.\n\nLeave time between takes.', tags:['session'] }
  ];
  let nextId = 5;
  let query = '';
  let libraryScroll = null;
  panel.addEventListener('pointerdown', () => motion?.finish(panel), {capture:true});
  panel.addEventListener('keydown', () => motion?.finish(panel), {capture:true});
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const announce = text => { status.textContent = text; };
  const countWords = body => body.replace(/^#{1,3}\s+|^- \[[ xX]\]\s+/gm,'').trim().split(/\s+/).filter(Boolean).length;
  const library = (returnId, animate = true) => {
    const origin = motion?.capture(panel.querySelector('.sample-title'),true);
    motion?.finish(panel);
    panel.classList.remove('is-editing');
    panel.innerHTML = '<label class="sample-search"><span>Find a note</span><input type="search" placeholder="Search titles, text or tags" aria-label="Search sample notes"></label><div class="sample-note-grid"></div><p class="sample-empty" hidden>No notes match. Try another search.</p>';
    const search = panel.querySelector('input');
    const grid = panel.querySelector('.sample-note-grid');
    const empty = panel.querySelector('.sample-empty');
    const renderCards = () => {
      grid.replaceChildren();
      const term = query.trim().toLocaleLowerCase();
      for (const note of notes) {
        if (term && ![note.title,note.body,...note.tags].join(' ').toLocaleLowerCase().includes(term)) continue;
        const card = element('button','sample-note-card');
        card.type = 'button';
        card.dataset.noteId = note.id;
        card.setAttribute('aria-label','Open ' + (note.title.trim() || 'Untitled note'));
        card.append(element('span','sample-card-title',note.title.trim() || 'Untitled note'));
        card.append(element('span','sample-snippet',note.body.replace(/^#+\s/gm,'').replace(/^- \[[ x]\]\s/gm,'').slice(0,145) || 'A blank page. Start anywhere.'));
        const tags = element('span','sample-card-tags');
        note.tags.forEach(tag => tags.append(element('span','sample-tag',tag)));
        card.append(tags);
        card.addEventListener('click',() => {
          libraryScroll = window.scrollY;
          editor(note,false,card);
        });
        grid.append(card);
      }
      empty.hidden = grid.children.length !== 0;
    };
    search.value = query;
    search.addEventListener('input', () => { query = search.value; renderCards(); });
    renderCards();
    announce(notes.length + ' notes in this sample.');
    const card = returnId && panel.querySelector('[data-note-id="' + returnId + '"]');
    if (returnId && libraryScroll !== null) window.scrollTo({top:libraryScroll,behavior:'instant'});
    if (returnId) (card || search).focus({preventScroll:true});
    if (animate) motion?.returnNote(card,origin);
  };
  const editor = (note, isNew = false, card) => {
    const origin = {card:motion?.capture(card),title:motion?.capture(card?.querySelector('.sample-card-title'),true)};
    motion?.finish(panel);
    panel.classList.add('is-editing');
    panel.innerHTML = '<div class="sample-note-surface" aria-hidden="true"></div><div class="sample-editor-heading"><button type="button" class="sample-back">← Library</button></div><label class="sample-title-label"><span class="sr-only">Sample note title</span><input class="sample-title" maxlength="100" aria-label="Sample note title" placeholder="Untitled note"></label><div class="sample-editor-content"><div class="sample-tag-list" aria-label="Note tags"></div><form class="sample-tag-form"><label class="sr-only" for="sample-tag-input">New tag</label><input id="sample-tag-input" maxlength="24" placeholder="Add a tag" autocomplete="off"><button type="submit">Add tag</button><span class="sample-tag-message" role="status"></span></form><div class="sample-editor-tools" role="group" aria-label="Sample note view"><button type="button" data-note-mode="write" aria-pressed="true">Write</button><button type="button" data-note-mode="preview" aria-pressed="false">Preview</button><span class="sample-word-count"></span></div><textarea class="sample-note-input" aria-label="Sample note text" maxlength="12000" spellcheck="true"></textarea><div class="sample-note-preview" aria-label="Rendered sample note" tabindex="0" hidden></div></div>';
    const title = panel.querySelector('.sample-title');
    const input = panel.querySelector('textarea');
    const preview = panel.querySelector('.sample-note-preview');
    const wordCount = panel.querySelector('.sample-word-count');
    const tags = panel.querySelector('.sample-tag-list');
    const tagInput = panel.querySelector('#sample-tag-input');
    const tagMessage = panel.querySelector('.sample-tag-message');
    title.value = note.title;
    input.value = note.body;
    const updateCount = () => { wordCount.textContent = countWords(note.body) + ' words'; };
    title.addEventListener('input', () => { note.title = title.value; });
    input.addEventListener('input', () => { note.body = input.value; updateCount(); });
    panel.querySelector('.sample-back').addEventListener('click',() => library(note.id));
    const renderTags = () => {
      tags.replaceChildren();
      note.tags.forEach(tag => {
        const button = element('button','sample-tag',tag + ' ×');
        button.type = 'button';
        button.setAttribute('aria-label','Remove tag ' + tag);
        button.addEventListener('click', () => {
          note.tags = note.tags.filter(value => value !== tag);
          renderTags();
          tagInput.focus({preventScroll:true});
          announce('Removed tag ' + tag + '.');
        });
        tags.append(button);
      });
    };
    panel.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const tag = tagInput.value.trim();
      if (!tag) { tagMessage.textContent = 'Enter a tag first.'; return; }
      if (note.tags.some(value => value.toLocaleLowerCase() === tag.toLocaleLowerCase())) { tagMessage.textContent = 'That tag is already here.'; return; }
      if (note.tags.length >= 8) { tagMessage.textContent = 'This sample allows eight tags per note.'; return; }
      note.tags.push(tag);
      renderTags();
      tagInput.value = '';
      tagMessage.textContent = '';
      tagInput.focus({preventScroll:true});
      announce('Added tag ' + tag + '.');
      motion?.press(tags.lastElementChild);
    });
    const renderPreview = () => {
      preview.replaceChildren();
      note.body.split('\n').forEach((line,index) => {
        const heading = /^(#{1,3})\s+(.+)$/.exec(line);
        const task = /^- \[([ xX])\] (.*)$/.exec(line);
        if (heading) preview.append(element('h' + heading[1].length,'',heading[2]));
        else if (task) {
          const row = element('label','sample-task');
          const checkbox = element('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task[1].toLowerCase() === 'x';
          checkbox.addEventListener('change', () => {
            const lines = note.body.split('\n');
            lines[index] = '- [' + (checkbox.checked ? 'x' : ' ') + '] ' + task[2];
            note.body = lines.join('\n');
            input.value = note.body;
            announce(checkbox.checked ? 'Task checked.' : 'Task unchecked.');
          });
          row.append(checkbox,element('span','',task[2]));
          preview.append(row);
        } else if (line.trim()) preview.append(element('p','',line));
        else preview.append(element('div','sample-paragraph-break'));
      });
      if (!note.body.trim()) preview.append(element('p','sample-placeholder','Nothing here yet. Switch to Write and add a line.'));
    };
    panel.querySelectorAll('[data-note-mode]').forEach(button => {
      button.addEventListener('click', () => {
        const showPreview = button.dataset.noteMode === 'preview';
        if (showPreview === !preview.hidden) return;
        panel.querySelectorAll('[data-note-mode]').forEach(option => option.setAttribute('aria-pressed',String(option === button)));
        if (showPreview) renderPreview();
        input.hidden = showPreview;
        preview.hidden = !showPreview;
        motion?.enter(showPreview ? preview : input,showPreview ? 1 : -1);
        announce(showPreview ? 'Preview shows headings and working checklists.' : 'Write with plain text, headings and checklists.');
      });
    });
    renderTags();
    updateCount();
    const top = panel.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * .65) {
      window.scrollTo({top:window.scrollY + top - 24,behavior:'instant'});
      origin.card = origin.title = null;
    }
    motion?.openNote(panel,origin,isNew);
    if (isNew) title.focus({preventScroll:true});
    else panel.querySelector('.sample-back').focus({preventScroll:true});
    announce(isNew ? 'New note. Give it a title and try a line.' : 'Opened ' + (note.title.trim() || 'Untitled note') + '. You can edit this sample.');
  };
  createButton.addEventListener('click', () => {
    if (notes.length >= 20) { announce('This sample holds twenty notes. Reload to start again.'); return; }
    if (!panel.classList.contains('is-editing')) libraryScroll = window.scrollY;
    const note = {id:nextId++,title:'',body:'',tags:[]};
    notes.unshift(note);
    query = '';
    editor(note,true);
  });
  library(undefined,false);
  app.hidden = false;
  app.closest('section').querySelector('.demo-fallback').hidden = true;
})();
