// Main game logic; starts directly in game view
const FILE = 'CLUES (3).JSON';

// Elements
const welcome = document.getElementById('welcome'); // may be null (welcome removed)
const game = document.getElementById('game');
const gridEl = document.getElementById('grid');
const clueHeaderEl = document.getElementById('clueHeader');
const clueTextEl = document.getElementById('clueText');
const puzzleSelect = document.getElementById('puzzleSelect');
const puzzleDate = document.getElementById('puzzleDate');
const mobileInput = document.getElementById('mobileInput');
const mobileKeyboard = document.getElementById('mobileKeyboard');

// Top menu removed
const topMenuWrap = document.getElementById('topMenuWrap');
const btnMenu = document.getElementById('btnMenu');
const menuPanel = document.getElementById('menuPanel');
const menuHelp = document.getElementById('menuHelp');
const menuRestart = document.getElementById('menuRestart');
const hintDropdown = document.getElementById('hintDropdown');

// Help + Hints
const btnHelp = document.getElementById('btnHelp'); // was on welcome; may be null
const btnHelpGame = document.getElementById('btnHelpGame'); // may be null
const btnHelpBottom = document.getElementById('btnHelpBottom');
const helpModal = document.getElementById('helpModal');
const helpClose = document.getElementById('helpClose');

const btnHints = document.getElementById('btnHints');
const hintMenu = document.getElementById('hintMenu');
const btnHintDef = document.getElementById('hintDef');
const btnHintLetter = document.getElementById('hintLetter');
const btnHintAnalyse = document.getElementById('hintWordplay');

const btnBack = document.getElementById('btnBack');

// Additional controls
const btnGiveUp = document.getElementById('btnGiveUp');

// Share modal elements
const shareModal = document.getElementById('shareModal');
const shareClose = document.getElementById('shareClose');
const shareGrid = document.getElementById('shareGrid');
const btnCopyResult = document.getElementById('copyResult');
const copyToast = document.getElementById('copyToast');

const mobileBehaviours = createMobileBehaviours();

let puzzle = null;
let grid = [];
let cellMap = new Map();
let entries = [];
let currentEntry = null;
let activeCellKey = null;
let lastClickedCellKey = null;
const dirToggle = new Map();
let puzzleFinished = false;
let puzzles = [];
let currentPuzzleIndex = 0;
let activeTooltipTarget = null;
let clueTooltipEl = null;
let tooltipHandlersBound = false;
let hintPromptEl = null;
let hintPromptTimeout = null;
let hintPromptDismissHandler = null;
let hintPromptShown = false;

const TIP = {
  acrostic: 'Take first letters.',
  hidden: 'Look within the fodder.',
  anagram: 'Shuffle the letters.',
  deletion: 'Remove letters.',
  charade: 'Build from parts.',
  lit: 'Whole clue is both definition and wordplay.',
  container: 'Put one thing inside another.',
  reversal: 'Read the letters the other way.',
  homophone: 'Sounds like another word.',
  double: 'Two straight definitions.',
  spoonerism: 'Swap the starting sounds.',
  substitution: 'Swap one letter for another.',
  selection: 'Pick specific letters.'
};

const GRID_TEMPLATE = {
  rows: 5,
  cols: 5,
  blocks: [[1, 1], [1, 3], [3, 1], [3, 3]],
  numbers: {
    all: [[0, 0, '1'], [0, 2, '2'], [0, 4, '3'], [2, 0, '2'], [4, 0, '3']]
  }
};

const POSITION_MAP = {
  '1A': { id: '1A', direction: 'across', row: 0, col: 0 },
  '2A': { id: '2A', direction: 'across', row: 2, col: 0 },
  '3A': { id: '3A', direction: 'across', row: 4, col: 0 },
  '1D': { id: '1D', direction: 'down', row: 0, col: 0 },
  '2D': { id: '2D', direction: 'down', row: 0, col: 2 },
  '3D': { id: '3D', direction: 'down', row: 0, col: 4 }
};

const POSITION_ORDER = ['1A', '2A', '3A', '1D', '2D', '3D'];

// Mapping from clue numbers to their highlight colours. Both the across and
// down clues with the same number share a colour.
const NUMBER_COLOURS = { '1': 'green', '2': 'yellow', '3': 'purple' };

// Actual colour values used when rendering the grid.  These are fairly light so
// that the black text remains legible over them.
const BASE_COLOUR_VALUES = {
  // Use slightly more vibrant shades so solved clues stand out.
  green: '#7be87b',
  yellow: '#ffe74d',
  purple: '#c99cff'
};
const HINT_COLOUR_VALUE = BASE_COLOUR_VALUES.green;
// Temporary highlight colour for other cells in the active entry
const ACTIVE_ENTRY_BG = '#3c3c3c';

function key(r,c){ return `${r},${c}`; }

function isMobileTouchActive(){
  return document.body.classList.contains('mobile-touch');
}

// ----- Grid build -----
function buildGrid(){
  const { rows, cols, blocks = [], numbers = {} } = puzzle.grid;
  const blockSet = new Set(blocks.map(([r,c]) => key(r,c)));
  gridEl.innerHTML = '';
  grid = [];
  cellMap.clear();

  for (let r=0;r<rows;r++){
    const rowArr = [];
    for (let c=0;c<cols;c++){
      const k = key(r,c);
      const cell = {
        r,c,
        block:blockSet.has(k),
        letter:'',
        // baseColour: "none" until a clue covering this cell is solved.
        baseColour: 'none',
        // isGrey marks whether a hint highlight has touched this cell.
        isGrey: false,

        // locked letters cannot be overwritten once the clue is solved.
        locked: false,
        entries:[],
        el:document.createElement('div'),
        nums:[]
      };
      cell.el.className = 'cell' + (cell.block ? ' block' : '');
      cell.el.setAttribute('role','gridcell');
      if (!cell.block) cell.el.addEventListener('click', () => handleCellClick(k));
      gridEl.appendChild(cell.el);
      rowArr.push(cell);
      cellMap.set(k, cell);
    }
    grid.push(rowArr);
  }

  // Numbers (if present)
  const all = numbers.all || [];
  all.forEach(([r,c,label]) => {
    const cell = cellMap.get(key(r,c));
    if (!cell || cell.block) return;
    cell.nums.push(String(label));
    const numEl = document.createElement('div');
    numEl.className = 'num';
    numEl.textContent = String(label);
    cell.el.appendChild(numEl);
  });
}

