// Main game logic; starts directly in game view
const DATA_FILE = 'Crosswords_new_format_27_10_2025.json';

const FLOWER_STORAGE_KEY = 'cg.lastFlowerKey';
const FLOWER_DATE_KEY = 'cg.lastCompletionISO';
const FLOWER_FORCE_KEY = 'cg.debugForceFlower';
const FLOWER_CELL_INDEX_KEY = 'cg.lastFlowerCellIndex'; // reused as the next placement index
const FLOWER_SLOTS_KEY = 'cg.flowerSlots';
const FLOWER_EMOJI = {
  PURE: '🌹',
  BRIGHT: '🌼',
  GENTLE: '🌷',
  GUIDED: '🌱'
};

const FLOWER_INFO = createFlowerInfo();

let totalHintsUsed = 0;
let usedAnyReveal = false;
let appliedFlowerSlots = [];
let nextFlowerIndex = 0;
let flowerCells = [];

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
const resultsBody = document.getElementById('resultsBody');
const resultsHeading = document.getElementById('shareHeading');
const resultsTranslation = document.getElementById('shareSubheading');
const btnViewResult = document.getElementById('btnViewResult');
const btnTendGarden = document.getElementById('btnTendGarden');
const btnCopyResult = document.getElementById('copyResult');
const copyToast = document.getElementById('copyToast');

const NO_COMMENT_TEXT = '(No setter\u2019s comment provided)';
const CELEBRATION_MESSAGES = [
  { mi: 'Ka pai!', en: 'Good job!' },
  { mi: 'Tino pai!', en: 'Very good!' },
  { mi: 'M\u012bharo!', en: 'Amazing!' },
  { mi: 'Tau k\u0113!', en: 'Awesome!' },
  { mi: 'Ka rawe!', en: 'Excellent!' }
];

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
let hintPromptViewportHandler = null;
let skipTooltipPointerDownId = null;
let tooltipHighlightCells = [];
let completionMessage = null;

initializeFlowerState();

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

