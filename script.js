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
const hintPanel = document.getElementById('hintPanel');
const hintContent = document.getElementById('hintContent');
const ratingPopup = document.getElementById('ratingPopup');
const ratingStars = ratingPopup ? ratingPopup.querySelectorAll('.rating-star') : [];

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

let ratingHideTimer = null;
let ratingCleanupTimer = null;
const RATING_STORAGE_KEY = 'clueRatings';

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
const GREY_VALUE = '#bbb';
const HINT_GREEN_VALUE = '#1f8a3b';
// Temporary highlight colour for other cells in the active entry
const ACTIVE_ENTRY_BG = '#3c3c3c';

function key(r,c){ return `${r},${c}`; }

// NEW FEATURE — Mobile keyboard focus fix
function focusMobileInput(){
  if (!mobileInput) return;
  if (document.activeElement === mobileInput) return;
  try {
    mobileInput.focus({ preventScroll: true });
  } catch (err){
    mobileInput.focus();
  }
}

function blurMobileInput(){
  if (!mobileInput) return;
  if (document.activeElement !== mobileInput) return;
  mobileInput.blur();
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
        // isGrey marks whether a hint has touched this cell.
        isGrey: false,
        hintGreen: false,

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
    hintState: null
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
// Return the next unsolved entry after the given index, wrapping around.
function findNextUnsolvedEntry(startIdx){
  for (let i = 1; i <= entries.length; i++){
    const ent = entries[(startIdx + i) % entries.length];
    if (ent.status !== 'solved') return ent;
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

  // NEW FEATURE — Clue rating popup
  showRatingPopup(ent);

  // Ensure hint panel reflects solved status when returning later.
  if (currentEntry && currentEntry.id === ent.id) updateHintPanel(ent);

  if (!puzzleFinished && currentEntry && currentEntry.id === ent.id){
    const idx = entries.indexOf(ent);
    const next = findNextUnsolvedEntry(idx);
    if (next) setCurrentEntry(next);
  }

}

// NEW FEATURE — Hint panel display
function ensureHintState(ent){
  if (!ent.hintState){
    ent.hintState = {
      definition: { used: false, cells: [] },
      letter: { used: false, cells: [] },
      trick: { used: false, cells: [] }
    };
  }
  return ent.hintState;
}

// NEW FEATURE — Hint colouring logic
function addHintCells(bucket, cells){
  cells.forEach(cell => {
    if (!bucket.cells.includes(cell)) bucket.cells.push(cell);
  });
}

function selectHintCells(ent, bucket){
  const already = bucket.cells.slice();
  const pool = ent.cells.filter(cell => !already.includes(cell));
  const fallbackPool = pool.length ? pool : ent.cells.slice();
  if (!fallbackPool.length) return [];
  const max = Math.min(3, fallbackPool.length);
  const count = Math.max(1, Math.min(max, Math.floor(Math.random() * max) + 1));
  const chosen = [];
  const temp = fallbackPool.slice();
  while (chosen.length < count && temp.length){
    const idx = Math.floor(Math.random() * temp.length);
    chosen.push(temp.splice(idx, 1)[0]);
  }
  return chosen;
}

function markCellsGreen(cells){
  cells.forEach(cell => {
    cell.hintGreen = true;
    if (cell.isGrey) cell.isGrey = false;
  });
}

function buildDefinitionHint(ent){
  const segs = (ent.clue && ent.clue.segments) || [];
  const defs = segs
    .filter(seg => seg.type === 'definition')
    .map(seg => seg && seg.text != null ? String(seg.text).trim() : '')
    .filter(Boolean);
  if (defs.length) return defs.join(' / ');
  const surface = ent.clue && ent.clue.surface;
  return surface || 'Definition not available.';
}

function buildTrickHint(ent){
  const segs = (ent.clue && ent.clue.segments) || [];
  const annotated = segs
    .filter(seg => seg && seg.tooltip)
    .map(seg => ({ text: seg.text != null ? String(seg.text).trim() : 'Indicator', tip: String(seg.tooltip).trim() }))
    .filter(seg => seg.tip);
  if (!annotated.length) return 'Look at the wordplay structure for this clue.';
  return annotated.map(seg => `${seg.text}: ${seg.tip}`).join(' • ');
}

function describeRevealedLetters(ent){
  const state = ent.hintState && ent.hintState.letter;
  if (!state || !state.cells.length) return '';
  const parts = state.cells.map(cell => {
    const idx = ent.cells.indexOf(cell);
    const displayIndex = idx >= 0 ? idx + 1 : '';
    const letter = cell.letter || ent.answer[idx] || '?';
    return displayIndex ? `(${displayIndex}) ${letter}` : letter;
  });
  return parts.join(', ');
}

function pulseCells(cells){
  cells.forEach(cell => {
    if (!cell || !cell.el) return;
    cell.el.classList.remove('hint-pulse');
    void cell.el.offsetWidth;
    cell.el.classList.add('hint-pulse');
    const handler = () => {
      cell.el.classList.remove('hint-pulse');
      cell.el.removeEventListener('animationend', handler);
    };
    cell.el.addEventListener('animationend', handler);
  });
}

function attachHintHover(el, cells){
  if (!el || !cells || !cells.length) return;
  const trigger = () => pulseCells(cells);
  el.addEventListener('mouseenter', trigger);
  el.addEventListener('focus', trigger);
  el.addEventListener('touchstart', trigger, { passive: true });
}

function updateHintPanel(ent){
  if (!hintPanel || !hintContent){
    return;
  }
  hintContent.innerHTML = '';
  if (!ent || !ent.hintState){
    hintPanel.hidden = true;
    return;
  }

  const { definition, letter, trick } = ent.hintState;
  let shown = 0;

  if (definition && definition.used){
    const item = document.createElement('div');
    item.className = 'hint-item';
    item.tabIndex = 0;
    const title = document.createElement('strong');
    title.textContent = 'Definition';
    const body = document.createElement('div');
    body.textContent = buildDefinitionHint(ent);
    item.appendChild(title);
    item.appendChild(body);
    attachHintHover(item, definition.cells);
    hintContent.appendChild(item);
    shown++;
  }

  if (letter && letter.used && letter.cells.length){
    const item = document.createElement('div');
    item.className = 'hint-item';
    item.tabIndex = 0;
    const title = document.createElement('strong');
    title.textContent = 'Revealed letters';
    const body = document.createElement('div');
    const desc = describeRevealedLetters(ent);
    body.textContent = desc || 'Look for the green squares in the grid.';
    item.appendChild(title);
    item.appendChild(body);
    attachHintHover(item, letter.cells);
    hintContent.appendChild(item);
    shown++;
  }

  if (trick && trick.used){
    const item = document.createElement('div');
    item.className = 'hint-item';
    item.tabIndex = 0;
    const title = document.createElement('strong');
    title.textContent = 'Reveal the trick';
    const body = document.createElement('div');
    body.textContent = buildTrickHint(ent);
    item.appendChild(title);
    item.appendChild(body);
    attachHintHover(item, trick.cells);
    hintContent.appendChild(item);
    shown++;
  }

  hintPanel.hidden = shown === 0;
}

// Called when a hint is used on a clue.
function onHintUsed(clueId, type){
  const ent = entries.find(e => e.id === clueId);

  if (!ent || ent.status === 'solved') return;

  const state = ensureHintState(ent);

  if (type === 'reveal-letter'){
    const candidates = ent.cells
      .map((c,i) => ({ cell:c, idx:i }))
      .filter(({cell, idx}) => (cell.letter || '').toUpperCase() !== ent.answer[idx]);
    if (!candidates.length) return;
    const { cell, idx } = candidates[Math.floor(Math.random()*candidates.length)];
    cell.letter = ent.answer[idx];
    cell.hintGreen = true;
    cell.isGrey = false;
    state.letter.used = true;
    addHintCells(state.letter, [cell]);
    ent.iActive = idx;
    activeCellKey = key(cell.r, cell.c);

    // Check both this entry and any crossing entry in case the revealed
    // letter completes another clue.
    cell.entries.forEach(checkIfSolved);

  } else if (type === 'definition' || type === 'trick' || type === 'analyse'){
    const isDefinition = type === 'definition';
    const bucket = isDefinition ? state.definition : state.trick;
    if (!bucket.used){
      bucket.used = true;
      const chosen = selectHintCells(ent, bucket);
      addHintCells(bucket, chosen);
      markCellsGreen(chosen);
    }
    if (isDefinition && clueTextEl) clueTextEl.classList.add('help-on');
    if (!isDefinition && clueTextEl) clueTextEl.classList.add('annot-on');

    // Greening doesn't change letters, but the clue might already be correct.
    checkIfSolved(ent);
  }
  renderLetters();
  if (currentEntry && currentEntry.id === ent.id) updateHintPanel(ent);
}

// NEW FEATURE — Clue rating popup
function getStoredRatings(){
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(RATING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err){
    return {};
  }
}

function saveRating(clueId, rating){
  if (typeof localStorage === 'undefined') return;
  const map = getStoredRatings();
  map[clueId] = rating;
  try {
    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(map));
  } catch (err){
    // ignore storage errors
  }
}

function showRatingPopup(ent){
  if (!ratingPopup || !ent) return;
  const stored = getStoredRatings();
  if (stored[ent.id]) return;
  if (ratingHideTimer){
    clearTimeout(ratingHideTimer);
    ratingHideTimer = null;
  }
  if (ratingCleanupTimer){
    clearTimeout(ratingCleanupTimer);
    ratingCleanupTimer = null;
  }
  ratingPopup.hidden = false;
  ratingPopup.dataset.clueId = ent.id;
  ratingPopup.classList.add('show');
}

function scheduleRatingHide(){
  if (!ratingPopup) return;
  if (ratingHideTimer){
    clearTimeout(ratingHideTimer);
    ratingHideTimer = null;
  }
  if (ratingCleanupTimer){
    clearTimeout(ratingCleanupTimer);
    ratingCleanupTimer = null;
  }
  ratingHideTimer = setTimeout(() => {
    ratingPopup.classList.remove('show');
    ratingCleanupTimer = setTimeout(() => {
      ratingPopup.hidden = true;
      delete ratingPopup.dataset.clueId;
    }, 250);
  }, 2000);
}

function handleRatingSelection(score){
  if (!ratingPopup) return;
  const value = Number(score);
  if (!Number.isFinite(value)) return;
  const clueId = ratingPopup.dataset.clueId;
  if (!clueId) return;
  saveRating(clueId, value);
  scheduleRatingHide();
  setTimeout(() => focusMobileInput(), 0);
}

function checkIfSolved(ent){
  const guess = ent.cells.map(c => c.letter || '').join('').toUpperCase();
  if (guess === ent.answer.toUpperCase()) onClueSolved(ent.id);
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
        if (cell.isGrey) bg = GREY_VALUE;
        else if (cell.hintGreen) bg = HINT_GREEN_VALUE;
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
        else if (cell.hintGreen) emoji = '🟩';
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

function renderClue(ent){
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
  clueTextEl.className = 'clue';
  clueTextEl.innerHTML = html;
  if (ent.hintState){
    if (ent.hintState.definition && ent.hintState.definition.used){
      clueTextEl.classList.add('help-on');
    }
    if (ent.hintState.trick && ent.hintState.trick.used){
      clueTextEl.classList.add('annot-on');
    }
  }
}

function renderLetters(){
  grid.flat().forEach(cell => {
    [...cell.el.childNodes].forEach(n => {
      if (n.nodeType === 1 && n.classList.contains('num')) return;
      cell.el.removeChild(n);
    });
    cell.el.classList.remove('active');
    cell.el.classList.remove('hint-pulse');
    cell.el.classList.toggle('hint-green', !!cell.hintGreen);
    if (cell.block) return;

    // Apply colouring rules.  Grey overlay takes precedence over baseColour.
    let bg = '#fff';
    let fg = '#000';
    if (cell.isGrey) {
      bg = GREY_VALUE;
    } else if (cell.hintGreen){
      bg = HINT_GREEN_VALUE;
      fg = '#fff';
    } else if (cell.baseColour !== 'none') {
      bg = BASE_COLOUR_VALUES[cell.baseColour];
    }
    cell.el.style.background = bg;
    cell.el.style.color = fg; // adjust for green hint colouring
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
    updateHintPanel(null);
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
  updateHintPanel(currentEntry);
  focusMobileInput();
}

function highlightActive(){
  if (!currentEntry) return;
  const active = currentEntry.cells[currentEntry.iActive];
  currentEntry.cells.forEach(c => {
    if (c === active) return;
    if (c.hintGreen){
      c.el.style.background = HINT_GREEN_VALUE;
      c.el.style.color = '#fff';
    } else if (c.isGrey){
      c.el.style.background = GREY_VALUE;
      c.el.style.color = '#000';
    } else if (c.baseColour !== 'none'){
      c.el.style.background = BASE_COLOUR_VALUES[c.baseColour];
      c.el.style.color = '#000';
    } else {
      c.el.style.background = ACTIVE_ENTRY_BG;
      c.el.style.color = '#fff';
    }
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

  const ent = belongs.find(e => e.direction===pref) || belongs[0];
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
    }
  });
  if (btnHintDef) btnHintDef.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    onHintUsed(currentEntry.id, 'definition');
    closeHintDropdown();
  });
  if (btnHintLetter) btnHintLetter.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    onHintUsed(currentEntry.id, 'reveal-letter');
    closeHintDropdown();
  });
  if (btnHintAnalyse) btnHintAnalyse.addEventListener('click', () => {
    if (!currentEntry){
      closeHintDropdown();
      return;
    }
    onHintUsed(currentEntry.id, 'trick');
    closeHintDropdown();
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
      // Grey out entire answer when revealed
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

    // NEW FEATURE — Mobile keyboard focus fix
    if (mobileInput){
      const isElement = typeof Element !== 'undefined' && t instanceof Element;
      const element = isElement ? t : (t && t.parentElement);
      const cellEl = element ? element.closest('.cell') : null;
      if (gridEl && element && gridEl.contains(element) && cellEl && !cellEl.classList.contains('block')){
        focusMobileInput();
      } else if (element !== mobileInput){
        blurMobileInput();
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

  // NEW FEATURE — Clue rating popup
  ratingStars.forEach(star => {
    star.addEventListener('click', () => {
      const score = Number(star.dataset.score);
      handleRatingSelection(score);
    });
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
    ent.hintState = null;
    ent.cells.forEach(c => {
      c.letter = '';
      c.baseColour = 'none';
      c.isGrey = false;
      c.hintGreen = false;

      c.locked = false;
    });
  });
  puzzleFinished = false;
  if (shareModal) shareModal.hidden = true;
  if (copyToast) copyToast.hidden = true;
  const fireworks = document.getElementById('fireworks');
  if (fireworks) fireworks.classList.remove('on');

  if (clueTextEl) clueTextEl.classList.remove('help-on', 'annot-on');
  if (hintPanel){
    hintPanel.hidden = true;
    if (hintContent) hintContent.innerHTML = '';
  }
  if (ratingPopup){
    ratingPopup.classList.remove('show');
    ratingPopup.hidden = true;
    delete ratingPopup.dataset.clueId;
  }
  if (ratingHideTimer){ clearTimeout(ratingHideTimer); ratingHideTimer = null; }
  if (ratingCleanupTimer){ clearTimeout(ratingCleanupTimer); ratingCleanupTimer = null; }

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
    html += `<span class="${cls}" data-tooltip="${escapeHtml(tip)}">${escapeHtml(segmentText)}</span>`;
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
  closeHintDropdown();
  if (hintPanel){
    hintPanel.hidden = true;
    if (hintContent) hintContent.innerHTML = '';
  }
  if (ratingPopup){
    ratingPopup.classList.remove('show');
    ratingPopup.hidden = true;
    delete ratingPopup.dataset.clueId;
  }
  if (ratingHideTimer){ clearTimeout(ratingHideTimer); ratingHideTimer = null; }
  if (ratingCleanupTimer){ clearTimeout(ratingCleanupTimer); ratingCleanupTimer = null; }

  buildGrid();
  placeEntries();
  focusFirstCell();
  focusMobileInput();
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

// ----- Boot -----
window.addEventListener('load', () => {
  setupHandlers();

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