function placeEntries(){
  entries = (puzzle.entries||[]).map(e => ({
    id: e.id,
    direction: e.direction, // 'across'|'down'
    row: e.row,
    col: e.col,
    answer: (e.answer || '').toUpperCase(),
    clue: e.clue,
    enumeration: e.enumeration || null,
    cells: [],
    iActive: 0,
    // Track whether the clue has been solved.
    status: 'unsolved',
    // Remember which hint overlays should be shown when the clue regains focus.
    hintState: {
      definition: false,
      analyse: false
    }
  }));

  entries.forEach(ent => {
    for (let i=0;i<ent.answer.length;i++){
      const r = ent.row + (ent.direction==='down' ? i : 0);
      const c = ent.col + (ent.direction==='across' ? i : 0);
      const cell = cellMap.get(key(r,c));
      if (!cell || cell.block) continue;
      ent.cells.push(cell);
      cell.entries.push(ent);
    }
  });
}

// ----- Events -----
function entryMatchesAnswer(ent){
  if (!ent) return false;
  const guess = ent.cells.map(c => c.letter || '').join('').toUpperCase();
  return guess === String(ent.answer || '').toUpperCase();
}

function isEntrySolved(ent){
  if (!ent) return false;
  return entryMatchesAnswer(ent);
}

// Return the next unsolved entry after the given index, wrapping around.
function findNextUnsolvedEntry(startIdx){
  for (let i = 1; i <= entries.length; i++){
    const ent = entries[(startIdx + i) % entries.length];
    if (!isEntrySolved(ent)) return ent;
  }
  return null;
}

// Return the highlight colour for a given clue id.
function colourForClue(id){
  const num = (id.match(/^\d+/) || [])[0];
  return NUMBER_COLOURS[num] || null;
}

// Called when a clue is solved.  Colours the cells of the clue according to the
// mapping above but never overwrites an existing baseColour.
function onClueSolved(clueId){
  const ent = entries.find(e => e.id === clueId);
  if (!ent || ent.status === 'solved') return;
  ent.status = 'solved';
  const colour = colourForClue(clueId);

  ent.cells.forEach(cell => {
    if (colour && cell.baseColour === 'none') cell.baseColour = colour;
    // lock the cell so its letter cannot be changed
    cell.locked = true;
  });
  renderLetters();
  checkForCompletion();

  if (colour){
    ent.cells.forEach(cell => {
      if (cell.baseColour === 'none') cell.baseColour = colour;
    });
  }
  renderLetters();

  if (!puzzleFinished && currentEntry && currentEntry.id === ent.id){
    const idx = entries.indexOf(ent);
    const next = findNextUnsolvedEntry(idx);
    if (next) setCurrentEntry(next);
  }

}

// Called when a hint is used on a clue.  For non reveal-letter hints we simply
// highlight a random cell.  For reveal-letter hints we also fill in the correct
// letter for one not-yet-correct cell.
function onHintUsed(clueId, type){
  const ent = entries.find(e => e.id === clueId);

  if (!ent || ent.status === 'solved') return;

  if (!ent) return;

  if (!hintPromptShown && type === 'analyse'){
    const hasInteractiveTips = !!(ent.clue && Array.isArray(ent.clue.segments) && ent.clue.segments.some(seg => seg && (seg.tooltip || (seg.category && TIP[seg.category]))));
    if (hasInteractiveTips){
      showHintPrompt();
      hintPromptShown = true;
    }
  }


  if (type === 'reveal-letter'){
    const candidates = ent.cells
      .map((c,i) => ({ cell:c, idx:i }))
      .filter(({cell, idx}) => (cell.letter || '').toUpperCase() !== ent.answer[idx]);
    if (!candidates.length) return;
    const { cell, idx } = candidates[Math.floor(Math.random()*candidates.length)];
    cell.letter = ent.answer[idx];
    cell.isGrey = true;
    ent.iActive = idx;
    activeCellKey = key(cell.r, cell.c);

    // Check both this entry and any crossing entry in case the revealed
    // letter completes another clue.
    cell.entries.forEach(checkIfSolved);

  } else {
    const candidates = ent.cells.filter(c => !c.isGrey);
    const cell = (candidates.length
      ? candidates[Math.floor(Math.random()*candidates.length)]
      : ent.cells[Math.floor(Math.random()*ent.cells.length)]);
    cell.isGrey = true;

    // Highlighting doesn't change letters, but the clue might already be correct.
    checkIfSolved(ent);
  }
  renderLetters();
}

function checkIfSolved(ent){
  if (!ent || ent.status === 'solved') return;
  if (entryMatchesAnswer(ent)) onClueSolved(ent.id);
}

// Check whether every cell matches its answer; if so, trigger completion.
function checkForCompletion(){
  if (puzzleFinished) return;
  const done = entries.every(ent =>
    ent.cells.every((cell, idx) => (cell.letter || '').toUpperCase() === ent.answer[idx])
  );
  if (done){
    puzzleFinished = true;
    onPuzzleComplete();
  }
}

function onPuzzleComplete(){
  renderSharePreview();
  openShareModal();
  finishGame();
}

// Build the share preview grid shown in the modal
function renderSharePreview(){
  if (!shareGrid || !puzzle) return;
  const { rows, cols } = puzzle.grid;
  shareGrid.innerHTML = '';
  shareGrid.style.gridTemplateColumns = `repeat(${cols},16px)`;
  shareGrid.style.gridTemplateRows = `repeat(${rows},16px)`;
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const cell = grid[r][c];
      const d = document.createElement('div');
      d.className = 'share-cell';
      let bg = '#000';
      if (!cell.block){
        if (cell.isGrey) bg = HINT_COLOUR_VALUE;
        else if (cell.baseColour !== 'none') bg = BASE_COLOUR_VALUES[cell.baseColour];
        else bg = '#fff';
      }
      d.style.background = bg;
      shareGrid.appendChild(d);
    }
  }
}

// Assemble plain-text emoji grid for clipboard sharing
function buildShareText(){
  const { rows, cols } = puzzle.grid;
  const lines = [];
  for (let r=0;r<rows;r++){
    let line = '';
    for (let c=0;c<cols;c++){
      const cell = grid[r][c];
      let emoji = '⬛';
      if (!cell.block){
        if (cell.isGrey) emoji = '⬜';
        else if (cell.baseColour === 'green') emoji = '🟩';
        else if (cell.baseColour === 'yellow') emoji = '🟨';
        else if (cell.baseColour === 'purple') emoji = '🟪';
        else emoji = '⬜';
      }
      line += emoji;
    }
    lines.push(line);
  }
  lines.push('I beat the cryptic crossword! Can you?');
  lines.push('https://cryptic-garden.vercel.app/');
  return lines.join('\n');
}