function createFlowerInfo(){
  const buildSvg = (primary, secondary, center) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g fill="${primary}" opacity="0.9">
        <circle cx="50" cy="18" r="18" />
        <circle cx="50" cy="82" r="18" />
        <circle cx="18" cy="50" r="18" />
        <circle cx="82" cy="50" r="18" />
      </g>
      <g fill="${secondary}" opacity="0.85">
        <circle cx="30" cy="30" r="16" />
        <circle cx="70" cy="30" r="16" />
        <circle cx="30" cy="70" r="16" />
        <circle cx="70" cy="70" r="16" />
      </g>
      <circle cx="50" cy="50" r="18" fill="${center}" stroke="${secondary}" stroke-width="4" />
      <circle cx="50" cy="50" r="8" fill="${secondary}" opacity="0.9" />
    </svg>
  `;

  return {
    PURE: {
      name: 'Pure Bloom',
      description: 'no hints used',
      ariaLabel: 'Pure Bloom — no hints used',
      svg: buildSvg('#A86FFF', '#932F6D', '#F4E7FF')
    },
    BRIGHT: {
      name: 'Bright Bloom',
      description: '1–2 hints used',
      ariaLabel: 'Bright Bloom — used 1 to 2 hints',
      svg: buildSvg('#FFD75A', '#FFB400', '#FFF4C2')
    },
    GENTLE: {
      name: 'Gentle Bloom',
      description: '3–4 hints used',
      ariaLabel: 'Gentle Bloom — used 3 to 4 hints',
      svg: buildSvg('#E18AC0', '#FFB3D9', '#FFE1EF')
    },
    GUIDED: {
      name: 'Guided Bud',
      description: 'used reveals or many hints',
      ariaLabel: 'Guided Bud — used reveals or 5+ hints',
      svg: buildSvg('#F2E9E4', '#FFB6A6', '#FFE8E1')
    }
  };
}

function getStorage(){
  try {
    return window.localStorage;
  } catch (err) {
    return null;
  }
}

function getStoredValue(key){
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch (err) {
    return null;
  }
}

function setStoredValue(key, value){
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch (err) {
    // Ignore storage errors (e.g. quota exceeded, private mode).
  }
}

function removeStoredValue(key){
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (err) {
    // Ignore failures when storage isn't available.
  }
}

function classifyFlowerKey(hintsUsed, revealUsed){
  if (revealUsed) return 'GUIDED';
  if (hintsUsed === 0) return 'PURE';
  if (hintsUsed <= 2) return 'BRIGHT';
  if (hintsUsed <= 4) return 'GENTLE';
  return 'GUIDED';
}

function getStoredFlowerNextIndex(){
  const value = getStoredValue(FLOWER_CELL_INDEX_KEY);
  if (value == null) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseStoredFlowerSlots(raw){
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(key => (FLOWER_INFO[key] ? key : null));
  } catch (err) {
    return [];
  }
}

function getStoredFlowerSlots(){
  const stored = parseStoredFlowerSlots(getStoredValue(FLOWER_SLOTS_KEY));
  if (stored.length) return stored;

  const legacyKey = getStoredValue(FLOWER_STORAGE_KEY);
  if (!legacyKey || !FLOWER_INFO[legacyKey]) return [];

  const legacyIndex = getStoredFlowerNextIndex();
  const assumedTotal = 4;
  const index = legacyIndex != null
    ? (((legacyIndex - 1) % assumedTotal) + assumedTotal) % assumedTotal
    : 0;
  const arr = Array(assumedTotal).fill(null);
  arr[index] = legacyKey;
  return arr;
}

function findNextOpenSlot(slots, startIndex){
  const total = slots.length;
  if (!total) return 0;
  const start = Number.isFinite(startIndex) ? startIndex : 0;
  for (let step = 0; step < total; step++){
    const idx = (start + step) % total;
    if (!slots[idx] || !FLOWER_INFO[slots[idx]]) return idx;
  }
  return start % total;
}

function alignFlowerStateWithGrid(){
  const total = flowerCells.length;
  if (!total){
    return;
  }

  if (appliedFlowerSlots.length > total){
    appliedFlowerSlots = appliedFlowerSlots.slice(0, total);
  } else {
    while (appliedFlowerSlots.length < total) appliedFlowerSlots.push(null);
  }

  if (!Number.isFinite(nextFlowerIndex) || nextFlowerIndex < 0) nextFlowerIndex = 0;
  nextFlowerIndex = findNextOpenSlot(appliedFlowerSlots, nextFlowerIndex % total);
}

function getRenderFlowerSlots(baseSlots){
  const total = flowerCells.length || (Array.isArray(baseSlots) ? baseSlots.length : 0);
  let slots = Array.isArray(baseSlots) ? baseSlots.slice(0, total || undefined) : [];
  if (total && slots.length < total){
    while (slots.length < total) slots.push(null);
  }
  const forced = getStoredValue(FLOWER_FORCE_KEY);
  if (forced && FLOWER_INFO[forced]){
    const length = total || slots.length || 4;
    return Array.from({ length }, () => forced);
  }
  return slots;
}

function applyFlowersToGrid(slotsOverride){
  const slots = getRenderFlowerSlots(slotsOverride ?? appliedFlowerSlots);

  flowerCells.forEach(cell => {
    const existing = cell.el.querySelector('.flower-icon');
    if (existing) existing.remove();
    cell.el.classList.remove('flowered');
  });

  slots.forEach((key, idx) => {
    if (!FLOWER_INFO[key]) return;
    const cell = flowerCells[idx];
    if (!cell || !cell.el) return;
    const info = FLOWER_INFO[key];
    const icon = document.createElement('div');
    icon.className = 'flower-icon';
    icon.dataset.flowerKey = key;
    icon.setAttribute('role', 'img');
    icon.setAttribute('aria-label', info.ariaLabel);
    icon.innerHTML = info.svg;
    cell.el.appendChild(icon);
    cell.el.classList.add('flowered');
  });

  updateTendGardenButton();
}

function refreshFlowerIcons(){
  alignFlowerStateWithGrid();
  applyFlowersToGrid(appliedFlowerSlots);
}

function normalizeFlowerSlotsForStorage(slots, total){
  const length = Number.isFinite(total) && total > 0 ? total : slots.length;
  const normalized = [];
  for (let i = 0; i < length; i++){
    const key = slots[i];
    normalized[i] = FLOWER_INFO[key] ? key : null;
  }
  return normalized;
}

function findLatestStoredFlower(slots){
  for (let i = slots.length - 1; i >= 0; i--){
    const key = slots[i];
    if (FLOWER_INFO[key]) return key;
  }
  return null;
}

function persistFlowerCompletion(latestKey){
  if (!FLOWER_INFO[latestKey]) return;
  const forced = getStoredValue(FLOWER_FORCE_KEY);
  if (forced && FLOWER_INFO[forced]) return;
  const normalized = normalizeFlowerSlotsForStorage(appliedFlowerSlots, flowerCells.length || appliedFlowerSlots.length);
  setStoredValue(FLOWER_SLOTS_KEY, JSON.stringify(normalized));
  setStoredValue(FLOWER_CELL_INDEX_KEY, String(nextFlowerIndex));
  setStoredValue(FLOWER_STORAGE_KEY, latestKey);
  setStoredValue(FLOWER_DATE_KEY, new Date().toISOString());
}

function persistFlowerGardenState({ updateDate = false } = {}){
  const forced = getStoredValue(FLOWER_FORCE_KEY);
  if (forced && FLOWER_INFO[forced]) return;
  const normalized = normalizeFlowerSlotsForStorage(appliedFlowerSlots, flowerCells.length || appliedFlowerSlots.length);
  setStoredValue(FLOWER_SLOTS_KEY, JSON.stringify(normalized));
  setStoredValue(FLOWER_CELL_INDEX_KEY, String(nextFlowerIndex));
  const latest = findLatestStoredFlower(normalized);
  if (latest){
    setStoredValue(FLOWER_STORAGE_KEY, latest);
    if (updateDate) setStoredValue(FLOWER_DATE_KEY, new Date().toISOString());
  } else {
    removeStoredValue(FLOWER_STORAGE_KEY);
    removeStoredValue(FLOWER_DATE_KEY);
  }
}

function initializeFlowerState(){
  appliedFlowerSlots = getStoredFlowerSlots();
  const storedNext = getStoredFlowerNextIndex();
  if (storedNext != null){
    nextFlowerIndex = storedNext;
  } else if (appliedFlowerSlots.length){
    nextFlowerIndex = findNextOpenSlot(appliedFlowerSlots, 0);
  } else {
    nextFlowerIndex = 0;
  }
}

function updateTendGardenButton(){
  if (!btnTendGarden) return;
  const hasFlower = appliedFlowerSlots.some(key => FLOWER_INFO[key]);
  if (!puzzleFinished || !hasFlower){
    btnTendGarden.hidden = true;
    btnTendGarden.setAttribute('aria-hidden', 'true');
    btnTendGarden.disabled = true;
  } else {
    btnTendGarden.hidden = false;
    btnTendGarden.removeAttribute('aria-hidden');
    btnTendGarden.disabled = false;
  }
}

function dispatchCrosswordCompleted(){
  if (typeof window === 'undefined') return;
  const handler = window.onCrosswordCompleted;
  if (typeof handler !== 'function') return;
  try {
    handler({ totalHintsUsed, usedAnyReveal });
  } catch (err) {
    console.error('Error running onCrosswordCompleted handler:', err);
  }
}

function recordHintUsage(type){
  totalHintsUsed += 1;
  if (type && String(type).toLowerCase().startsWith('reveal')) usedAnyReveal = true;
}

function recordRevealUsage(){
  usedAnyReveal = true;
  totalHintsUsed += 1;
}

function handleFlowerOnCompletion(){
  const todayKey = classifyFlowerKey(totalHintsUsed, usedAnyReveal);
  alignFlowerStateWithGrid();

  const totalSlots = flowerCells.length || appliedFlowerSlots.length || 4;
  if (!appliedFlowerSlots.length){
    appliedFlowerSlots = Array(totalSlots).fill(null);
  }

  const placementIndex = findNextOpenSlot(appliedFlowerSlots, nextFlowerIndex);
  appliedFlowerSlots[placementIndex] = todayKey;

  const nextSearchStart = (placementIndex + 1) % appliedFlowerSlots.length;
  nextFlowerIndex = findNextOpenSlot(appliedFlowerSlots, nextSearchStart);

  persistFlowerCompletion(todayKey);
  refreshFlowerIcons();
  dispatchCrosswordCompleted();
}

function handleTendGardenClick(){
  alignFlowerStateWithGrid();
  if (!appliedFlowerSlots.length) return;
  const total = appliedFlowerSlots.length;
  let target = ((Number.isFinite(nextFlowerIndex) ? nextFlowerIndex : 0) + total - 1) % total;
  let found = -1;
  for (let offset = 0; offset < total; offset++){
    const idx = (target - offset + total) % total;
    if (FLOWER_INFO[appliedFlowerSlots[idx]]){ found = idx; break; }
  }
  if (found === -1) return;

  appliedFlowerSlots[found] = null;
  nextFlowerIndex = found;
  persistFlowerGardenState();
  refreshFlowerIcons();
}

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
  flowerCells = [];

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
      if (cell.block){
        cell.flowerIndex = flowerCells.length;
        flowerCells.push(cell);
      }
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
    setterComment: e.setterComment || '',
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
  if (colour){
    ent.cells.forEach(cell => {
      if (cell.baseColour === 'none') cell.baseColour = colour;
    });
  }

  renderLetters();
  checkForCompletion();

  if (!puzzleFinished && currentEntry && currentEntry.id === ent.id){
    goToNextClueWithNeed(ent.id);
  }

}

// Called when a hint is used on a clue.  For non reveal-letter hints we simply
// highlight a random cell.  For reveal-letter hints we also fill in the correct
// letter for one not-yet-correct cell.
function onHintUsed(clueId, type){
  const ent = entries.find(e => e.id === clueId);

  if (!ent || ent.status === 'solved') return;

  recordHintUsage(type);

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

function pickCelebrationMessage(){
  if (!CELEBRATION_MESSAGES.length) return null;
  const index = Math.floor(Math.random() * CELEBRATION_MESSAGES.length);
  return CELEBRATION_MESSAGES[index];
}

function applyCompletionMessage(message){
  if (resultsHeading){
    resultsHeading.textContent = message && message.mi ? message.mi : 'Crossword results';
  }
  if (resultsTranslation){
    if (message && message.en){
      resultsTranslation.textContent = message.en;
      resultsTranslation.hidden = false;
    } else {
      resultsTranslation.textContent = '';
      resultsTranslation.hidden = true;
    }
  }
}

function onPuzzleComplete(){
  updateCompletionUi(true);
  completionMessage = pickCelebrationMessage();
  applyCompletionMessage(completionMessage);
  populateResultsModal();
  handleFlowerOnCompletion();
  renderSharePreview();
  if (btnViewResult){
    btnViewResult.focus();
  }
  mobileBehaviours.hideKeyboard();
  openShareModal();
  finishGame();
}

// Build the share preview grid shown in the modal
function renderSharePreview(){
  if (!shareGrid || !puzzle || !puzzle.grid) return;
  const { rows, cols } = puzzle.grid;
  shareGrid.innerHTML = '';
  if (!rows || !cols) return;
  const slots = getRenderFlowerSlots(appliedFlowerSlots);
  shareGrid.style.gridTemplateColumns = `repeat(${cols},16px)`;
  shareGrid.style.gridTemplateRows = `repeat(${rows},16px)`;
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      const cell = grid[r][c];
      const d = document.createElement('div');
      d.className = 'share-cell';
      let bg = '#000';
      if (!cell.block){
        if (cell.isGrey) bg = HINT_COLOUR_VALUE;
        else if (cell.baseColour !== 'none') bg = BASE_COLOUR_VALUES[cell.baseColour];
        else bg = '#fff';
      } else {
        d.classList.add('share-cell-block');
        const idx = typeof cell.flowerIndex === 'number' ? cell.flowerIndex : -1;
        if (idx >= 0 && FLOWER_INFO[slots[idx]]){
          const icon = document.createElement('div');
          icon.className = 'flower-icon';
          icon.dataset.flowerKey = slots[idx];
          icon.innerHTML = FLOWER_INFO[slots[idx]].svg;
          d.appendChild(icon);
        }
      }
      d.style.background = bg;
      shareGrid.appendChild(d);
    }
  }
}

// Assemble plain-text emoji grid for clipboard sharing
function buildShareText(){
  if (!puzzle || !puzzle.grid) return '';
  const { rows, cols } = puzzle.grid;
  const lines = [];
  const slots = getRenderFlowerSlots(appliedFlowerSlots);
  for (let r = 0; r < rows; r++){
    let line = '';
    for (let c = 0; c < cols; c++){
      const cell = grid[r][c];
      let emoji = '⬛';
      if (!cell.block){
        if (cell.isGrey) emoji = '🟩';
        else if (cell.baseColour === 'green') emoji = '🟩';
        else if (cell.baseColour === 'yellow') emoji = '🟨';
        else if (cell.baseColour === 'purple') emoji = '🟪';
        else emoji = '⬜';
      } else {
        const idx = typeof cell.flowerIndex === 'number' ? cell.flowerIndex : -1;
        const key = idx >= 0 ? slots[idx] : null;
        if (FLOWER_INFO[key] && FLOWER_EMOJI[key]){
          emoji = FLOWER_EMOJI[key];
        }
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

function populateResultsModal(){
  if (!resultsBody) return;
  resultsBody.innerHTML = '';
  const fragment = document.createDocumentFragment();
  POSITION_ORDER.forEach(id => {
    const ent = entries.find(e => e.id === id);
    if (!ent) return;
    const row = document.createElement('div');
    row.className = 'result-entry';
    row.setAttribute('role', 'listitem');

    const label = document.createElement('span');
    label.className = 'result-label';
    label.textContent = ent.id;
    row.appendChild(label);

    const answerSpan = document.createElement('span');
    answerSpan.className = 'result-answer';
    const strong = document.createElement('strong');
    strong.textContent = ent.answer || '';
    answerSpan.appendChild(strong);
    answerSpan.appendChild(document.createTextNode(': '));
    row.appendChild(answerSpan);

    const commentSpan = document.createElement('span');
    commentSpan.className = 'result-comment';
    const comment = ent.setterComment && ent.setterComment.trim() ? ent.setterComment.trim() : NO_COMMENT_TEXT;
    commentSpan.textContent = comment;
    row.appendChild(commentSpan);

    fragment.appendChild(row);
  });

  if (!fragment.childNodes.length){
    const fallback = document.createElement('p');
    fallback.textContent = 'Results unavailable.';
    resultsBody.appendChild(fallback);
    return;
  }

  resultsBody.appendChild(fragment);
}

function updateCompletionUi(completed){
  if (completed){
    closeHintDropdown();
    if (hintDropdown) hintDropdown.hidden = true;
    if (btnGiveUp) btnGiveUp.hidden = true;
    if (btnHelpBottom) btnHelpBottom.hidden = true;
    if (btnViewResult){
      btnViewResult.hidden = false;
      btnViewResult.removeAttribute('aria-hidden');
    }
    updateTendGardenButton();
  } else {
    if (hintDropdown) hintDropdown.hidden = false;
    if (btnGiveUp) btnGiveUp.hidden = false;
    if (btnHelpBottom) btnHelpBottom.hidden = false;
    if (btnViewResult){
      btnViewResult.hidden = true;
      btnViewResult.setAttribute('aria-hidden', 'true');
    }
    if (btnTendGarden){
      btnTendGarden.hidden = true;
      btnTendGarden.setAttribute('aria-hidden', 'true');
      btnTendGarden.disabled = true;
    }
  }
}

function ensureClueTooltip(){
  if (clueTooltipEl) return clueTooltipEl;
  const el = document.createElement('div');
  el.className = 'clue-tooltip';
  el.setAttribute('role', 'tooltip');
  el.hidden = true;
  el.addEventListener('pointerenter', () => {
    if (activeTooltipTarget) applyTooltipHighlights(activeTooltipTarget);
  });
  el.addEventListener('pointerleave', (event) => {
    const next = event.relatedTarget;
    if (next){
      if (activeTooltipTarget && (activeTooltipTarget === next || activeTooltipTarget.contains(next))) return;
      if (clueTextEl && clueTextEl.contains(next)) return;
    }
    hideClueTooltip();
  });
  document.body.appendChild(el);
  clueTooltipEl = el;
  return el;
}

function hideClueTooltip(){
  const el = clueTooltipEl;
  if (!el) return;
  el.hidden = true;
  activeTooltipTarget = null;
  skipTooltipPointerDownId = null;
  clearTooltipHighlights();
}

function clearTooltipHighlights(){
  if (!tooltipHighlightCells.length) return;
  tooltipHighlightCells.forEach(cell => {
    if (cell && cell.el) cell.el.classList.remove('tooltip-highlight');
  });
  tooltipHighlightCells = [];
}

function applyTooltipHighlights(target){
  clearTooltipHighlights();
  if (!target || !currentEntry) return;
  const attr = target.getAttribute('data-tip-cells');
  if (!attr) return;
  const matches = attr.match(/\d+/g) || [];
  if (!matches.length) return;
  const seen = new Set();
  matches.forEach(raw => {
    const pos = Number(raw);
    if (!Number.isFinite(pos)) return;
    const idx = pos >= 1 ? pos - 1 : pos;
    if (!Number.isInteger(idx) || idx < 0 || seen.has(idx)) return;
    seen.add(idx);
    const cell = currentEntry.cells[idx];
    if (cell && cell.el){
      cell.el.classList.add('tooltip-highlight');
      tooltipHighlightCells.push(cell);
    }
  });
}

function ensureHintPrompt(){
  if (hintPromptEl) return hintPromptEl;
  const el = document.createElement('div');
  el.className = 'toast hint-toast';
  el.id = 'hintPrompt';
  el.hidden = true;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
    hideHintPrompt();
  });
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
  if (hintPromptViewportHandler && window.visualViewport){
    window.visualViewport.removeEventListener('resize', hintPromptViewportHandler);
    window.visualViewport.removeEventListener('scroll', hintPromptViewportHandler);
    hintPromptViewportHandler = null;
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
  const viewport = window.visualViewport;
  const viewportWidth = viewport ? viewport.width : window.innerWidth;
  const viewportHeight = viewport ? viewport.height : window.innerHeight;
  const width = Math.max(0, rect.width);
  const left = (width ? rect.left + width / 2 : viewportWidth / 2);
  const promptHeight = hintPromptEl.offsetHeight || 0;
  const availableTop = Math.max(16, rect.top + 16);
  const maxTop = Math.max(16, viewportHeight - promptHeight - 16);
  const top = Math.min(maxTop, availableTop);
  const widthConstraint = width > 0 ? Math.max(0, width - 24) : Number.POSITIVE_INFINITY;
  const viewportConstraint = Math.max(0, viewportWidth - 32);
  const computedMaxWidth = Math.min(widthConstraint, viewportConstraint, 360);
  const maxWidth = Math.max(180, computedMaxWidth);
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
    if (!hintPromptViewportHandler && window.visualViewport){
      hintPromptViewportHandler = () => {
        positionHintPrompt();
      };
      window.visualViewport.addEventListener('resize', hintPromptViewportHandler);
      window.visualViewport.addEventListener('scroll', hintPromptViewportHandler);
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
  if (hintPromptTimeout){
    clearTimeout(hintPromptTimeout);
    hintPromptTimeout = null;
  }
  if (hintPromptEl) hintPromptEl.hidden = true;
}

function positionClueTooltip(target){
  if (!target){
    hideClueTooltip();
    return;
  }
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
  applyTooltipHighlights(target);
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';
  const viewport = window.visualViewport;
  const viewportWidth = viewport ? viewport.width : window.innerWidth;
  const viewportHeight = viewport ? viewport.height : window.innerHeight;
  tooltip.style.maxWidth = `${Math.min(320, Math.max(0, viewportWidth - 32))}px`;

  const rect = target.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const desiredLeft = rect.left + (rect.width / 2) - (tipRect.width / 2);
  const clampedLeft = Math.max(16, Math.min(viewportWidth - tipRect.width - 16, desiredLeft));
  const desiredTop = rect.bottom + 8;
  const clampedTop = Math.max(16, Math.min(viewportHeight - tipRect.height - 16, desiredTop));

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
    if (event.relatedTarget && clueTooltipEl && clueTooltipEl.contains(event.relatedTarget)) return;
    hideClueTooltip();
  };

  const handlePointerDown = (event) => {
    const target = findTooltipTarget(event.target);
    const pointerId = typeof event.pointerId === 'number' ? event.pointerId : null;
    if (target){
      if (isMobileTouchActive() && activeTooltipTarget === target){
        hideClueTooltip();
        skipTooltipPointerDownId = pointerId;
        return;
      }
      activeTooltipTarget = target;
      positionClueTooltip(target);
      skipTooltipPointerDownId = pointerId;
    } else if (isMobileTouchActive() && activeTooltipTarget && clueTextEl.contains(event.target)){
      hideClueTooltip();
      skipTooltipPointerDownId = pointerId;
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

  const handlePointerLeave = (event) => {
    if (isMobileTouchActive()) return;
    const next = event.relatedTarget;
    if (next){
      if (activeTooltipTarget && (activeTooltipTarget === next || activeTooltipTarget.contains(next))) return;
      if (clueTooltipEl && clueTooltipEl.contains(next)) return;
    }
    hideClueTooltip();
  };

  clueTextEl.addEventListener('pointerover', handlePointerOver);
  clueTextEl.addEventListener('pointerout', handlePointerOut);
  clueTextEl.addEventListener('pointerdown', handlePointerDown);
  clueTextEl.addEventListener('pointercancel', handlePointerCancel);
  clueTextEl.addEventListener('pointerleave', handlePointerLeave);
  clueTextEl.addEventListener('pointercancel', hideClueTooltip);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll);
  const handleDocumentPointerDown = (event) => {
    if (skipTooltipPointerDownId !== null && event.pointerId === skipTooltipPointerDownId){
      skipTooltipPointerDownId = null;
      return;
    }
    skipTooltipPointerDownId = null;
    if (!activeTooltipTarget) return;
    const targetNode = event.target;
    if (activeTooltipTarget && activeTooltipTarget.contains(targetNode)){
      if (isMobileTouchActive()) hideClueTooltip();
      return;
    }
    if (clueTooltipEl && clueTooltipEl.contains(targetNode)){
      hideClueTooltip();
      return;
    }
    if (clueTextEl.contains(targetNode)){
      if (isMobileTouchActive()) hideClueTooltip();
      return;
    }
    hideClueTooltip();
  };

  document.addEventListener('pointerdown', handleDocumentPointerDown);
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
  if (puzzleFinished && ent.hintState){
    ent.hintState.definition = true;
    ent.hintState.analyse = true;
  }
  applyHintClasses(ent);
}

function renderLetters(){
  grid.flat().forEach(cell => {
    [...cell.el.childNodes].forEach(n => {
      if (n.nodeType === 1 && (n.classList.contains('num') || n.classList.contains('flower-icon'))) return;
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

function getEntryById(clueId){
  return entries.find(e => e.id === clueId) || null;
}

function getClueCells(clueId){
  const ent = typeof clueId === 'string' ? getEntryById(clueId) : clueId;
  return ent && Array.isArray(ent.cells) ? ent.cells : [];
}

function isNeeded(cell){
  if (!cell) return false;
  return !cell.locked && !(cell.letter && cell.letter.length);
}

function nextNeededIndex(clueId, fromIndexExclusive){
  const cells = getClueCells(clueId);
  const len = cells.length;
  if (!len) return -1;
  const start = typeof fromIndexExclusive === 'number' ? fromIndexExclusive : -1;
  for (let step = 1; step <= len; step++){
    const idx = (start + step + len) % len;
    if (isNeeded(cells[idx])) return idx;
  }
  return -1;
}

function prevNeededIndex(clueId, fromIndexExclusive){
  const cells = getClueCells(clueId);
  const len = cells.length;
  if (!len) return -1;
  const start = typeof fromIndexExclusive === 'number' ? fromIndexExclusive : 0;
  for (let step = 1; step <= len; step++){
    let idx = (start - step) % len;
    if (idx < 0) idx += len;
    if (isNeeded(cells[idx])) return idx;
  }
  return -1;
}

function focusCell(cell){
  if (!cell) return false;
  const ent = (currentEntry && currentEntry.cells.includes(cell))
    ? currentEntry
    : (cell.entries && cell.entries[0]) || null;
  if (!ent) return false;
  const idx = ent.cells.indexOf(cell);
  if (idx === -1) return false;
  setCurrentEntry(ent, { focusIndex: idx, allowLocked: true });
  return true;
}

function focusFirstNeededCell(clueId){
  const ent = getEntryById(clueId);
  if (!ent) return false;
  const idx = ent.cells.findIndex(isNeeded);
  if (idx === -1) return false;
  setCurrentEntry(ent, { focusIndex: idx });
  return true;
}

function isClueSolved(clueId){
  const ent = typeof clueId === 'string' ? getEntryById(clueId) : clueId;
  if (!ent) return false;
  return ent.cells.every((cell, idx) => ((cell.letter || '').toUpperCase() === ent.answer[idx]));
}

function getClueIndex(clueId){
  return entries.findIndex(e => e.id === clueId);
}

function nextClueId(clueId){
  if (!entries.length) return null;
  const idx = getClueIndex(clueId);
  if (idx === -1) return entries[0].id;
  return entries[(idx + 1) % entries.length].id;
}

function prevClueId(clueId){
  if (!entries.length) return null;
  const idx = getClueIndex(clueId);
  if (idx === -1) return entries[entries.length - 1].id;
  return entries[(idx - 1 + entries.length) % entries.length].id;
}

function goToNextClueWithNeed(startClueId = currentEntry ? currentEntry.id : null){
  if (!entries.length) return false;
  const startIdx = startClueId ? getClueIndex(startClueId) : -1;
  for (let step = 1; step <= entries.length; step++){
    const idx = (startIdx + step + entries.length) % entries.length;
    const ent = entries[idx];
    if (!ent) continue;
    const needIdx = ent.cells.findIndex(isNeeded);
    if (needIdx !== -1){
      setCurrentEntry(ent, { focusIndex: needIdx });
      return true;
    }
  }
  return false;
}

function setCurrentEntry(ent, options = {}){
  if (typeof options === 'string') options = { focusKey: options };
  currentEntry = ent;
  if (!ent){
    hideClueTooltip();
    mobileBehaviours.onEntryCleared();
    return;
  }

  renderClue(ent);

  let idx = ent.iActive != null ? ent.iActive : 0;

  if (options.focusKey){
    const found = ent.cells.findIndex(c => key(c.r, c.c) === options.focusKey);
    if (found !== -1) idx = found;
  }

  if (typeof options.focusIndex === 'number') idx = options.focusIndex;

  if (idx < 0) idx = 0;
  if (idx >= ent.cells.length) idx = ent.cells.length - 1;

  if (options.ensureNeeded){
    const neededIdx = ent.cells.findIndex(isNeeded);
    if (neededIdx !== -1) idx = neededIdx;
  }

  let cell = ent.cells[idx];

  if (cell && cell.locked && !options.allowLocked){
    const nextIdx = nextNeededIndex(ent.id, idx);
    if (nextIdx !== -1){
      idx = nextIdx;
      cell = ent.cells[idx];
    } else {
      const fallback = ent.cells.findIndex(c => !c.locked);
      if (fallback !== -1){
        idx = fallback;
        cell = ent.cells[idx];
      }
    }
  }

  ent.iActive = Math.max(0, Math.min(idx, ent.cells.length - 1));
  const target = ent.cells[ent.iActive];
  activeCellKey = target ? key(target.r, target.c) : null;

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
    if (!puzzleFinished) return;
  }

  dirToggle.set(k, ent.direction);

  let focusIdx = ent.cells.findIndex(c => key(c.r, c.c) === k);
  if (focusIdx === -1) focusIdx = ent.iActive != null ? ent.iActive : 0;

  let target = ent.cells[focusIdx];
  if (target && target.locked){
    const forward = nextNeededIndex(ent.id, focusIdx);
    const backward = forward === -1 ? prevNeededIndex(ent.id, focusIdx) : -1;
    const resolved = forward !== -1 ? forward : backward;
    if (resolved !== -1){
      focusIdx = resolved;
      target = ent.cells[focusIdx];
    }
  }

  const allowLocked = !!(target && target.locked && !isNeeded(target));
  setCurrentEntry(ent, { focusIndex: focusIdx, allowLocked });
}

function moveWithinActiveClue(step, skipFilled=true){
  if (!currentEntry) return false;
  const ent = currentEntry;
  const len = ent.cells.length;
  if (!len) return false;
  const start = ent.iActive != null ? ent.iActive : 0;
  for (let offset = 1; offset <= len; offset++){
    const idxRaw = start + step * offset;
    let idx = idxRaw % len;
    if (idx < 0) idx += len;
    const cell = ent.cells[idx];
    if (!cell || cell.locked) continue;
    if (skipFilled && cell.letter) continue;
    ent.iActive = idx;
    activeCellKey = key(cell.r, cell.c);
    renderLetters();
    return true;
  }
  return false;
}

function typeChar(ch){
  if (!currentEntry) return;
  const ent = currentEntry;
  let idx = ent.iActive != null ? ent.iActive : 0;
  let cell = ent.cells[idx];
  if (!cell) return;

  if (cell.locked){
    const candidate = nextNeededIndex(ent.id, idx);
    if (candidate === -1) return;
    idx = candidate;
    cell = ent.cells[idx];
  }

  if (!cell || cell.locked) return;

  cell.letter = ch.toUpperCase();
  ent.iActive = idx;
  activeCellKey = key(cell.r, cell.c);

  cell.entries.forEach(checkIfSolved);

  if (currentEntry !== ent) return;

  const nextIdx = nextNeededIndex(ent.id, idx);
  if (nextIdx !== -1){
    ent.iActive = nextIdx;
    const nextCell = ent.cells[nextIdx];
    activeCellKey = key(nextCell.r, nextCell.c);
  }

  renderLetters();
}

function backspace(){
  if (!currentEntry) return;
  const ent = currentEntry;
  let idx = ent.iActive != null ? ent.iActive : 0;
  let cell = ent.cells[idx];
  if (!cell) return;

  if (cell.locked){
    for (let i = idx - 1; i >= 0; i--){
      const candidate = ent.cells[i];
      if (!candidate.locked){
        idx = i;
        cell = candidate;
        break;
      }
    }
  }

  if (!cell || cell.locked) return;

  if (cell.letter){
    cell.letter = '';
    ent.iActive = idx;
    activeCellKey = key(cell.r, cell.c);
    renderLetters();
    return;
  }

  for (let i = idx - 1; i >= 0; i--){
    const candidate = ent.cells[i];
    if (candidate.locked) continue;
    if (candidate.letter){
      candidate.letter = '';
      ent.iActive = i;
      activeCellKey = key(candidate.r, candidate.c);
      renderLetters();
      return;
    }
  }
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
    recordRevealUsage();
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
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (copyToast){
        copyToast.hidden = false;
        setTimeout(() => { copyToast.hidden = true; }, 1500);
      }
    }).catch(() => {});
  });
  if (btnViewResult) btnViewResult.addEventListener('click', () => {
    if (!puzzleFinished) return;
    populateResultsModal();
    if (!completionMessage) completionMessage = pickCelebrationMessage();
    applyCompletionMessage(completionMessage);
    renderSharePreview();
    btnViewResult.focus();
    mobileBehaviours.hideKeyboard();
    openShareModal();
  });
  if (btnTendGarden) btnTendGarden.addEventListener('click', () => {
    if (!puzzleFinished) return;
    handleTendGardenClick();
    renderSharePreview();
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
    else if (e.key === 'ArrowLeft'){
      e.preventDefault();
      if (currentEntry && currentEntry.direction === 'across'){
        moveWithinActiveClue(-1, !e.shiftKey);
      }
    }
    else if (e.key === 'ArrowRight'){
      e.preventDefault();
      if (currentEntry && currentEntry.direction === 'across'){
        moveWithinActiveClue(1, !e.shiftKey);
      }
    }
    else if (e.key === 'ArrowUp'){
      e.preventDefault();
      if (currentEntry && currentEntry.direction === 'down'){
        moveWithinActiveClue(-1, !e.shiftKey);
      }
    }
    else if (e.key === 'ArrowDown'){
      e.preventDefault();
      if (currentEntry && currentEntry.direction === 'down'){
        moveWithinActiveClue(1, !e.shiftKey);
      }
    }
  });
}
function focusFirstCell(){
  const start = key(0,0);
  const cell = cellMap.get(start);
  if (cell && !cell.block){
    handleCellClick(start);
  } else if (entries[0]){
    setCurrentEntry(entries[0], { ensureNeeded: true });
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
  totalHintsUsed = 0;
  usedAnyReveal = false;
  updateCompletionUi(false);
  if (shareModal) shareModal.hidden = true;
  if (copyToast) copyToast.hidden = true;
  if (shareGrid) shareGrid.innerHTML = '';
  if (resultsBody) resultsBody.innerHTML = '';
  completionMessage = null;
  applyCompletionMessage(null);
  const fireworks = document.getElementById('fireworks');
  if (fireworks) fireworks.classList.remove('on');

  if (clueTextEl) clueTextEl.classList.remove('help-on', 'annot-on');
  hideClueTooltip();
  resetHintPrompt();

  focusFirstCell();
  renderLetters();
  refreshFlowerIcons();
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
    let cellsAttr = '';
    if (tip){
      classNames.push('has-tip');
      if (seg.tipNumber != null) classNames.push(`tip-${seg.tipNumber}`);
      tooltipAttr = ` data-tooltip="${escapeHtml(tip)}"`;
    }
    if (Array.isArray(seg.positions) && seg.positions.length){
      const cells = seg.positions.map(idx => Number(idx) + 1).filter(n => Number.isFinite(n));
      if (cells.length) cellsAttr = ` data-tip-cells="${cells.join(',')}"`;
    }
    html += `<span class="${classNames.join(' ')}"${tooltipAttr}${cellsAttr}>${escapeHtml(segmentText)}</span>`;
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

function parsePositionList(raw, answerLength){
  if (raw == null) return [];
  const maxLen = Number.isFinite(answerLength) && answerLength > 0 ? Math.floor(answerLength) : null;
  const collectNumbers = (values) => {
    const seen = new Set();
    const result = [];
    values.forEach(value => {
      const num = Number(value);
      if (!Number.isFinite(num)) return;
      const int = Math.trunc(num);
      if (int < 0 || seen.has(int)) return;
      seen.add(int);
      result.push(int);
    });
    return result;
  };

  if (Array.isArray(raw)){
    const numbers = collectNumbers(raw);
    return normalisePositions(numbers, maxLen);
  }

  const str = String(raw).trim();
  if (!str) return [];
  const values = [];
  const regex = /(\d+)(?:\s*-\s*(\d+))?/g;
  let match;
  while ((match = regex.exec(str))){
    let start = Number(match[1]);
    if (!Number.isFinite(start)) continue;
    let end = match[2] != null ? Number(match[2]) : start;
    if (!Number.isFinite(end)) end = start;
    if (end < start){
      const tmp = end;
      end = start;
      start = tmp;
    }
    for (let n = start; n <= end; n++){
      values.push(n);
    }
  }
  const numbers = collectNumbers(values);
  return normalisePositions(numbers, maxLen);
}

function normalisePositions(numbers, maxLen){
  if (!Array.isArray(numbers) || !numbers.length) return [];
  const unique = [];
  const seen = new Set();
  numbers.forEach(num => {
    if (seen.has(num)) return;
    seen.add(num);
    unique.push(num);
  });
  if (!unique.length) return [];

  let base = 0;
  const hasZero = unique.some(num => num === 0);
  if (!hasZero){
    if (maxLen != null){
      const hitsLength = unique.some(num => num === maxLen);
      const exceedsLength = unique.some(num => num > maxLen);
      if (hitsLength || exceedsLength){
        base = 1;
      } else if (unique.length === 1 && unique[0] === 1){
        base = 1;
      }
    } else if (unique.length === 1 && unique[0] === 1){
      base = 1;
    }
  }

  const result = [];
  const finalSeen = new Set();
  unique.forEach(num => {
    const idx = base === 1 ? num - 1 : num;
    if (!Number.isFinite(idx) || idx < 0) return;
    if (maxLen != null && idx >= maxLen) return;
    if (finalSeen.has(idx)) return;
    finalSeen.add(idx);
    result.push(idx);
  });
  return result;
}

function readTooltipField(row, index, field, suffix){
  if (!row) return null;
  const variants = [];
  const lower = field.toLowerCase();
  const upper = field.toUpperCase();
  const capital = field.charAt(0).toUpperCase() + field.slice(1);
  const forms = [field, lower, upper, capital];
  const seen = new Set();
  const add = (key) => {
    if (!key || seen.has(key)) return;
    seen.add(key);
    variants.push(key);
  };

  if (index != null){
    forms.forEach(form => add(`Tooltip_${index}_${form}`));
  }

  if (suffix != null){
    forms.forEach(form => add(`Tooltip_${form}${suffix}`));
  } else {
    forms.forEach(form => add(`Tooltip_${form}`));
  }

  if (index != null){
    forms.forEach(form => add(`Tooltip_${form}_${index}`));
    if (index > 1){
      const alt = index - 1;
      forms.forEach(form => add(`Tooltip_${form}.${alt}`));
      forms.forEach(form => add(`Tooltip_${form}_${alt}`));
    }
  }

  for (const key of variants){
    if (Object.prototype.hasOwnProperty.call(row, key)){
      const value = row[key];
      if (value != null && String(value).trim() !== '') return value;
    }
  }
  return null;
}

function buildSegmentsLegacy(row, answerLength){
  const segments = [];
  if (!row) return segments;
  for (let i = 1; i <= 6; i++){
    const suffix = i === 1 ? '' : `.${i-1}`;
    const typeRaw = readTooltipField(row, i, 'type', suffix);
    const textRaw = readTooltipField(row, i, 'section', suffix);
    const tooltipRaw = readTooltipField(row, i, 'text', suffix);
    const posRaw = readTooltipField(row, i, 'Position', suffix);
    const segText = textRaw ? String(textRaw).trim() : '';
    const tipText = tooltipRaw ? String(tooltipRaw).trim() : '';
    const typeStr = typeRaw ? String(typeRaw).trim() : '';
    if (!typeStr && !segText) continue;
    const { type, category } = interpretSegmentType(typeStr);
    const segment = { type, text: segText };
    if (category) segment.category = category;
    if (tipText) segment.tooltip = tipText;
    segment.tipNumber = i;
    const positions = parsePositionList(posRaw, answerLength);
    if (positions.length) segment.positions = positions;
    segments.push(segment);
  }
  return segments;
}

function hasNewFormatSegmentFields(row){
  if (!row || typeof row !== 'object') return false;
  for (let i = 1; i <= 6; i++){
    if (Object.prototype.hasOwnProperty.call(row, `Text_${i}`) ||
        Object.prototype.hasOwnProperty.call(row, `Category_${i}`) ||
        Object.prototype.hasOwnProperty.call(row, `Tooltip_${i}`) ||
        Object.prototype.hasOwnProperty.call(row, `Cell_Position_${i}`)){
      return true;
    }
  }
  return false;
}

function readNewFormatSegmentField(row, base, index){
  if (!row || typeof row !== 'object') return null;
  const forms = [base, base.toLowerCase(), base.toUpperCase()];
  for (const form of forms){
    const key = `${form}_${index}`;
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
  }
  return null;
}

function buildSegmentsNewFormat(row, answerLength){
  const segments = [];
  if (!row) return segments;
  for (let i = 1; i <= 6; i++){
    const textRaw = readNewFormatSegmentField(row, 'Text', i);
    const categoryRaw = readNewFormatSegmentField(row, 'Category', i);
    const tooltipRaw = readNewFormatSegmentField(row, 'Tooltip', i);
    const posRaw = readNewFormatSegmentField(row, 'Cell_Position', i);
    const text = textRaw != null ? String(textRaw).trim() : '';
    const tipText = tooltipRaw != null ? String(tooltipRaw).trim() : '';
    const typeStr = categoryRaw != null ? String(categoryRaw).trim() : '';
    if (!text && !tipText && !typeStr) continue;
    const { type, category } = interpretSegmentType(typeStr);
    const segment = { type, text };
    if (category) segment.category = category;
    if (tipText) segment.tooltip = tipText;
    const positions = parsePositionList(posRaw, answerLength);
    if (positions.length) segment.positions = positions;
    segment.tipNumber = i;
    segments.push(segment);
  }
  return segments;
}

function buildSegments(row, answerLength){
  if (hasNewFormatSegmentFields(row)) return buildSegmentsNewFormat(row, answerLength);
  return buildSegmentsLegacy(row, answerLength);
}

function normalisePositionKey(raw){
  if (raw == null) return '';
  let str = String(raw).trim().toUpperCase();
  if (!str) return '';
  str = str.replace(/[^A-Z0-9]+/g, ' ');
  str = str.replace(/\bACROSS\b/g, 'A');
  str = str.replace(/\bDOWN\b/g, 'D');
  str = str.replace(/\s+/g, '');
  return str;
}

function createPuzzleFromRows(key, rows){
  const entries = [];
  rows.forEach(row => {
    const pos = normalisePositionKey(row.Position || row.position);
    const layout = POSITION_MAP[pos];
    if (!layout) return;
    const { surface, enumeration } = extractClueParts(row.Clue);
    const answerRaw = String(row.Solution || '').toUpperCase();
    const answerLength = answerRaw.replace(/[^A-Z0-9]/g, '').length;
    const commentRaw = row.Setters_Comment ?? row.SettersComment ?? row.SetterComment ?? row['Setter Comment'] ?? row["Setter's Comment"] ?? row['Setter’s Comment'] ?? row['Setters Comment'];
    const setterComment = commentRaw != null ? String(commentRaw).trim() : '';

    entries.push({
      id: layout.id,
      direction: layout.direction,
      row: layout.row,
      col: layout.col,
      answer: answerRaw,
      clue: {
        surface,
        segments: buildSegments(row, answerLength)
      },
      enumeration: enumeration || null,
      setterComment
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

function groupRowsIntoPuzzles(rows){
  if (!Array.isArray(rows) || !rows.length) return [];
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

function parseSimpleWorkbook(json){
  const rows = [];
  const collectRows = arr => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (item && typeof item === 'object' && (item.Crossword != null || item.crossword != null)){
        rows.push(item);
      }
    });
  };

  if (Array.isArray(json)){
    collectRows(json);
  } else if (json && typeof json === 'object'){
    Object.keys(json).forEach(key => {
      collectRows(json[key]);
    });
  }

  return groupRowsIntoPuzzles(rows);
}

function parseWorkbook(json){
  return parseSimpleWorkbook(json);
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
  totalHintsUsed = 0;
  usedAnyReveal = false;
  updateCompletionUi(false);
  if (shareModal) shareModal.hidden = true;
  if (copyToast) copyToast.hidden = true;
  if (resultsBody) resultsBody.innerHTML = '';
  completionMessage = null;
  applyCompletionMessage(null);
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
  refreshFlowerIcons();
}

function useFallbackPuzzle(){
  puzzles = [{
    id: 'fallback',
    title: 'Fallback Puzzle',
    grid: cloneGridTemplate(),
    entries: [
      { id: '1A', direction: 'across', row: 0, col: 0, answer: 'DISCO', clue: { surface: 'Dance floor genre', segments: [] }, enumeration: '5', setterComment: '' },
      { id: '2A', direction: 'across', row: 2, col: 0, answer: 'INANE', clue: { surface: 'Silly or senseless', segments: [] }, enumeration: '5', setterComment: '' },
      { id: '3A', direction: 'across', row: 4, col: 0, answer: 'TAROT', clue: { surface: 'Cards for fortunes', segments: [] }, enumeration: '5', setterComment: '' },
      { id: '1D', direction: 'down', row: 0, col: 0, answer: 'DRIFT', clue: { surface: 'Move with the tide', segments: [] }, enumeration: '5', setterComment: '' },
      { id: '2D', direction: 'down', row: 0, col: 2, answer: 'STAIR', clue: { surface: 'Single step', segments: [] }, enumeration: '5', setterComment: '' },
      { id: '3D', direction: 'down', row: 0, col: 4, answer: 'OVERT', clue: { surface: 'Plain to see', segments: [] }, enumeration: '5', setterComment: '' }
    ]
  }];
  currentPuzzleIndex = 0;
  populatePuzzleSelect();
  loadPuzzleByIndex(0);
}

function loadCrosswordsFromFile(file){
  if (!file){
    console.error('No crossword data file specified; using fallback data.');
    useFallbackPuzzle();
    return;
  }

  fetch(file)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load ${file}: ${r.status}`);
      return r.json();
    })
    .then(json => {
      const parsed = parseWorkbook(json);
      if (!parsed.length) throw new Error('No crossword data found in workbook');
      puzzles = parsed;
      currentPuzzleIndex = 0;
      populatePuzzleSelect();
      loadPuzzleByIndex(0);
    })
    .catch(err => {
      console.error(`Failed to load crosswords from ${file}:`, err);
      useFallbackPuzzle();
    });
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

  loadCrosswordsFromFile(DATA_FILE);
});