let lastFocused = null;
function openShareModal(){
  if (!shareModal) return;
  lastFocused = document.activeElement;
  shareModal.hidden = false;
  const focusables = shareModal.querySelectorAll('button, [href]');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const trap = (e) => {
    if (e.key === 'Tab'){
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    } else if (e.key === 'Escape'){ closeShareModal(); }
  };
  shareModal.addEventListener('keydown', trap);
  shareModal._trap = trap;
  (first || shareModal).focus();
}

function closeShareModal(){
  if (!shareModal) return;
  shareModal.hidden = true;
  if (shareModal._trap) shareModal.removeEventListener('keydown', shareModal._trap);
  if (lastFocused) lastFocused.focus();

  renderLetters();
}

function ensureClueTooltip(){
  if (clueTooltipEl) return clueTooltipEl;
  const el = document.createElement('div');
  el.className = 'clue-tooltip';
  el.setAttribute('role', 'tooltip');
  el.hidden = true;
  document.body.appendChild(el);
  clueTooltipEl = el;
  return el;
}

function hideClueTooltip(){
  const el = clueTooltipEl;
  if (!el) return;
  el.hidden = true;
  activeTooltipTarget = null;
}

function ensureHintPrompt(){
  if (hintPromptEl) return hintPromptEl;
  const el = document.createElement('div');
  el.className = 'toast hint-toast';
  el.id = 'hintPrompt';
  el.hidden = true;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  hintPromptEl = el;
  return el;
}

function hideHintPrompt(){
  if (!hintPromptEl) return;
  hintPromptEl.hidden = true;
  hintPromptEl.classList.remove('mobile-grid-overlay');
  hintPromptEl.style.removeProperty('top');
  hintPromptEl.style.removeProperty('left');
  hintPromptEl.style.removeProperty('bottom');
  hintPromptEl.style.removeProperty('transform');
  hintPromptEl.style.removeProperty('max-width');
  if (hintPromptTimeout){
    clearTimeout(hintPromptTimeout);
    hintPromptTimeout = null;
  }
  if (hintPromptDismissHandler){
    document.removeEventListener('pointerdown', hintPromptDismissHandler, true);
    hintPromptDismissHandler = null;
  }
  window.removeEventListener('resize', positionHintPrompt);
  window.removeEventListener('scroll', positionHintPrompt, true);
}

function positionHintPrompt(){
  if (!hintPromptEl || hintPromptEl.hidden) return;
  if (!isMobileTouchActive()){
    hintPromptEl.style.left = '50%';
    hintPromptEl.style.bottom = '3.5rem';
    hintPromptEl.style.removeProperty('top');
    hintPromptEl.style.transform = 'translateX(-50%)';
    hintPromptEl.style.removeProperty('max-width');
    return;
  }
  if (!gridEl) return;
  const rect = gridEl.getBoundingClientRect();
  const width = Math.max(0, rect.width);
  const left = (width ? rect.left + width / 2 : window.innerWidth / 2);
  const promptHeight = hintPromptEl.offsetHeight || 0;
  const availableTop = Math.max(16, rect.top + 16);
  const maxTop = Math.max(16, window.innerHeight - promptHeight - 16);
  const top = Math.min(maxTop, availableTop);
  const maxWidth = Math.max(180, Math.min(width - 24, window.innerWidth - 32, 360));
  hintPromptEl.style.top = `${top}px`;
  hintPromptEl.style.left = `${left}px`;
  hintPromptEl.style.bottom = 'auto';
  hintPromptEl.style.transform = 'translateX(-50%)';
  hintPromptEl.style.maxWidth = `${maxWidth}px`;
}

function showHintPrompt(){
  const el = ensureHintPrompt();
  el.textContent = 'Click/tap on the highlighted words to see your hints';
  el.hidden = false;
  if (isMobileTouchActive()){
    el.classList.add('mobile-grid-overlay');
    requestAnimationFrame(() => {
      positionHintPrompt();
    });
    if (!hintPromptDismissHandler){
      hintPromptDismissHandler = () => {
        hideHintPrompt();
      };
      document.addEventListener('pointerdown', hintPromptDismissHandler, true);
    }
    window.addEventListener('resize', positionHintPrompt);
    window.addEventListener('scroll', positionHintPrompt, true);
  } else {
    el.classList.remove('mobile-grid-overlay');
    positionHintPrompt();
  }
  if (hintPromptTimeout) clearTimeout(hintPromptTimeout);
  hintPromptTimeout = setTimeout(() => {
    hideHintPrompt();
  }, 5000);
}

function resetHintPrompt(){
  hintPromptShown = false;
  hideHintPrompt();
}

function positionClueTooltip(target){
  if (!target) return;
  if (!document.body.contains(target)){
    hideClueTooltip();
    return;
  }
  const tooltip = ensureClueTooltip();
  const text = target.getAttribute('data-tooltip');
  if (!text){
    hideClueTooltip();
    return;
  }
  tooltip.textContent = text;
  tooltip.hidden = false;
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';
  tooltip.style.maxWidth = `${Math.min(320, Math.max(0, window.innerWidth - 32))}px`;

  const rect = target.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const desiredLeft = rect.left + (rect.width / 2) - (tipRect.width / 2);
  const clampedLeft = Math.max(16, Math.min(window.innerWidth - tipRect.width - 16, desiredLeft));
  const desiredTop = rect.bottom + 8;
  const clampedTop = Math.max(16, Math.min(window.innerHeight - tipRect.height - 16, desiredTop));

  tooltip.style.left = `${clampedLeft}px`;
  tooltip.style.top = `${clampedTop}px`;
}

function applyHintClasses(ent){
  if (!clueTextEl) return;
  const state = (ent && ent.hintState) || {};
  clueTextEl.className = 'clue';
  clueTextEl.classList.toggle('help-on', !!state.definition);
  clueTextEl.classList.toggle('annot-on', !!state.analyse);
  if (!state.analyse) hideClueTooltip();
}

function setupTooltipHandlers(){
  if (!clueTextEl || tooltipHandlersBound) return;
  tooltipHandlersBound = true;

  const findTooltipTarget = (eventTarget) => {
    if (!clueTextEl.classList.contains('annot-on')) return null;
    const candidate = eventTarget && eventTarget.closest('[data-tooltip]');
    if (!candidate) return null;
    if (!clueTextEl.contains(candidate)) return null;
    const tipText = candidate.getAttribute('data-tooltip');
    return tipText ? candidate : null;
  };

  const handlePointerOver = (event) => {
    if (isMobileTouchActive()) return;
    const target = findTooltipTarget(event.target);
    if (!target){
      if (activeTooltipTarget) hideClueTooltip();
      return;
    }
    activeTooltipTarget = target;
    positionClueTooltip(target);
  };

  const handlePointerOut = (event) => {
    if (isMobileTouchActive()) return;
    if (!activeTooltipTarget) return;
    if (event.relatedTarget && activeTooltipTarget.contains(event.relatedTarget)) return;
    if (event.relatedTarget && event.relatedTarget.closest('[data-tooltip]') === activeTooltipTarget) return;
    hideClueTooltip();
  };

  const handlePointerDown = (event) => {
    const target = findTooltipTarget(event.target);
    if (target){
      if (isMobileTouchActive() && activeTooltipTarget === target){
        hideClueTooltip();
        return;
      }
      activeTooltipTarget = target;
      positionClueTooltip(target);
    }
  };

  const handlePointerCancel = () => {
    if (isMobileTouchActive()) return;
    hideClueTooltip();
  };

  const handleScroll = () => {
    if (!activeTooltipTarget) return;
    if (!document.body.contains(activeTooltipTarget)){ hideClueTooltip(); return; }
    positionClueTooltip(activeTooltipTarget);
  };

  clueTextEl.addEventListener('pointerover', handlePointerOver);
  clueTextEl.addEventListener('pointerout', handlePointerOut);
  clueTextEl.addEventListener('pointerdown', handlePointerDown);
  clueTextEl.addEventListener('pointercancel', handlePointerCancel);
  clueTextEl.addEventListener('pointerleave', handlePointerCancel);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll);
  document.addEventListener('pointerdown', (event) => {
    if (!activeTooltipTarget) return;
    if (clueTextEl.contains(event.target)) return;
    hideClueTooltip();
  });
}

function renderClue(ent){
  hideClueTooltip();
  const segs = (ent.clue && ent.clue.segments) || [];
  const surface = (ent.clue && ent.clue.surface) || '';
  let html = buildClueMarkup(surface, segs);
  if (!html) html = escapeHtml(surface);
  const enumeration = ent.enumeration || (ent.answer ? String(ent.answer.length) : '');
  if (enumeration) {
    html += ` (<span class="enumeration">${escapeHtml(enumeration)}</span>)`;
  }
  const dirLabel = ent.direction[0].toUpperCase() + ent.direction.slice(1);
  const num = ent.id.match(/^\d+/)[0];
  clueHeaderEl.textContent = `${num} ${dirLabel}`;  // “1 Across” / “1 Down”
  clueTextEl.innerHTML = html;
  applyHintClasses(ent);
}

function renderLetters(){
  grid.flat().forEach(cell => {
    [...cell.el.childNodes].forEach(n => {
      if (n.nodeType === 1 && n.classList.contains('num')) return;
      cell.el.removeChild(n);
    });
    cell.el.classList.remove('active');
    if (cell.block) return;

    // Apply colouring rules.  Hint overlay takes precedence over baseColour.
    let bg = '#fff';
    if (cell.isGrey) bg = HINT_COLOUR_VALUE;
    else if (cell.baseColour !== 'none') bg = BASE_COLOUR_VALUES[cell.baseColour];
    cell.el.style.background = bg;
    cell.el.style.color = '#000'; // keep text legible over hint colour
  });

  grid.flat().forEach(cell => {
    if (cell.letter) {
      const d = document.createElement('div');
      d.className = 'letter';
      d.style.display = 'grid';
      d.style.placeItems = 'center';
      d.style.width = '100%';
      d.style.height = '100%';
      d.style.fontWeight = '700';
      d.textContent = cell.letter;
      cell.el.appendChild(d);
    }
  });
  highlightActive();
}

function setCurrentEntry(ent, fromCellKey=null){
  currentEntry = ent;
  if (!ent){
    hideClueTooltip();
    mobileBehaviours.onEntryCleared();
    return;
  }
  renderClue(ent);
  if (fromCellKey){
    const i = ent.cells.findIndex(c => key(c.r,c.c)===fromCellKey);
    ent.iActive = (i>=0 ? i : 0);
  } else if (ent.iActive==null){
    ent.iActive = 0;
  }
  if (ent.cells[ent.iActive].locked) {
    nextCell(+1) || nextCell(-1);
  }
  const cell = ent.cells[ent.iActive];
  activeCellKey = key(cell.r,cell.c);
  renderLetters();
  mobileBehaviours.onEntryFocus();
}

function highlightActive(){
  if (!currentEntry) return;
  const active = currentEntry.cells[currentEntry.iActive];
  currentEntry.cells.forEach(c => {
    if (c !== active) c.el.style.background = ACTIVE_ENTRY_BG;
  });
  if (active) active.el.classList.add('active');
}

function handleCellClick(k){
  const cell = cellMap.get(k);
  if (!cell || cell.block) return;
  const belongs = cell.entries || [];
  if (!belongs.length) return;

  let pref = dirToggle.get(k) || 'across';
  if (lastClickedCellKey === k) pref = pref==='across' ? 'down' : 'across';
  lastClickedCellKey = k;

  let ent = belongs.find(e => e.direction===pref) || belongs[0];

  if (ent && isEntrySolved(ent)){
    const alternative = belongs.find(e => !isEntrySolved(e));
    if (alternative) ent = alternative;
  }

  if (!ent) return;

  if (isEntrySolved(ent)){
    mobileBehaviours.hideKeyboard();
    return;
  }

  dirToggle.set(k, ent.direction);
  setCurrentEntry(ent, k);
}

function moveCursor(dx, dy){
  if (activeCellKey == null) return;
  let [r, c] = activeCellKey.split(',').map(Number);
  const rows = grid.length;
  const cols = grid[0].length;
  let nr = r + dy;
  let nc = c + dx;

  // Skip over locked cells so navigation can pass solved clues.
  while (nr >= 0 && nr < rows && nc >= 0 && nc < cols){
    const k = key(nr, nc);
    const cell = cellMap.get(k);
    if (cell && !cell.block && !cell.locked){

      const dir = dx !== 0 ? 'across' : 'down';
      const ent = cell.entries.find(e => e.direction === dir) || cell.entries[0];
      if (ent) setCurrentEntry(ent, k); else { activeCellKey = k; renderLetters(); }
      lastClickedCellKey = k;
      break;
    }
    nr += dy;
    nc += dx;
  }
}

function nextCell(inc){
  if (!currentEntry) return null;
  let i = currentEntry.iActive;
  do {
    i += inc;
  } while (i >= 0 && i < currentEntry.cells.length && currentEntry.cells[i].locked);
  if (i < 0 || i >= currentEntry.cells.length) return null;
  currentEntry.iActive = i;
  const cell = currentEntry.cells[i];
  activeCellKey = key(cell.r,cell.c);
  return cell;
}

function typeChar(ch){
  if (!currentEntry) return;
  let cell = currentEntry.cells[currentEntry.iActive];
  if (cell.locked){
    cell = nextCell(+1);
    if (!cell || cell.locked) return;
  }
  cell.letter = ch.toUpperCase();
  // Check every entry that uses this cell so crossing clues can
  // auto-solve when their final letter is entered.
  cell.entries.forEach(checkIfSolved);
  nextCell(+1);
  renderLetters();
}

function backspace(){
  if (!currentEntry) return;
  let cell = currentEntry.cells[currentEntry.iActive];
  if (cell.locked){
    cell = nextCell(-1);
    if (!cell || cell.locked) return;
  }
  cell.letter = '';
  nextCell(-1);
  renderLetters();
}

function clearCurrentEntry(){
  if (!currentEntry) return;
  if (isEntrySolved(currentEntry)){
    mobileBehaviours.hideKeyboard();
    return;
  }

  let cleared = false;
  currentEntry.cells.forEach((cell) => {
    if (cell.locked) return;
    if (cell.letter){
      cell.letter = '';
      cleared = true;
    }
  });

  if (!cleared) {
    mobileBehaviours.onEntryFocus();
    return;
  }

  let focusIndex = currentEntry.cells.findIndex(cell => !cell.locked);
  if (focusIndex === -1) focusIndex = 0;
  currentEntry.iActive = focusIndex;
  const first = currentEntry.cells[currentEntry.iActive];
  if (first) activeCellKey = key(first.r, first.c);

  currentEntry.cells.forEach(cell => cell.entries.forEach(checkIfSolved));
  renderLetters();
  mobileBehaviours.onEntryFocus();
}

function submitAnswer(){
  if (!currentEntry) return;
  const guess = currentEntry.cells.map(c => c.letter||' ').join('').toUpperCase();
  const target = currentEntry.answer.toUpperCase();
  if (guess === target){
    onClueSolved(currentEntry.id);
    game.classList.add('flash-green');
    setTimeout(() => {
      game.classList.remove('flash-green');
    }, 650);
    } else {
      game.classList.add('flash-red');
      setTimeout(() => game.classList.remove('flash-red'), 450);
    }
}

function finishGame(){
  var fireworks = document.getElementById('fireworks');
  if (fireworks) fireworks.classList.add('on');
}

function closeHintDropdown(){
  if (hintDropdown) hintDropdown.classList.remove('open');
  if (btnHints) btnHints.setAttribute('aria-expanded', 'false');
  if (hintMenu) hintMenu.setAttribute('aria-hidden', 'true');
  mobileBehaviours.onHintMenuClosed();
}

// ----- Help & hints & misc -----
function setupHandlers(){
  if (puzzleSelect) puzzleSelect.addEventListener('change', () => {
    const value = puzzleSelect.value;
    const idx = Number(value);
    if (value === '' || Number.isNaN(idx) || !puzzles[idx]) return;
    loadPuzzleByIndex(idx);
  });

  // Help modal open/close
  const openHelp = () => { helpModal.hidden = false; };
  const closeHelp = () => { helpModal.hidden = true; };
  if (btnHelp) btnHelp.addEventListener('click', openHelp);
  if (btnHelpGame) btnHelpGame.addEventListener('click', openHelp);
  if (btnHelpBottom) btnHelpBottom.addEventListener('click', openHelp);
  if (helpClose) helpClose.addEventListener('click', closeHelp);

  // Hints dropdown
  if (btnHints) btnHints.addEventListener('click', () => {
    const expanded = btnHints.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeHintDropdown();
    } else {
      btnHints.setAttribute('aria-expanded', 'true');
      if (hintMenu) hintMenu.setAttribute('aria-hidden', 'false');
      if (hintDropdown) hintDropdown.classList.add('open');
      mobileBehaviours.onHintMenuOpened();
    }
  });
  if (btnHintDef) btnHintDef.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    const nextState = !currentEntry.hintState.definition;
    currentEntry.hintState.definition = nextState;
    applyHintClasses(currentEntry);
    if (nextState) onHintUsed(currentEntry.id, 'definition');
    closeHintDropdown();
    mobileBehaviours.onHintSelected();
  });
  if (btnHintLetter) btnHintLetter.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    onHintUsed(currentEntry.id, 'reveal-letter');
    closeHintDropdown();
    mobileBehaviours.onHintSelected();
  });
  if (btnHintAnalyse) btnHintAnalyse.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    const nextState = !currentEntry.hintState.analyse;
    currentEntry.hintState.analyse = nextState;
    applyHintClasses(currentEntry);
    if (nextState) onHintUsed(currentEntry.id, 'analyse');
    closeHintDropdown();
    mobileBehaviours.onHintSelected();
  });

  // Top Menu dropdown — removed; guards keep this safe if elements don't exist
  if (btnMenu) btnMenu.addEventListener('click', () => {
    const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
    btnMenu.setAttribute('aria-expanded', String(!expanded));
    if (menuPanel) menuPanel.setAttribute('aria-hidden', String(expanded));
    if (topMenuWrap){
      if (expanded) topMenuWrap.classList.remove('open'); else topMenuWrap.classList.add('open');
    }
  });
  if (menuHelp) menuHelp.addEventListener('click', () => {
    if (helpModal) helpModal.hidden = false;
  });
  if (menuRestart) menuRestart.addEventListener('click', () => {
    restartGame();
    if (btnMenu) btnMenu.setAttribute('aria-expanded','false');
    if (menuPanel) menuPanel.setAttribute('aria-hidden','true');
    if (topMenuWrap) topMenuWrap.classList.remove('open');
  });

  // Reveal answer: fill the current entry with the correct letters and mark it as solved
  if (btnGiveUp) btnGiveUp.addEventListener('click', () => {
    if (!currentEntry) return;
    currentEntry.cells.forEach((cell, idx) => {
      cell.letter = currentEntry.answer[idx];
      // Highlight entire answer when revealed
      cell.isGrey = true;
    });
    // After revealing, re-check all affected clues.
    currentEntry.cells.forEach(cell => cell.entries.forEach(checkIfSolved));
    renderLetters();
    submitAnswer();
  });

  // Share modal handlers
  if (shareClose) shareClose.addEventListener('click', closeShareModal);
  if (btnCopyResult) btnCopyResult.addEventListener('click', () => {
    const text = buildShareText();
    navigator.clipboard.writeText(text).then(() => {
      if (copyToast){
        copyToast.hidden = false;
        setTimeout(() => { copyToast.hidden = true; }, 1500);
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const t = e.target;
    // Hints
    if (hintDropdown && !hintDropdown.contains(t)){
      if (hintDropdown.classList.contains('open')){
        closeHintDropdown();
      }
    }
    // Top menu
    if (topMenuWrap && !topMenuWrap.contains(t)){
      if (topMenuWrap.classList.contains('open')){
        topMenuWrap.classList.remove('open');
        if (btnMenu) btnMenu.setAttribute('aria-expanded','false');
        if (menuPanel) menuPanel.setAttribute('aria-hidden','true');
      }
    }
  });

  // Back (welcome removed) — guard
  if (btnBack) btnBack.addEventListener('click', () => {
    if (game) game.hidden = true;
    if (welcome) welcome.hidden = false;
  });

  // Typing
  if (mobileInput) mobileInput.addEventListener('input', e => {
    const char = e.data || e.target.value;
    if (/^[a-zA-Z]$/.test(char)) typeChar(char);
    e.target.value = '';
  });
  document.addEventListener('keydown', e => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      // If the hidden mobile input is focused, its own input listener
      // already handled this character. Avoid duplicating it.
      if (e.target !== mobileInput) typeChar(e.key);
    } else if (e.key === 'Backspace'){ e.preventDefault(); backspace(); }
    else if (e.key === 'Enter'){ submitAnswer(); }
    else if (e.key === 'ArrowLeft'){ e.preventDefault(); moveCursor(-1,0); }
    else if (e.key === 'ArrowRight'){ e.preventDefault(); moveCursor(1,0); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); moveCursor(0,-1); }
    else if (e.key === 'ArrowDown'){ e.preventDefault(); moveCursor(0,1); }
  });
}
function focusFirstCell(){
  const start = key(0,0);
  const cell = cellMap.get(start);
  if (cell && !cell.block){
    handleCellClick(start);
  } else if (entries[0]){
    setCurrentEntry(entries[0]);
  }
}

function restartGame(){
  entries.forEach(ent => {
    ent.status = 'unsolved';
    ent.cells.forEach(c => {
      c.letter = '';
      c.baseColour = 'none';
      c.isGrey = false;

      c.locked = false;
    });
    if (ent.hintState){
      ent.hintState.definition = false;
      ent.hintState.analyse = false;
    }
  });
  puzzleFinished = false;
  if (shareModal) shareModal.hidden = true;
  if (copyToast) copyToast.hidden = true;
  const fireworks = document.getElementById('fireworks');
  if (fireworks) fireworks.classList.remove('on');

  if (clueTextEl) clueTextEl.classList.remove('help-on', 'annot-on');
  hideClueTooltip();
  resetHintPrompt();

  focusFirstCell();
  renderLetters();
}

function escapeHtml(s=''){
  return String(s).replace(/[&<>"']/g, m => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));
}

function buildClueMarkup(surface='', segments=[]){
  const text = surface || '';
  if (!text) return '';
  if (!Array.isArray(segments) || !segments.length) return escapeHtml(text);

  const lower = text.toLowerCase();
  const taken = Array(text.length).fill(false);
  const matches = [];

  segments.forEach((seg, idx) => {
    const segText = seg && seg.text ? String(seg.text).trim() : '';
    if (!segText) return;
    const segLower = segText.toLowerCase();
    let start = lower.indexOf(segLower);
    while (start !== -1){
      let free = true;
      for (let i = start; i < start + segLower.length; i++){
        if (taken[i]) { free = false; break; }
      }
      if (free){
        matches.push({ start, end: start + segLower.length, seg, order: idx });
        for (let i = start; i < start + segLower.length; i++) taken[i] = true;
        break;
      }
      start = lower.indexOf(segLower, start + 1);
    }
  });

  if (!matches.length) return escapeHtml(text);

  matches.sort((a,b) => (a.start - b.start) || (a.order - b.order));

  let html = '';
  let cursor = 0;
  matches.forEach(match => {
    if (cursor < match.start){
      html += escapeHtml(text.slice(cursor, match.start));
    }
    const seg = match.seg || {};
    const cls = seg.type === 'definition' ? 'def' : seg.type;
    const tip = seg.tooltip || (seg.category && TIP[seg.category]) || '';
    const segmentText = text.slice(match.start, match.end);
    const classNames = [cls];
    let tooltipAttr = '';
    if (tip){
      classNames.push('has-tip');
      if (seg.tipNumber != null) classNames.push(`tip-${seg.tipNumber}`);
      tooltipAttr = ` data-tooltip="${escapeHtml(tip)}"`;
    }
    html += `<span class="${classNames.join(' ')}"${tooltipAttr}>${escapeHtml(segmentText)}</span>`;
    cursor = match.end;
  });
  if (cursor < text.length){
    html += escapeHtml(text.slice(cursor));
  }
  return html;
}

function cloneGridTemplate(){
  return {
    rows: GRID_TEMPLATE.rows,
    cols: GRID_TEMPLATE.cols,
    blocks: GRID_TEMPLATE.blocks.map(pair => pair.slice()),
    numbers: {
      all: GRID_TEMPLATE.numbers.all.map(item => item.slice())
    }
  };
}

function extractClueParts(raw){
  if (raw == null) return { surface: '', enumeration: null };
  let surface = String(raw);
  let enumeration = null;
  const match = surface.match(/\s*\(([\d,\-– ]+)\)\s*$/);
  if (match){
    enumeration = match[1].replace(/\s+/g, '');
    surface = surface.slice(0, match.index);
  }
  return { surface: surface.trim(), enumeration };
}

function interpretSegmentType(raw){
  const lower = String(raw || '').trim().toLowerCase();
  if (!lower) return { type: 'indicator', category: null };
  if (lower === 'definition') return { type: 'definition', category: null };
  if (lower === 'fodder') return { type: 'fodder', category: null };
  let category = lower;
  if (category.endsWith(' indicator')) category = category.replace(/\s+indicator$/, '');
  if (category === 'letter substitution') category = 'substitution';
  if (category === 'double definition') category = 'double';
  if (category === 'literally') category = 'lit';
  if (category === 'selection indicator') category = 'selection';
  if (!category) category = lower;
  if (category === 'charade'){
    return { type: 'fodder', category };
  }
  return { type: 'indicator', category };
}

function buildSegments(row){
  const segments = [];
  if (!row) return segments;
  for (let i = 1; i <= 6; i++){
    const typeRaw = row[`Tooltip_${i}_type`];
    const suffix = i === 1 ? '' : `.${i-1}`;
    const textRaw = row[`Tooltip_section${suffix}`];
    const tooltipRaw = row[`Tooltip_Text${suffix}`];
    const segText = textRaw ? String(textRaw).trim() : '';
    const tipText = tooltipRaw ? String(tooltipRaw).trim() : '';
    const typeStr = typeRaw ? String(typeRaw).trim() : '';
    if (!typeStr && !segText) continue;
    const { type, category } = interpretSegmentType(typeStr);
    const segment = { type, text: segText };
    if (category) segment.category = category;
    if (tipText) segment.tooltip = tipText;
    segment.tipNumber = i;
    segments.push(segment);
  }
  return segments;
}

function createPuzzleFromRows(key, rows){
  const entries = [];
  rows.forEach(row => {
    const pos = String(row.Position || row.position || '').trim().toUpperCase();
    const layout = POSITION_MAP[pos];
    if (!layout) return;
    const { surface, enumeration } = extractClueParts(row.Clue);
    entries.push({
      id: layout.id,
      direction: layout.direction,
      row: layout.row,
      col: layout.col,
      answer: String(row.Solution || '').toUpperCase(),
      clue: {
        surface,
        segments: buildSegments(row)
      },
      enumeration: enumeration || null
    });
  });

  entries.sort((a,b) => {
    const ai = POSITION_ORDER.indexOf(a.id);
    const bi = POSITION_ORDER.indexOf(b.id);
    if (ai === -1 && bi === -1) return a.id.localeCompare(b.id);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return {
    id: key,
    title: `Crossword ${key}`,
    grid: cloneGridTemplate(),
    entries
  };
}

function parseWorkbook(json){
  if (!json || !Array.isArray(json.sheets) || !json.sheets[0] || !Array.isArray(json.sheets[0].rows)) {
    return [];
  }
  const rows = json.sheets[0].rows;
  const grouped = new Map();
  rows.forEach(row => {
    const keyRaw = row.Crossword ?? row.crossword;
    const key = keyRaw != null ? String(keyRaw).trim() : '';
    if (!key) return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  });
  const keys = [...grouped.keys()].sort((a,b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  });
  return keys.map(key => createPuzzleFromRows(key, grouped.get(key) || []));
}

function populatePuzzleSelect(){
  if (!puzzleSelect) return;
  puzzleSelect.innerHTML = '';
  if (!puzzles.length){
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No crosswords found';
    puzzleSelect.appendChild(option);
    puzzleSelect.disabled = true;
    return;
  }
  puzzles.forEach((p, idx) => {
    const option = document.createElement('option');
    option.value = String(idx);
    option.textContent = p.title || `Crossword ${p.id || idx + 1}`;
    puzzleSelect.appendChild(option);
  });
  puzzleSelect.disabled = puzzles.length <= 1;
  puzzleSelect.value = String(currentPuzzleIndex);
}

function updatePuzzleMeta(){
  if (!puzzleDate) return;
  const current = puzzles[currentPuzzleIndex];
  if (!current){
    puzzleDate.textContent = '';
    return;
  }
  const label = current.title || `Crossword ${current.id || currentPuzzleIndex + 1}`;
  if (puzzles.length > 1){
    puzzleDate.textContent = `${label} (${currentPuzzleIndex + 1}/${puzzles.length})`;
  } else {
    puzzleDate.textContent = label;
  }
}

function loadPuzzleByIndex(idx){
  if (!puzzles[idx]) return;
  currentPuzzleIndex = idx;
  if (puzzleSelect) puzzleSelect.value = String(idx);
  applyPuzzle(puzzles[idx]);
  updatePuzzleMeta();
}

function applyPuzzle(data){
  puzzle = data;
  grid = [];
  cellMap.clear();
  entries = [];
  currentEntry = null;
  activeCellKey = null;
  lastClickedCellKey = null;
  dirToggle.clear();
  puzzleFinished = false;
  if (shareModal) shareModal.hidden = true;
  if (copyToast) copyToast.hidden = true;
  if (shareGrid) shareGrid.innerHTML = '';
  const fireworks = document.getElementById('fireworks');
  if (fireworks) fireworks.classList.remove('on');
  if (clueTextEl) {
    clueTextEl.classList.remove('help-on', 'annot-on');
    clueTextEl.textContent = '';
  }
  if (clueHeaderEl) clueHeaderEl.textContent = '—';
  hideClueTooltip();
  closeHintDropdown();
  resetHintPrompt();

  buildGrid();
  placeEntries();
  focusFirstCell();
  if (mobileInput && !mobileBehaviours.isActive()) mobileInput.focus();
}

function useFallbackPuzzle(){
  puzzles = [{
    id: 'fallback',
    title: 'Fallback Puzzle',
    grid: cloneGridTemplate(),
    entries: [
      { id: '1A', direction: 'across', row: 0, col: 0, answer: 'DISCO', clue: { surface: 'Dance floor genre', segments: [] }, enumeration: '5' },
      { id: '2A', direction: 'across', row: 2, col: 0, answer: 'INANE', clue: { surface: 'Silly or senseless', segments: [] }, enumeration: '5' },
      { id: '3A', direction: 'across', row: 4, col: 0, answer: 'TAROT', clue: { surface: 'Cards for fortunes', segments: [] }, enumeration: '5' },
      { id: '1D', direction: 'down', row: 0, col: 0, answer: 'DRIFT', clue: { surface: 'Move with the tide', segments: [] }, enumeration: '5' },
      { id: '2D', direction: 'down', row: 0, col: 2, answer: 'STAIR', clue: { surface: 'Single step', segments: [] }, enumeration: '5' },
      { id: '3D', direction: 'down', row: 0, col: 4, answer: 'OVERT', clue: { surface: 'Plain to see', segments: [] }, enumeration: '5' }
    ]
  }];
  currentPuzzleIndex = 0;
  populatePuzzleSelect();
  loadPuzzleByIndex(0);
}

function createMobileBehaviours(){
  const noop = {
    isActive: () => false,
    updateState: () => {},
    onEntryFocus: () => {},
    onEntryCleared: () => {},
    onHintMenuOpened: () => {},
    onHintMenuClosed: () => {},
    onHintSelected: () => {},
    hideKeyboard: () => {}
  };
  if (!mobileKeyboard) return noop;

  const widthQuery = window.matchMedia('(max-width: 768px)');
  const pointerQueries = [];
  ['(pointer: coarse)', '(any-pointer: coarse)'].forEach(q => {
    try {
      const mq = window.matchMedia(q);
      if (mq && mq.media !== 'not all') pointerQueries.push(mq);
    } catch (err) {
      // Ignore unsupported media query strings.
    }
  });

  let active = false;
  let keyboardVisible = false;
  let hintMenuOpen = false;
  let keyboardBuilt = false;

  const body = document.body;

  const addMediaListener = (mq, handler) => {
    if (!mq) return;
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler);
    else if (typeof mq.addListener === 'function') mq.addListener(handler);
  };

  const isTouchCapable = () => {
    if (pointerQueries.some(q => q.matches)) return true;
    if ('ontouchstart' in window) return true;
    if (typeof navigator !== 'undefined' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) return true;
    return false;
  };

  const shouldEnable = () => widthQuery.matches && isTouchCapable();

  const syncKeyboardHeight = () => {
    if (!keyboardVisible) return;
    const height = mobileKeyboard.offsetHeight;
    body.style.setProperty('--mobile-keyboard-height', `${height}px`);
  };

  const hideKeyboardInternal = (opts = {}) => {
    if (!keyboardVisible) return;
    keyboardVisible = false;
    mobileKeyboard.classList.remove('visible');
    mobileKeyboard.hidden = true;
    mobileKeyboard.setAttribute('aria-hidden', 'true');
    body.classList.remove('mobile-keyboard-open');
    body.style.removeProperty('--mobile-keyboard-height');
    if (!opts.preserveHintState) hintMenuOpen = false;
  };

  const showKeyboard = () => {
    if (!active || hintMenuOpen) return;
    if (!keyboardBuilt) buildKeyboard();
    if (keyboardVisible){
      syncKeyboardHeight();
      return;
    }
    keyboardVisible = true;
    mobileKeyboard.hidden = false;
    mobileKeyboard.classList.add('visible');
    mobileKeyboard.setAttribute('aria-hidden', 'false');
    body.classList.add('mobile-keyboard-open');
    syncKeyboardHeight();
  };

  const handleKeyboardClick = (e) => {
    const btn = e.target.closest('button[data-key], button[data-action]');
    if (!btn) return;
    e.preventDefault();
    const action = btn.dataset.action;
    if (action === 'delete'){ backspace(); return; }
    if (action === 'clear'){ clearCurrentEntry(); return; }
    if (action === 'close'){ hideKeyboardInternal(); return; }
    const keyVal = btn.dataset.key;
    if (keyVal) typeChar(keyVal);
  };

  const buildKeyboard = () => {
    if (keyboardBuilt) return;
    keyboardBuilt = true;
    mobileKeyboard.innerHTML = '';
    const layout = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ];
    layout.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'mobile-keyboard-row';
      row.forEach(letter => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = letter;
        btn.dataset.key = letter;
        rowEl.appendChild(btn);
      });
      mobileKeyboard.appendChild(rowEl);
    });
    const controls = document.createElement('div');
    controls.className = 'mobile-keyboard-row controls';

    const backspaceBtn = document.createElement('button');
    backspaceBtn.type = 'button';
    backspaceBtn.dataset.action = 'delete';
    backspaceBtn.classList.add('delete-key');
    backspaceBtn.setAttribute('aria-label', 'Backspace');
    backspaceBtn.textContent = '⌫';

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.dataset.action = 'clear';
    clearBtn.classList.add('action-key');
    clearBtn.setAttribute('aria-label', 'Clear current clue');
    clearBtn.textContent = 'Clear';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.dataset.action = 'close';
    closeBtn.classList.add('close-keyboard');
    closeBtn.setAttribute('aria-label', 'Hide keyboard');
    closeBtn.textContent = 'Hide';

    controls.append(backspaceBtn, clearBtn, closeBtn);
    mobileKeyboard.appendChild(controls);

    mobileKeyboard.addEventListener('click', handleKeyboardClick);
  };

  const enable = () => {
    if (active) return;
    active = true;
    body.classList.add('mobile-touch');
    hintMenuOpen = false;
    buildKeyboard();
    if (mobileInput) mobileInput.blur();
    keyboardVisible = false;
    showKeyboard();
    window.addEventListener('resize', syncKeyboardHeight);
  };

  const disable = () => {
    if (!active) return;
    hideKeyboardInternal();
    active = false;
    hintMenuOpen = false;
    body.classList.remove('mobile-touch', 'mobile-keyboard-open');
    body.style.removeProperty('--mobile-keyboard-height');
    window.removeEventListener('resize', syncKeyboardHeight);
  };

  const evaluate = () => {
    if (shouldEnable()) enable(); else disable();
  };

  const orientationHandler = () => {
    setTimeout(() => {
      syncKeyboardHeight();
      evaluate();
      showKeyboard();
    }, 200);
  };

  addMediaListener(widthQuery, evaluate);
  pointerQueries.forEach(q => addMediaListener(q, evaluate));
  window.addEventListener('orientationchange', orientationHandler);

  // Initial state
  evaluate();

  return {
    isActive: () => active,
    updateState: evaluate,
    onEntryFocus: () => { if (active) showKeyboard(); },
    onEntryCleared: () => { if (active && !hintMenuOpen) showKeyboard(); },
    onHintMenuOpened: () => {
      if (!active) return;
      hintMenuOpen = true;
      hideKeyboardInternal({ preserveHintState: true });
    },
    onHintMenuClosed: () => {
      if (!active) return;
      hintMenuOpen = false;
      showKeyboard();
    },
    onHintSelected: () => {
      if (!active) return;
      hintMenuOpen = false;
      showKeyboard();
    },
    hideKeyboard: () => { if (active) hideKeyboardInternal(); }
  };
}

// ----- Boot -----
window.addEventListener('load', () => {
  mobileBehaviours.updateState();
  setupHandlers();
  setupTooltipHandlers();

  fetch(FILE)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load ${FILE}: ${r.status}`);
      return r.json();
    })
    .then(json => {
      puzzles = parseWorkbook(json);
      if (!puzzles.length) throw new Error('No crossword data found in workbook');
      currentPuzzleIndex = 0;
      populatePuzzleSelect();
      loadPuzzleByIndex(0);
    })
    .catch(err => {
      console.error('Failed to load crosswords, using fallback data:', err);
      useFallbackPuzzle();
    });
});
