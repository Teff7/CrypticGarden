// Main game logic; starts directly in game view // Comment giving context; kept with an added plain-language note.
const DATA_FILE = 'Crosswords_new_format_27_10_2025.json'; // Defines the constant DATA_FILE with the given value.
// Blank line preserved for readability.
// Elements // Comment giving context; kept with an added plain-language note.
const welcome = document.getElementById('welcome'); // may be null (welcome removed) // Creates a constant for reuse later in the script.
const game = document.getElementById('game'); // Caches the DOM element with id 'game' in the constant game.
const gridEl = document.getElementById('grid'); // Caches the DOM element with id 'grid' in the constant gridEl.
const clueHeaderEl = document.getElementById('clueHeader'); // Caches the DOM element with id 'clueHeader' in the constant clueHeaderEl.
const clueTextEl = document.getElementById('clueText'); // Caches the DOM element with id 'clueText' in the constant clueTextEl.
const puzzleSelect = document.getElementById('puzzleSelect'); // Caches the DOM element with id 'puzzleSelect' in the constant puzzleSelect.
const puzzleDate = document.getElementById('puzzleDate'); // Caches the DOM element with id 'puzzleDate' in the constant puzzleDate.
const mobileInput = document.getElementById('mobileInput'); // Caches the DOM element with id 'mobileInput' in the constant mobileInput.
const mobileKeyboard = document.getElementById('mobileKeyboard'); // Caches the DOM element with id 'mobileKeyboard' in the constant mobileKeyboard.
// Blank line preserved for readability.
// Top menu removed // Comment giving context; kept with an added plain-language note.
const topMenuWrap = document.getElementById('topMenuWrap'); // Caches the DOM element with id 'topMenuWrap' in the constant topMenuWrap.
const btnMenu = document.getElementById('btnMenu'); // Caches the DOM element with id 'btnMenu' in the constant btnMenu.
const menuPanel = document.getElementById('menuPanel'); // Caches the DOM element with id 'menuPanel' in the constant menuPanel.
const menuHelp = document.getElementById('menuHelp'); // Caches the DOM element with id 'menuHelp' in the constant menuHelp.
const menuRestart = document.getElementById('menuRestart'); // Caches the DOM element with id 'menuRestart' in the constant menuRestart.
const hintDropdown = document.getElementById('hintDropdown'); // Caches the DOM element with id 'hintDropdown' in the constant hintDropdown.
// Blank line preserved for readability.
// Help + Hints // Comment giving context; kept with an added plain-language note.
const btnHelp = document.getElementById('btnHelp'); // was on welcome; may be null // Creates a constant for reuse later in the script.
const btnHelpGame = document.getElementById('btnHelpGame'); // may be null // Creates a constant for reuse later in the script.
const btnHelpBottom = document.getElementById('btnHelpBottom'); // Caches the DOM element with id 'btnHelpBottom' in the constant btnHelpBottom.
const helpModal = document.getElementById('helpModal'); // Caches the DOM element with id 'helpModal' in the constant helpModal.
const helpClose = document.getElementById('helpClose'); // Caches the DOM element with id 'helpClose' in the constant helpClose.
// Blank line preserved for readability.
const btnHints = document.getElementById('btnHints'); // Caches the DOM element with id 'btnHints' in the constant btnHints.
const hintMenu = document.getElementById('hintMenu'); // Caches the DOM element with id 'hintMenu' in the constant hintMenu.
const btnHintDef = document.getElementById('hintDef'); // Caches the DOM element with id 'hintDef' in the constant btnHintDef.
const btnHintLetter = document.getElementById('hintLetter'); // Caches the DOM element with id 'hintLetter' in the constant btnHintLetter.
const btnHintAnalyse = document.getElementById('hintWordplay'); // Caches the DOM element with id 'hintWordplay' in the constant btnHintAnalyse.
// Blank line preserved for readability.
const btnBack = document.getElementById('btnBack'); // Caches the DOM element with id 'btnBack' in the constant btnBack.
// Blank line preserved for readability.
// Additional controls // Comment giving context; kept with an added plain-language note.
const btnGiveUp = document.getElementById('btnGiveUp'); // Caches the DOM element with id 'btnGiveUp' in the constant btnGiveUp.
// Blank line preserved for readability.
// Share modal elements // Comment giving context; kept with an added plain-language note.
const shareModal = document.getElementById('shareModal'); // Caches the DOM element with id 'shareModal' in the constant shareModal.
const shareClose = document.getElementById('shareClose'); // Caches the DOM element with id 'shareClose' in the constant shareClose.
const shareGrid = document.getElementById('shareGrid'); // Caches the DOM element with id 'shareGrid' in the constant shareGrid.
const resultsBody = document.getElementById('resultsBody'); // Caches the DOM element with id 'resultsBody' in the constant resultsBody.
const resultsHeading = document.getElementById('shareHeading'); // Caches the DOM element with id 'shareHeading' in the constant resultsHeading.
const resultsTranslation = document.getElementById('shareSubheading'); // Caches the DOM element with id 'shareSubheading' in the constant resultsTranslation.
const btnViewResult = document.getElementById('btnViewResult'); // Caches the DOM element with id 'btnViewResult' in the constant btnViewResult.
const btnCopyResult = document.getElementById('copyResult'); // Caches the DOM element with id 'copyResult' in the constant btnCopyResult.
const copyToast = document.getElementById('copyToast'); // Caches the DOM element with id 'copyToast' in the constant copyToast.
// Blank line preserved for readability.
const NO_COMMENT_TEXT = '(No setter\u2019s comment provided)'; // Defines the constant NO_COMMENT_TEXT with the given value.
const CELEBRATION_MESSAGES = [ // Initialises the array CELEBRATION_MESSAGES so it can collect related values later.
  { mi: 'Ka pai!', en: 'Good job!' }, // Adds an object entry within the surrounding array.
  { mi: 'Tino pai!', en: 'Very good!' }, // Adds an object entry within the surrounding array.
  { mi: 'M\u012bharo!', en: 'Amazing!' }, // Adds an object entry within the surrounding array.
  { mi: 'Tau k\u0113!', en: 'Awesome!' }, // Adds an object entry within the surrounding array.
  { mi: 'Ka rawe!', en: 'Excellent!' } // Performs part of the game logic; see surrounding context for details.
]; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
const mobileBehaviours = createMobileBehaviours(); // Defines the constant mobileBehaviours with the given value.
// Blank line preserved for readability.
let puzzle = null; // Defines the variable puzzle with the given value.
let grid = []; // Initialises the array grid so it can collect related values later.
let cellMap = new Map(); // Creates a new Map instance and keeps it in the variable cellMap.
let entries = []; // Initialises the array entries so it can collect related values later.
let currentEntry = null; // Defines the variable currentEntry with the given value.
let activeCellKey = null; // Defines the variable activeCellKey with the given value.
let lastClickedCellKey = null; // Defines the variable lastClickedCellKey with the given value.
const dirToggle = new Map(); // Creates a new Map instance and keeps it in the constant dirToggle.
let puzzleFinished = false; // Defines the variable puzzleFinished with the given value.
let puzzles = []; // Initialises the array puzzles so it can collect related values later.
let currentPuzzleIndex = 0; // Defines the variable currentPuzzleIndex with the given value.
let activeTooltipTarget = null; // Defines the variable activeTooltipTarget with the given value.
let clueTooltipEl = null; // Defines the variable clueTooltipEl with the given value.
let tooltipHandlersBound = false; // Defines the variable tooltipHandlersBound with the given value.
let hintPromptEl = null; // Defines the variable hintPromptEl with the given value.
let hintPromptTimeout = null; // Defines the variable hintPromptTimeout with the given value.
let hintPromptDismissHandler = null; // Defines the variable hintPromptDismissHandler with the given value.
let hintPromptShown = false; // Defines the variable hintPromptShown with the given value.
let hintPromptViewportHandler = null; // Defines the variable hintPromptViewportHandler with the given value.
let skipTooltipPointerDownId = null; // Defines the variable skipTooltipPointerDownId with the given value.
let tooltipHighlightCells = []; // Initialises the array tooltipHighlightCells so it can collect related values later.
let completionMessage = null; // Defines the variable completionMessage with the given value.
// Blank line preserved for readability.
const TIP = { // Starts defining the object literal assigned to the constant TIP.
  acrostic: 'Take first letters.', // Gives the tip text for acrostic clues.
  hidden: 'Look within the fodder.', // Gives the tip text for hidden word clues.
  anagram: 'Shuffle the letters.', // Gives the tip text for anagram clues.
  deletion: 'Remove letters.', // Gives the tip text for deletion clues.
  charade: 'Build from parts.', // Gives the tip text for charade clues.
  lit: 'Whole clue is both definition and wordplay.', // Provides the tip for &lit clues.
  container: 'Put one thing inside another.', // Gives the tip text for container clues.
  reversal: 'Read the letters the other way.', // Gives the tip text for reversal clues.
  homophone: 'Sounds like another word.', // Gives the tip text for homophone clues.
  double: 'Two straight definitions.', // Gives the tip text for double definition clues.
  spoonerism: 'Swap the starting sounds.', // Provides the tip for spoonerism clues.
  substitution: 'Swap one letter for another.', // Provides the tip for substitution clues.
  selection: 'Pick specific letters.' // Provides the tip for selection clues.
}; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
const GRID_TEMPLATE = { // Starts defining the object literal assigned to the constant GRID_TEMPLATE.
  rows: 5, // Specifies the number of rows in the grid template.
  cols: 5, // Specifies the number of columns in the grid template.
  blocks: [[1, 1], [1, 3], [3, 1], [3, 3]], // Lists the coordinates of black squares in the template.
  numbers: { // Provides starting numbers for clues in the template.
    all: [[0, 0, '1'], [0, 2, '2'], [0, 4, '3'], [2, 0, '2'], [4, 0, '3']] // Holds the list of numbered cell definitions.
  } // Closes the current block scope.
}; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
const POSITION_MAP = { // Starts defining the object literal assigned to the constant POSITION_MAP.
  '1A': { id: '1A', direction: 'across', row: 0, col: 0 }, // Provides the grid coordinates and orientation for clue 1A.
  '2A': { id: '2A', direction: 'across', row: 2, col: 0 }, // Provides the grid coordinates and orientation for clue 2A.
  '3A': { id: '3A', direction: 'across', row: 4, col: 0 }, // Provides the grid coordinates and orientation for clue 3A.
  '1D': { id: '1D', direction: 'down', row: 0, col: 0 }, // Provides the grid coordinates and orientation for clue 1D.
  '2D': { id: '2D', direction: 'down', row: 0, col: 2 }, // Provides the grid coordinates and orientation for clue 2D.
  '3D': { id: '3D', direction: 'down', row: 0, col: 4 } // Provides the grid coordinates and orientation for clue 3D.
}; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
const POSITION_ORDER = ['1A', '2A', '3A', '1D', '2D', '3D']; // Initialises the array POSITION_ORDER so it can collect related values later.
// Blank line preserved for readability.
// Mapping from clue numbers to their highlight colours. Both the across and // Comment giving context; kept with an added plain-language note.
// down clues with the same number share a colour. // Comment giving context; kept with an added plain-language note.
const NUMBER_COLOURS = { '1': 'green', '2': 'yellow', '3': 'purple' }; // Starts defining the object literal assigned to the constant NUMBER_COLOURS.
// Blank line preserved for readability.
// Actual colour values used when rendering the grid.  These are fairly light so // Comment giving context; kept with an added plain-language note.
// that the black text remains legible over them. // Comment giving context; kept with an added plain-language note.
const BASE_COLOUR_VALUES = { // Starts defining the object literal assigned to the constant BASE_COLOUR_VALUES.
  // Use slightly more vibrant shades so solved clues stand out. // Comment giving context; kept with an added plain-language note.
  green: '#7be87b', // Sets the green property on this object.
  yellow: '#ffe74d', // Sets the yellow property on this object.
  purple: '#c99cff' // Sets the purple property on this object.
}; // Performs part of the game logic; see surrounding context for details.
const HINT_COLOUR_VALUE = BASE_COLOUR_VALUES.green; // Defines the constant HINT_COLOUR_VALUE with the given value.
// Temporary highlight colour for other cells in the active entry // Comment giving context; kept with an added plain-language note.
const ACTIVE_ENTRY_BG = '#3c3c3c'; // Defines the constant ACTIVE_ENTRY_BG with the given value.
// Blank line preserved for readability.
function key(r,c){ return `${r},${c}`; } // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
function isMobileTouchActive(){ // Declares the function isMobileTouchActive with no parameters.
  return document.body.classList.contains('mobile-touch'); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
// ----- Grid build ----- // Comment giving context; kept with an added plain-language note.
function buildGrid(){ // Declares the function buildGrid with no parameters.
  const { rows, cols, blocks = [], numbers = {} } = puzzle.grid; // Creates a constant for reuse later in the script.
  const blockSet = new Set(blocks.map(([r,c]) => key(r,c))); // Creates a new Set instance and keeps it in the constant blockSet.
  gridEl.innerHTML = ''; // Sets innerHTML on gridEl to '' so the UI reflects the latest state.
  grid = []; // Performs part of the game logic; see surrounding context for details.
  cellMap.clear(); // Calls the clear method on cellMap with no arguments.
// Blank line preserved for readability.
  for (let r=0;r<rows;r++){ // Begins a loop that will iterate multiple times.
    const rowArr = []; // Initialises the array rowArr so it can collect related values later.
    for (let c=0;c<cols;c++){ // Begins a loop that will iterate multiple times.
      const k = key(r,c); // Defines the constant k with the given value.
      const cell = { // Starts defining the object literal assigned to the constant cell.
        r,c, // Continues the current list or object literal.
        block:blockSet.has(k), // Sets the block property on this object.
        letter:'', // Sets the letter property on this object.
        // baseColour: "none" until a clue covering this cell is solved. // Comment giving context; kept with an added plain-language note.
        baseColour: 'none', // Sets the baseColour property on this object.
        // isGrey marks whether a hint highlight has touched this cell. // Comment giving context; kept with an added plain-language note.
        isGrey: false, // Sets the isGrey property on this object.
// Blank line preserved for readability.
        // locked letters cannot be overwritten once the clue is solved. // Comment giving context; kept with an added plain-language note.
        locked: false, // Sets the locked property on this object.
        entries:[], // Sets the entries property on this object.
        el:document.createElement('div'), // Sets the el property on this object.
        nums:[] // Sets the nums property on this object.
      }; // Performs part of the game logic; see surrounding context for details.
      cell.el.className = 'cell' + (cell.block ? ' block' : ''); // Sets className on cell.el to 'cell' + (cell.block ? ' block' : '') so the UI reflects the latest state.
      cell.el.setAttribute('role','gridcell'); // Calls the setAttribute method on cell.el with 'role','gridcell'.
      if (!cell.block) cell.el.addEventListener('click', () => handleCellClick(k)); // Starts a conditional check and runs the block when the condition is true.
      gridEl.appendChild(cell.el); // Calls the appendChild method on gridEl with cell.el.
      rowArr.push(cell); // Calls the push method on rowArr with cell.
      cellMap.set(k, cell); // Calls the set method on cellMap with k, cell.
    } // Closes the current block scope.
    grid.push(rowArr); // Calls the push method on grid with rowArr.
  } // Closes the current block scope.
// Blank line preserved for readability.
  // Numbers (if present) // Comment giving context; kept with an added plain-language note.
  const all = numbers.all || []; // Defines the constant all with the given value.
  all.forEach(([r,c,label]) => { // Performs part of the game logic; see surrounding context for details.
    const cell = cellMap.get(key(r,c)); // Defines the constant cell with the given value.
    if (!cell || cell.block) return; // Starts a conditional check and runs the block when the condition is true.
    cell.nums.push(String(label)); // Calls the push method on cell.nums with String(label).
    const numEl = document.createElement('div'); // Defines the constant numEl with the given value.
    numEl.className = 'num'; // Sets className on numEl to 'num' so the UI reflects the latest state.
    numEl.textContent = String(label); // Sets textContent on numEl to String(label) so the UI reflects the latest state.
    cell.el.appendChild(numEl); // Calls the appendChild method on cell.el with numEl.
  }); // Ends the current callback or object literal and closes the surrounding block.
} // Closes the current block scope.
// Blank line preserved for readability.
function placeEntries(){ // Declares the function placeEntries with no parameters.
  entries = (puzzle.entries||[]).map(e => ({ // Performs part of the game logic; see surrounding context for details.
    id: e.id, // Stores the clue identifier for this entry.
    direction: e.direction, // 'across'|'down' // Notes whether the entry runs across or down.
    row: e.row, // Records the starting row for this entry.
    col: e.col, // Records the starting column for this entry.
    answer: (e.answer || '').toUpperCase(), // Stores the correct answer text for the entry.
    clue: e.clue, // Holds the structured clue data for the entry.
    setterComment: e.setterComment || '', // Keeps the setter comment associated with the entry.
    enumeration: e.enumeration || null, // Stores the enumeration hint for the entry length pattern.
    cells: [], // Initialises the array that will hold the cell objects for this entry.
    iActive: 0, // Tracks the index of the active cell within this entry.
    // Track whether the clue has been solved. // Comment giving context; kept with an added plain-language note.
    status: 'unsolved', // Tracks whether the entry is unsolved or solved.
    // Remember which hint overlays should be shown when the clue regains focus. // Comment giving context; kept with an added plain-language note.
    hintState: { // Stores which hints should appear when the entry is revisited.
      definition: false, // Marks whether the definition hint is showing.
      analyse: false // Marks whether the annotation hint is showing.
    } // Closes the current block scope.
  })); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  entries.forEach(ent => { // Performs part of the game logic; see surrounding context for details.
    for (let i=0;i<ent.answer.length;i++){ // Begins a loop that will iterate multiple times.
      const r = ent.row + (ent.direction==='down' ? i : 0); // Defines the constant r with the given value.
      const c = ent.col + (ent.direction==='across' ? i : 0); // Defines the constant c with the given value.
      const cell = cellMap.get(key(r,c)); // Defines the constant cell with the given value.
      if (!cell || cell.block) continue; // Starts a conditional check and runs the block when the condition is true.
      ent.cells.push(cell); // Calls the push method on ent.cells with cell.
      cell.entries.push(ent); // Calls the push method on cell.entries with ent.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
} // Closes the current block scope.
// Blank line preserved for readability.
// ----- Events ----- // Comment giving context; kept with an added plain-language note.
function entryMatchesAnswer(ent){ // Declares the function entryMatchesAnswer that accepts ent.
  if (!ent) return false; // Starts a conditional check and runs the block when the condition is true.
  const guess = ent.cells.map(c => c.letter || '').join('').toUpperCase(); // Defines the constant guess with the given value.
  return guess === String(ent.answer || '').toUpperCase(); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function isEntrySolved(ent){ // Declares the function isEntrySolved that accepts ent.
  if (!ent) return false; // Starts a conditional check and runs the block when the condition is true.
  return entryMatchesAnswer(ent); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
// Return the next unsolved entry after the given index, wrapping around. // Comment giving context; kept with an added plain-language note.
function findNextUnsolvedEntry(startIdx){ // Declares the function findNextUnsolvedEntry that accepts startIdx.
  for (let i = 1; i <= entries.length; i++){ // Begins a loop that will iterate multiple times.
    const ent = entries[(startIdx + i) % entries.length]; // Defines the constant ent with the given value.
    if (!isEntrySolved(ent)) return ent; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
  return null; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
// Return the highlight colour for a given clue id. // Comment giving context; kept with an added plain-language note.
function colourForClue(id){ // Declares the function colourForClue that accepts id.
  const num = (id.match(/^\d+/) || [])[0]; // Defines the constant num with the given value.
  return NUMBER_COLOURS[num] || null; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
// Called when a clue is solved.  Colours the cells of the clue according to the // Comment giving context; kept with an added plain-language note.
// mapping above but never overwrites an existing baseColour. // Comment giving context; kept with an added plain-language note.
function onClueSolved(clueId){ // Declares the function onClueSolved that accepts clueId.
  const ent = entries.find(e => e.id === clueId); // Defines the constant ent with the given value.
  if (!ent || ent.status === 'solved') return; // Starts a conditional check and runs the block when the condition is true.
  ent.status = 'solved'; // Sets status on ent to 'solved' so the UI reflects the latest state.
  const colour = colourForClue(clueId); // Defines the constant colour with the given value.
// Blank line preserved for readability.
  ent.cells.forEach(cell => { // Performs part of the game logic; see surrounding context for details.
    if (colour && cell.baseColour === 'none') cell.baseColour = colour; // Starts a conditional check and runs the block when the condition is true.
    // lock the cell so its letter cannot be changed // Comment giving context; kept with an added plain-language note.
    cell.locked = true; // Sets locked on cell to true so the UI reflects the latest state.
  }); // Ends the current callback or object literal and closes the surrounding block.
  renderLetters(); // Calls a function with the specified arguments.
  checkForCompletion(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  if (colour){ // Starts a conditional check and runs the block when the condition is true.
    ent.cells.forEach(cell => { // Performs part of the game logic; see surrounding context for details.
      if (cell.baseColour === 'none') cell.baseColour = colour; // Starts a conditional check and runs the block when the condition is true.
    }); // Ends the current callback or object literal and closes the surrounding block.
  } // Closes the current block scope.
  renderLetters(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  if (!puzzleFinished && currentEntry && currentEntry.id === ent.id){ // Starts a conditional check and runs the block when the condition is true.
    const idx = entries.indexOf(ent); // Defines the constant idx with the given value.
    const next = findNextUnsolvedEntry(idx); // Defines the constant next with the given value.
    if (next) setCurrentEntry(next); // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
// Blank line preserved for readability.
} // Closes the current block scope.
// Blank line preserved for readability.
// Called when a hint is used on a clue.  For non reveal-letter hints we simply // Comment giving context; kept with an added plain-language note.
// highlight a random cell.  For reveal-letter hints we also fill in the correct // Comment giving context; kept with an added plain-language note.
// letter for one not-yet-correct cell. // Comment giving context; kept with an added plain-language note.
function onHintUsed(clueId, type){ // Declares the function onHintUsed that accepts clueId, type.
  const ent = entries.find(e => e.id === clueId); // Defines the constant ent with the given value.
// Blank line preserved for readability.
  if (!ent || ent.status === 'solved') return; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  if (!ent) return; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  if (!hintPromptShown && type === 'analyse'){ // Starts a conditional check and runs the block when the condition is true.
    const hasInteractiveTips = !!(ent.clue && Array.isArray(ent.clue.segments) && ent.clue.segments.some(seg => seg && (seg.tooltip || (seg.category && TIP[seg.category])))); // Defines the constant hasInteractiveTips with the given value.
    if (hasInteractiveTips){ // Starts a conditional check and runs the block when the condition is true.
      showHintPrompt(); // Calls a function with the specified arguments.
      hintPromptShown = true; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
  } // Closes the current block scope.
// Blank line preserved for readability.
// Blank line preserved for readability.
  if (type === 'reveal-letter'){ // Starts a conditional check and runs the block when the condition is true.
    const candidates = ent.cells // Creates a constant for reuse later in the script.
      .map((c,i) => ({ cell:c, idx:i })) // Performs part of the game logic; see surrounding context for details.
      .filter(({cell, idx}) => (cell.letter || '').toUpperCase() !== ent.answer[idx]); // Calls a function with the specified arguments.
    if (!candidates.length) return; // Starts a conditional check and runs the block when the condition is true.
    const { cell, idx } = candidates[Math.floor(Math.random()*candidates.length)]; // Creates a constant for reuse later in the script.
    cell.letter = ent.answer[idx]; // Sets letter on cell to ent.answer[idx] so the UI reflects the latest state.
    cell.isGrey = true; // Sets isGrey on cell to true so the UI reflects the latest state.
    ent.iActive = idx; // Sets iActive on ent to idx so the UI reflects the latest state.
    activeCellKey = key(cell.r, cell.c); // Calls a function with the specified arguments.
// Blank line preserved for readability.
    // Check both this entry and any crossing entry in case the revealed // Comment giving context; kept with an added plain-language note.
    // letter completes another clue. // Comment giving context; kept with an added plain-language note.
    cell.entries.forEach(checkIfSolved); // Calls the forEach method on cell.entries with checkIfSolved.
// Blank line preserved for readability.
  } else { // Provides the alternate branch of a conditional.
    const candidates = ent.cells.filter(c => !c.isGrey); // Defines the constant candidates with the given value.
    const cell = (candidates.length // Creates a constant for reuse later in the script.
      ? candidates[Math.floor(Math.random()*candidates.length)] // Performs part of the game logic; see surrounding context for details.
      : ent.cells[Math.floor(Math.random()*ent.cells.length)]); // Calls a function with the specified arguments.
    cell.isGrey = true; // Sets isGrey on cell to true so the UI reflects the latest state.
// Blank line preserved for readability.
    // Highlighting doesn't change letters, but the clue might already be correct. // Comment giving context; kept with an added plain-language note.
    checkIfSolved(ent); // Calls a function with the specified arguments.
  } // Closes the current block scope.
  renderLetters(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function checkIfSolved(ent){ // Declares the function checkIfSolved that accepts ent.
  if (!ent || ent.status === 'solved') return; // Starts a conditional check and runs the block when the condition is true.
  if (entryMatchesAnswer(ent)) onClueSolved(ent.id); // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
// Check whether every cell matches its answer; if so, trigger completion. // Comment giving context; kept with an added plain-language note.
function checkForCompletion(){ // Declares the function checkForCompletion with no parameters.
  if (puzzleFinished) return; // Starts a conditional check and runs the block when the condition is true.
  const done = entries.every(ent => // Creates a constant for reuse later in the script.
    ent.cells.every((cell, idx) => (cell.letter || '').toUpperCase() === ent.answer[idx]) // Performs part of the game logic; see surrounding context for details.
  ); // Calls a function with the specified arguments.
  if (done){ // Starts a conditional check and runs the block when the condition is true.
    puzzleFinished = true; // Performs part of the game logic; see surrounding context for details.
    onPuzzleComplete(); // Calls a function with the specified arguments.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function pickCelebrationMessage(){ // Declares the function pickCelebrationMessage with no parameters.
  if (!CELEBRATION_MESSAGES.length) return null; // Starts a conditional check and runs the block when the condition is true.
  const index = Math.floor(Math.random() * CELEBRATION_MESSAGES.length); // Defines the constant index with the given value.
  return CELEBRATION_MESSAGES[index]; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function applyCompletionMessage(message){ // Declares the function applyCompletionMessage that accepts message.
  if (resultsHeading){ // Starts a conditional check and runs the block when the condition is true.
    resultsHeading.textContent = message && message.mi ? message.mi : 'Crossword results'; // Sets textContent on resultsHeading to message && message.mi ? message.mi : 'Crossword results' so the UI reflects the latest state.
  } // Closes the current block scope.
  if (resultsTranslation){ // Starts a conditional check and runs the block when the condition is true.
    if (message && message.en){ // Starts a conditional check and runs the block when the condition is true.
      resultsTranslation.textContent = message.en; // Sets textContent on resultsTranslation to message.en so the UI reflects the latest state.
      resultsTranslation.hidden = false; // Sets hidden on resultsTranslation to false so the UI reflects the latest state.
    } else { // Provides the alternate branch of a conditional.
      resultsTranslation.textContent = ''; // Sets textContent on resultsTranslation to '' so the UI reflects the latest state.
      resultsTranslation.hidden = true; // Sets hidden on resultsTranslation to true so the UI reflects the latest state.
    } // Closes the current block scope.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function onPuzzleComplete(){ // Declares the function onPuzzleComplete with no parameters.
  updateCompletionUi(true); // Calls a function with the specified arguments.
  completionMessage = pickCelebrationMessage(); // Calls a function with the specified arguments.
  applyCompletionMessage(completionMessage); // Calls a function with the specified arguments.
  populateResultsModal(); // Calls a function with the specified arguments.
  renderSharePreview(); // Calls a function with the specified arguments.
  if (btnViewResult){ // Starts a conditional check and runs the block when the condition is true.
    btnViewResult.focus(); // Calls the focus method on btnViewResult with no arguments.
  } // Closes the current block scope.
  mobileBehaviours.hideKeyboard(); // Calls the hideKeyboard method on mobileBehaviours with no arguments.
  openShareModal(); // Calls a function with the specified arguments.
  finishGame(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
// Build the share preview grid shown in the modal // Comment giving context; kept with an added plain-language note.
function renderSharePreview(){ // Declares the function renderSharePreview with no parameters.
  if (!shareGrid || !puzzle || !puzzle.grid) return; // Starts a conditional check and runs the block when the condition is true.
  const { rows, cols } = puzzle.grid; // Creates a constant for reuse later in the script.
  shareGrid.innerHTML = ''; // Sets innerHTML on shareGrid to '' so the UI reflects the latest state.
  if (!rows || !cols) return; // Starts a conditional check and runs the block when the condition is true.
  shareGrid.style.gridTemplateColumns = `repeat(${cols},16px)`; // Sets gridTemplateColumns on shareGrid.style to `repeat(${cols},16px)` so the UI reflects the latest state.
  shareGrid.style.gridTemplateRows = `repeat(${rows},16px)`; // Sets gridTemplateRows on shareGrid.style to `repeat(${rows},16px)` so the UI reflects the latest state.
  for (let r = 0; r < rows; r++){ // Begins a loop that will iterate multiple times.
    for (let c = 0; c < cols; c++){ // Begins a loop that will iterate multiple times.
      const cell = grid[r][c]; // Defines the constant cell with the given value.
      const d = document.createElement('div'); // Defines the constant d with the given value.
      d.className = 'share-cell'; // Sets className on d to 'share-cell' so the UI reflects the latest state.
      let bg = '#000'; // Defines the variable bg with the given value.
      if (!cell.block){ // Starts a conditional check and runs the block when the condition is true.
        if (cell.isGrey) bg = HINT_COLOUR_VALUE; // Starts a conditional check and runs the block when the condition is true.
        else if (cell.baseColour !== 'none') bg = BASE_COLOUR_VALUES[cell.baseColour]; // Provides an alternate condition in the conditional chain.
        else bg = '#fff'; // Handles the fallback case when previous conditions failed.
      } // Closes the current block scope.
      d.style.background = bg; // Sets background on d.style to bg so the UI reflects the latest state.
      shareGrid.appendChild(d); // Calls the appendChild method on shareGrid with d.
    } // Closes the current block scope.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
// Assemble plain-text emoji grid for clipboard sharing // Comment giving context; kept with an added plain-language note.
function buildShareText(){ // Declares the function buildShareText with no parameters.
  if (!puzzle || !puzzle.grid) return ''; // Starts a conditional check and runs the block when the condition is true.
  const { rows, cols } = puzzle.grid; // Creates a constant for reuse later in the script.
  const lines = []; // Initialises the array lines so it can collect related values later.
  for (let r = 0; r < rows; r++){ // Begins a loop that will iterate multiple times.
    let line = ''; // Defines the variable line with the given value.
    for (let c = 0; c < cols; c++){ // Begins a loop that will iterate multiple times.
      const cell = grid[r][c]; // Defines the constant cell with the given value.
      let emoji = '⬛'; // Defines the variable emoji with the given value.
      if (!cell.block){ // Starts a conditional check and runs the block when the condition is true.
        if (cell.isGrey) emoji = '🟩'; // Starts a conditional check and runs the block when the condition is true.
        else if (cell.baseColour === 'green') emoji = '🟩'; // Provides an alternate condition in the conditional chain.
        else if (cell.baseColour === 'yellow') emoji = '🟨'; // Provides an alternate condition in the conditional chain.
        else if (cell.baseColour === 'purple') emoji = '🟪'; // Provides an alternate condition in the conditional chain.
        else emoji = '⬜'; // Handles the fallback case when previous conditions failed.
      } // Closes the current block scope.
      line += emoji; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
    lines.push(line); // Calls the push method on lines with line.
  } // Closes the current block scope.
  lines.push('I beat the cryptic crossword! Can you?'); // Calls the push method on lines with 'I beat the cryptic crossword! Can you?'.
  lines.push('https://cryptic-garden.vercel.app/'); // Calls the push method on lines with 'https://cryptic-garden.vercel.app/'.
  return lines.join('\n'); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
let lastFocused = null; // Defines the variable lastFocused with the given value.
function openShareModal(){ // Declares the function openShareModal with no parameters.
  if (!shareModal) return; // Starts a conditional check and runs the block when the condition is true.
  lastFocused = document.activeElement; // Performs part of the game logic; see surrounding context for details.
  shareModal.hidden = false; // Sets hidden on shareModal to false so the UI reflects the latest state.
  const focusables = shareModal.querySelectorAll('button, [href]'); // Defines the constant focusables with the given value.
  const first = focusables[0]; // Defines the constant first with the given value.
  const last = focusables[focusables.length - 1]; // Defines the constant last with the given value.
  const trap = (e) => { // Creates a constant for reuse later in the script.
    if (e.key === 'Tab'){ // Starts a conditional check and runs the block when the condition is true.
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); } // Starts a conditional check and runs the block when the condition is true.
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); } // Provides an alternate condition in the conditional chain.
    } else if (e.key === 'Escape'){ closeShareModal(); } // Performs part of the game logic; see surrounding context for details.
  }; // Performs part of the game logic; see surrounding context for details.
  shareModal.addEventListener('keydown', trap); // Calls the addEventListener method on shareModal with 'keydown', trap.
  shareModal._trap = trap; // Sets _trap on shareModal to trap so the UI reflects the latest state.
  (first || shareModal).focus(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function closeShareModal(){ // Declares the function closeShareModal with no parameters.
  if (!shareModal) return; // Starts a conditional check and runs the block when the condition is true.
  shareModal.hidden = true; // Sets hidden on shareModal to true so the UI reflects the latest state.
  if (shareModal._trap) shareModal.removeEventListener('keydown', shareModal._trap); // Starts a conditional check and runs the block when the condition is true.
  if (lastFocused) lastFocused.focus(); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  renderLetters(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function populateResultsModal(){ // Declares the function populateResultsModal with no parameters.
  if (!resultsBody) return; // Starts a conditional check and runs the block when the condition is true.
  resultsBody.innerHTML = ''; // Sets innerHTML on resultsBody to '' so the UI reflects the latest state.
  const fragment = document.createDocumentFragment(); // Defines the constant fragment with the given value.
  POSITION_ORDER.forEach(id => { // Performs part of the game logic; see surrounding context for details.
    const ent = entries.find(e => e.id === id); // Defines the constant ent with the given value.
    if (!ent) return; // Starts a conditional check and runs the block when the condition is true.
    const row = document.createElement('div'); // Defines the constant row with the given value.
    row.className = 'result-entry'; // Sets className on row to 'result-entry' so the UI reflects the latest state.
    row.setAttribute('role', 'listitem'); // Calls the setAttribute method on row with 'role', 'listitem'.
// Blank line preserved for readability.
    const label = document.createElement('span'); // Defines the constant label with the given value.
    label.className = 'result-label'; // Sets className on label to 'result-label' so the UI reflects the latest state.
    label.textContent = ent.id; // Sets textContent on label to ent.id so the UI reflects the latest state.
    row.appendChild(label); // Calls the appendChild method on row with label.
// Blank line preserved for readability.
    const answerSpan = document.createElement('span'); // Defines the constant answerSpan with the given value.
    answerSpan.className = 'result-answer'; // Sets className on answerSpan to 'result-answer' so the UI reflects the latest state.
    const strong = document.createElement('strong'); // Defines the constant strong with the given value.
    strong.textContent = ent.answer || ''; // Sets textContent on strong to ent.answer || '' so the UI reflects the latest state.
    answerSpan.appendChild(strong); // Calls the appendChild method on answerSpan with strong.
    answerSpan.appendChild(document.createTextNode(': ')); // Calls the appendChild method on answerSpan with document.createTextNode(': ').
    row.appendChild(answerSpan); // Calls the appendChild method on row with answerSpan.
// Blank line preserved for readability.
    const commentSpan = document.createElement('span'); // Defines the constant commentSpan with the given value.
    commentSpan.className = 'result-comment'; // Sets className on commentSpan to 'result-comment' so the UI reflects the latest state.
    const comment = ent.setterComment && ent.setterComment.trim() ? ent.setterComment.trim() : NO_COMMENT_TEXT; // Defines the constant comment with the given value.
    commentSpan.textContent = comment; // Sets textContent on commentSpan to comment so the UI reflects the latest state.
    row.appendChild(commentSpan); // Calls the appendChild method on row with commentSpan.
// Blank line preserved for readability.
    fragment.appendChild(row); // Calls the appendChild method on fragment with row.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  if (!fragment.childNodes.length){ // Starts a conditional check and runs the block when the condition is true.
    const fallback = document.createElement('p'); // Defines the constant fallback with the given value.
    fallback.textContent = 'Results unavailable.'; // Sets textContent on fallback to 'Results unavailable.' so the UI reflects the latest state.
    resultsBody.appendChild(fallback); // Calls the appendChild method on resultsBody with fallback.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
// Blank line preserved for readability.
  resultsBody.appendChild(fragment); // Calls the appendChild method on resultsBody with fragment.
} // Closes the current block scope.
// Blank line preserved for readability.
function updateCompletionUi(completed){ // Declares the function updateCompletionUi that accepts completed.
  if (completed){ // Starts a conditional check and runs the block when the condition is true.
    closeHintDropdown(); // Calls a function with the specified arguments.
    if (hintDropdown) hintDropdown.hidden = true; // Starts a conditional check and runs the block when the condition is true.
    if (btnGiveUp) btnGiveUp.hidden = true; // Starts a conditional check and runs the block when the condition is true.
    if (btnHelpBottom) btnHelpBottom.hidden = true; // Starts a conditional check and runs the block when the condition is true.
    if (btnViewResult){ // Starts a conditional check and runs the block when the condition is true.
      btnViewResult.hidden = false; // Sets hidden on btnViewResult to false so the UI reflects the latest state.
      btnViewResult.removeAttribute('aria-hidden'); // Calls the removeAttribute method on btnViewResult with 'aria-hidden'.
    } // Closes the current block scope.
  } else { // Provides the alternate branch of a conditional.
    if (hintDropdown) hintDropdown.hidden = false; // Starts a conditional check and runs the block when the condition is true.
    if (btnGiveUp) btnGiveUp.hidden = false; // Starts a conditional check and runs the block when the condition is true.
    if (btnHelpBottom) btnHelpBottom.hidden = false; // Starts a conditional check and runs the block when the condition is true.
    if (btnViewResult){ // Starts a conditional check and runs the block when the condition is true.
      btnViewResult.hidden = true; // Sets hidden on btnViewResult to true so the UI reflects the latest state.
      btnViewResult.setAttribute('aria-hidden', 'true'); // Calls the setAttribute method on btnViewResult with 'aria-hidden', 'true'.
    } // Closes the current block scope.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function ensureClueTooltip(){ // Declares the function ensureClueTooltip with no parameters.
  if (clueTooltipEl) return clueTooltipEl; // Starts a conditional check and runs the block when the condition is true.
  const el = document.createElement('div'); // Defines the constant el with the given value.
  el.className = 'clue-tooltip'; // Sets className on el to 'clue-tooltip' so the UI reflects the latest state.
  el.setAttribute('role', 'tooltip'); // Calls the setAttribute method on el with 'role', 'tooltip'.
  el.hidden = true; // Sets hidden on el to true so the UI reflects the latest state.
  el.addEventListener('pointerenter', () => { // Performs part of the game logic; see surrounding context for details.
    if (activeTooltipTarget) applyTooltipHighlights(activeTooltipTarget); // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
  el.addEventListener('pointerleave', (event) => { // Performs part of the game logic; see surrounding context for details.
    const next = event.relatedTarget; // Defines the constant next with the given value.
    if (next){ // Starts a conditional check and runs the block when the condition is true.
      if (activeTooltipTarget && (activeTooltipTarget === next || activeTooltipTarget.contains(next))) return; // Starts a conditional check and runs the block when the condition is true.
      if (clueTextEl && clueTextEl.contains(next)) return; // Starts a conditional check and runs the block when the condition is true.
    } // Closes the current block scope.
    hideClueTooltip(); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
  document.body.appendChild(el); // Calls the appendChild method on document.body with el.
  clueTooltipEl = el; // Performs part of the game logic; see surrounding context for details.
  return el; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function hideClueTooltip(){ // Declares the function hideClueTooltip with no parameters.
  const el = clueTooltipEl; // Defines the constant el with the given value.
  if (!el) return; // Starts a conditional check and runs the block when the condition is true.
  el.hidden = true; // Sets hidden on el to true so the UI reflects the latest state.
  activeTooltipTarget = null; // Performs part of the game logic; see surrounding context for details.
  skipTooltipPointerDownId = null; // Performs part of the game logic; see surrounding context for details.
  clearTooltipHighlights(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function clearTooltipHighlights(){ // Declares the function clearTooltipHighlights with no parameters.
  if (!tooltipHighlightCells.length) return; // Starts a conditional check and runs the block when the condition is true.
  tooltipHighlightCells.forEach(cell => { // Performs part of the game logic; see surrounding context for details.
    if (cell && cell.el) cell.el.classList.remove('tooltip-highlight'); // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
  tooltipHighlightCells = []; // Performs part of the game logic; see surrounding context for details.
} // Closes the current block scope.
// Blank line preserved for readability.
function applyTooltipHighlights(target){ // Declares the function applyTooltipHighlights that accepts target.
  clearTooltipHighlights(); // Calls a function with the specified arguments.
  if (!target || !currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  const attr = target.getAttribute('data-tip-cells'); // Defines the constant attr with the given value.
  if (!attr) return; // Starts a conditional check and runs the block when the condition is true.
  const matches = attr.match(/\d+/g) || []; // Defines the constant matches with the given value.
  if (!matches.length) return; // Starts a conditional check and runs the block when the condition is true.
  const seen = new Set(); // Creates a new Set instance and keeps it in the constant seen.
  matches.forEach(raw => { // Performs part of the game logic; see surrounding context for details.
    const pos = Number(raw); // Defines the constant pos with the given value.
    if (!Number.isFinite(pos)) return; // Starts a conditional check and runs the block when the condition is true.
    const idx = pos >= 1 ? pos - 1 : pos; // Defines the constant idx with the given value.
    if (!Number.isInteger(idx) || idx < 0 || seen.has(idx)) return; // Starts a conditional check and runs the block when the condition is true.
    seen.add(idx); // Calls the add method on seen with idx.
    const cell = currentEntry.cells[idx]; // Defines the constant cell with the given value.
    if (cell && cell.el){ // Starts a conditional check and runs the block when the condition is true.
      cell.el.classList.add('tooltip-highlight'); // Calls the add method on cell.el.classList with 'tooltip-highlight'.
      tooltipHighlightCells.push(cell); // Calls the push method on tooltipHighlightCells with cell.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
} // Closes the current block scope.
// Blank line preserved for readability.
function ensureHintPrompt(){ // Declares the function ensureHintPrompt with no parameters.
  if (hintPromptEl) return hintPromptEl; // Starts a conditional check and runs the block when the condition is true.
  const el = document.createElement('div'); // Defines the constant el with the given value.
  el.className = 'toast hint-toast'; // Sets className on el to 'toast hint-toast' so the UI reflects the latest state.
  el.id = 'hintPrompt'; // Sets id on el to 'hintPrompt' so the UI reflects the latest state.
  el.hidden = true; // Sets hidden on el to true so the UI reflects the latest state.
  el.setAttribute('role', 'status'); // Calls the setAttribute method on el with 'role', 'status'.
  el.setAttribute('aria-live', 'polite'); // Calls the setAttribute method on el with 'aria-live', 'polite'.
  el.addEventListener('pointerdown', (event) => { // Performs part of the game logic; see surrounding context for details.
    event.stopPropagation(); // Calls the stopPropagation method on event with no arguments.
    hideHintPrompt(); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
  document.body.appendChild(el); // Calls the appendChild method on document.body with el.
  hintPromptEl = el; // Performs part of the game logic; see surrounding context for details.
  return el; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function hideHintPrompt(){ // Declares the function hideHintPrompt with no parameters.
  if (!hintPromptEl) return; // Starts a conditional check and runs the block when the condition is true.
  hintPromptEl.hidden = true; // Sets hidden on hintPromptEl to true so the UI reflects the latest state.
  hintPromptEl.classList.remove('mobile-grid-overlay'); // Calls the remove method on hintPromptEl.classList with 'mobile-grid-overlay'.
  hintPromptEl.style.removeProperty('top'); // Calls the removeProperty method on hintPromptEl.style with 'top'.
  hintPromptEl.style.removeProperty('left'); // Calls the removeProperty method on hintPromptEl.style with 'left'.
  hintPromptEl.style.removeProperty('bottom'); // Calls the removeProperty method on hintPromptEl.style with 'bottom'.
  hintPromptEl.style.removeProperty('transform'); // Calls the removeProperty method on hintPromptEl.style with 'transform'.
  hintPromptEl.style.removeProperty('max-width'); // Calls the removeProperty method on hintPromptEl.style with 'max-width'.
  if (hintPromptTimeout){ // Starts a conditional check and runs the block when the condition is true.
    clearTimeout(hintPromptTimeout); // Calls a function with the specified arguments.
    hintPromptTimeout = null; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
  if (hintPromptDismissHandler){ // Starts a conditional check and runs the block when the condition is true.
    document.removeEventListener('pointerdown', hintPromptDismissHandler, true); // Calls the removeEventListener method on document with 'pointerdown', hintPromptDismissHandler, true.
    hintPromptDismissHandler = null; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
  if (hintPromptViewportHandler && window.visualViewport){ // Starts a conditional check and runs the block when the condition is true.
    window.visualViewport.removeEventListener('resize', hintPromptViewportHandler); // Calls the removeEventListener method on window.visualViewport with 'resize', hintPromptViewportHandler.
    window.visualViewport.removeEventListener('scroll', hintPromptViewportHandler); // Calls the removeEventListener method on window.visualViewport with 'scroll', hintPromptViewportHandler.
    hintPromptViewportHandler = null; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
  window.removeEventListener('resize', positionHintPrompt); // Calls the removeEventListener method on window with 'resize', positionHintPrompt.
  window.removeEventListener('scroll', positionHintPrompt, true); // Calls the removeEventListener method on window with 'scroll', positionHintPrompt, true.
} // Closes the current block scope.
// Blank line preserved for readability.
function positionHintPrompt(){ // Declares the function positionHintPrompt with no parameters.
  if (!hintPromptEl || hintPromptEl.hidden) return; // Starts a conditional check and runs the block when the condition is true.
  if (!isMobileTouchActive()){ // Starts a conditional check and runs the block when the condition is true.
    hintPromptEl.style.left = '50%'; // Sets left on hintPromptEl.style to '50%' so the UI reflects the latest state.
    hintPromptEl.style.bottom = '3.5rem'; // Sets bottom on hintPromptEl.style to '3.5rem' so the UI reflects the latest state.
    hintPromptEl.style.removeProperty('top'); // Calls the removeProperty method on hintPromptEl.style with 'top'.
    hintPromptEl.style.transform = 'translateX(-50%)'; // Sets transform on hintPromptEl.style to 'translateX(-50%)' so the UI reflects the latest state.
    hintPromptEl.style.removeProperty('max-width'); // Calls the removeProperty method on hintPromptEl.style with 'max-width'.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  if (!gridEl) return; // Starts a conditional check and runs the block when the condition is true.
  const rect = gridEl.getBoundingClientRect(); // Defines the constant rect with the given value.
  const viewport = window.visualViewport; // Defines the constant viewport with the given value.
  const viewportWidth = viewport ? viewport.width : window.innerWidth; // Defines the constant viewportWidth with the given value.
  const viewportHeight = viewport ? viewport.height : window.innerHeight; // Defines the constant viewportHeight with the given value.
  const width = Math.max(0, rect.width); // Defines the constant width with the given value.
  const left = (width ? rect.left + width / 2 : viewportWidth / 2); // Defines the constant left with the given value.
  const promptHeight = hintPromptEl.offsetHeight || 0; // Defines the constant promptHeight with the given value.
  const availableTop = Math.max(16, rect.top + 16); // Defines the constant availableTop with the given value.
  const maxTop = Math.max(16, viewportHeight - promptHeight - 16); // Defines the constant maxTop with the given value.
  const top = Math.min(maxTop, availableTop); // Defines the constant top with the given value.
  const widthConstraint = width > 0 ? Math.max(0, width - 24) : Number.POSITIVE_INFINITY; // Defines the constant widthConstraint with the given value.
  const viewportConstraint = Math.max(0, viewportWidth - 32); // Defines the constant viewportConstraint with the given value.
  const computedMaxWidth = Math.min(widthConstraint, viewportConstraint, 360); // Defines the constant computedMaxWidth with the given value.
  const maxWidth = Math.max(180, computedMaxWidth); // Defines the constant maxWidth with the given value.
  hintPromptEl.style.top = `${top}px`; // Sets top on hintPromptEl.style to `${top}px` so the UI reflects the latest state.
  hintPromptEl.style.left = `${left}px`; // Sets left on hintPromptEl.style to `${left}px` so the UI reflects the latest state.
  hintPromptEl.style.bottom = 'auto'; // Sets bottom on hintPromptEl.style to 'auto' so the UI reflects the latest state.
  hintPromptEl.style.transform = 'translateX(-50%)'; // Sets transform on hintPromptEl.style to 'translateX(-50%)' so the UI reflects the latest state.
  hintPromptEl.style.maxWidth = `${maxWidth}px`; // Sets maxWidth on hintPromptEl.style to `${maxWidth}px` so the UI reflects the latest state.
} // Closes the current block scope.
// Blank line preserved for readability.
function showHintPrompt(){ // Declares the function showHintPrompt with no parameters.
  const el = ensureHintPrompt(); // Defines the constant el with the given value.
  el.textContent = 'Click/tap on the highlighted words to see your hints'; // Sets textContent on el to 'Click/tap on the highlighted words to see your hints' so the UI reflects the latest state.
  el.hidden = false; // Sets hidden on el to false so the UI reflects the latest state.
  if (isMobileTouchActive()){ // Starts a conditional check and runs the block when the condition is true.
    el.classList.add('mobile-grid-overlay'); // Calls the add method on el.classList with 'mobile-grid-overlay'.
    requestAnimationFrame(() => { // Performs part of the game logic; see surrounding context for details.
      positionHintPrompt(); // Calls a function with the specified arguments.
    }); // Ends the current callback or object literal and closes the surrounding block.
    if (!hintPromptDismissHandler){ // Starts a conditional check and runs the block when the condition is true.
      hintPromptDismissHandler = () => { // Performs part of the game logic; see surrounding context for details.
        hideHintPrompt(); // Calls a function with the specified arguments.
      }; // Performs part of the game logic; see surrounding context for details.
      document.addEventListener('pointerdown', hintPromptDismissHandler, true); // Calls the addEventListener method on document with 'pointerdown', hintPromptDismissHandler, true.
    } // Closes the current block scope.
    if (!hintPromptViewportHandler && window.visualViewport){ // Starts a conditional check and runs the block when the condition is true.
      hintPromptViewportHandler = () => { // Performs part of the game logic; see surrounding context for details.
        positionHintPrompt(); // Calls a function with the specified arguments.
      }; // Performs part of the game logic; see surrounding context for details.
      window.visualViewport.addEventListener('resize', hintPromptViewportHandler); // Calls the addEventListener method on window.visualViewport with 'resize', hintPromptViewportHandler.
      window.visualViewport.addEventListener('scroll', hintPromptViewportHandler); // Calls the addEventListener method on window.visualViewport with 'scroll', hintPromptViewportHandler.
    } // Closes the current block scope.
    window.addEventListener('resize', positionHintPrompt); // Calls the addEventListener method on window with 'resize', positionHintPrompt.
    window.addEventListener('scroll', positionHintPrompt, true); // Calls the addEventListener method on window with 'scroll', positionHintPrompt, true.
  } else { // Provides the alternate branch of a conditional.
    el.classList.remove('mobile-grid-overlay'); // Calls the remove method on el.classList with 'mobile-grid-overlay'.
    positionHintPrompt(); // Calls a function with the specified arguments.
  } // Closes the current block scope.
  if (hintPromptTimeout) clearTimeout(hintPromptTimeout); // Starts a conditional check and runs the block when the condition is true.
  hintPromptTimeout = setTimeout(() => { // Performs part of the game logic; see surrounding context for details.
    hideHintPrompt(); // Calls a function with the specified arguments.
  }, 5000); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function resetHintPrompt(){ // Declares the function resetHintPrompt with no parameters.
  hintPromptShown = false; // Performs part of the game logic; see surrounding context for details.
  hideHintPrompt(); // Calls a function with the specified arguments.
  if (hintPromptTimeout){ // Starts a conditional check and runs the block when the condition is true.
    clearTimeout(hintPromptTimeout); // Calls a function with the specified arguments.
    hintPromptTimeout = null; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
  if (hintPromptEl) hintPromptEl.hidden = true; // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
function positionClueTooltip(target){ // Declares the function positionClueTooltip that accepts target.
  if (!target){ // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  if (!document.body.contains(target)){ // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  const tooltip = ensureClueTooltip(); // Defines the constant tooltip with the given value.
  const text = target.getAttribute('data-tooltip'); // Defines the constant text with the given value.
  if (!text){ // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  tooltip.textContent = text; // Sets textContent on tooltip to text so the UI reflects the latest state.
  tooltip.hidden = false; // Sets hidden on tooltip to false so the UI reflects the latest state.
  applyTooltipHighlights(target); // Calls a function with the specified arguments.
  tooltip.style.left = '0px'; // Sets left on tooltip.style to '0px' so the UI reflects the latest state.
  tooltip.style.top = '0px'; // Sets top on tooltip.style to '0px' so the UI reflects the latest state.
  const viewport = window.visualViewport; // Defines the constant viewport with the given value.
  const viewportWidth = viewport ? viewport.width : window.innerWidth; // Defines the constant viewportWidth with the given value.
  const viewportHeight = viewport ? viewport.height : window.innerHeight; // Defines the constant viewportHeight with the given value.
  tooltip.style.maxWidth = `${Math.min(320, Math.max(0, viewportWidth - 32))}px`; // Sets maxWidth on tooltip.style to `${Math.min(320, Math.max(0, viewportWidth - 32))}px` so the UI reflects the latest state.
// Blank line preserved for readability.
  const rect = target.getBoundingClientRect(); // Defines the constant rect with the given value.
  const tipRect = tooltip.getBoundingClientRect(); // Defines the constant tipRect with the given value.
  const desiredLeft = rect.left + (rect.width / 2) - (tipRect.width / 2); // Defines the constant desiredLeft with the given value.
  const clampedLeft = Math.max(16, Math.min(viewportWidth - tipRect.width - 16, desiredLeft)); // Defines the constant clampedLeft with the given value.
  const desiredTop = rect.bottom + 8; // Defines the constant desiredTop with the given value.
  const clampedTop = Math.max(16, Math.min(viewportHeight - tipRect.height - 16, desiredTop)); // Defines the constant clampedTop with the given value.
// Blank line preserved for readability.
  tooltip.style.left = `${clampedLeft}px`; // Sets left on tooltip.style to `${clampedLeft}px` so the UI reflects the latest state.
  tooltip.style.top = `${clampedTop}px`; // Sets top on tooltip.style to `${clampedTop}px` so the UI reflects the latest state.
} // Closes the current block scope.
// Blank line preserved for readability.
function applyHintClasses(ent){ // Declares the function applyHintClasses that accepts ent.
  if (!clueTextEl) return; // Starts a conditional check and runs the block when the condition is true.
  const state = (ent && ent.hintState) || {}; // Defines the constant state with the given value.
  clueTextEl.className = 'clue'; // Sets className on clueTextEl to 'clue' so the UI reflects the latest state.
  clueTextEl.classList.toggle('help-on', !!state.definition); // Calls the toggle method on clueTextEl.classList with 'help-on', !!state.definition.
  clueTextEl.classList.toggle('annot-on', !!state.analyse); // Calls the toggle method on clueTextEl.classList with 'annot-on', !!state.analyse.
  if (!state.analyse) hideClueTooltip(); // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
function setupTooltipHandlers(){ // Declares the function setupTooltipHandlers with no parameters.
  if (!clueTextEl || tooltipHandlersBound) return; // Starts a conditional check and runs the block when the condition is true.
  tooltipHandlersBound = true; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const findTooltipTarget = (eventTarget) => { // Creates a constant for reuse later in the script.
    if (!clueTextEl.classList.contains('annot-on')) return null; // Starts a conditional check and runs the block when the condition is true.
    const candidate = eventTarget && eventTarget.closest('[data-tooltip]'); // Defines the constant candidate with the given value.
    if (!candidate) return null; // Starts a conditional check and runs the block when the condition is true.
    if (!clueTextEl.contains(candidate)) return null; // Starts a conditional check and runs the block when the condition is true.
    const tipText = candidate.getAttribute('data-tooltip'); // Defines the constant tipText with the given value.
    return tipText ? candidate : null; // Returns this value from the current function.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handlePointerOver = (event) => { // Creates a constant for reuse later in the script.
    if (isMobileTouchActive()) return; // Starts a conditional check and runs the block when the condition is true.
    const target = findTooltipTarget(event.target); // Defines the constant target with the given value.
    if (!target){ // Starts a conditional check and runs the block when the condition is true.
      if (activeTooltipTarget) hideClueTooltip(); // Starts a conditional check and runs the block when the condition is true.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    activeTooltipTarget = target; // Performs part of the game logic; see surrounding context for details.
    positionClueTooltip(target); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handlePointerOut = (event) => { // Creates a constant for reuse later in the script.
    if (isMobileTouchActive()) return; // Starts a conditional check and runs the block when the condition is true.
    if (!activeTooltipTarget) return; // Starts a conditional check and runs the block when the condition is true.
    if (event.relatedTarget && activeTooltipTarget.contains(event.relatedTarget)) return; // Starts a conditional check and runs the block when the condition is true.
    if (event.relatedTarget && event.relatedTarget.closest('[data-tooltip]') === activeTooltipTarget) return; // Starts a conditional check and runs the block when the condition is true.
    if (event.relatedTarget && clueTooltipEl && clueTooltipEl.contains(event.relatedTarget)) return; // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handlePointerDown = (event) => { // Creates a constant for reuse later in the script.
    const target = findTooltipTarget(event.target); // Defines the constant target with the given value.
    const pointerId = typeof event.pointerId === 'number' ? event.pointerId : null; // Defines the constant pointerId with the given value.
    if (target){ // Starts a conditional check and runs the block when the condition is true.
      if (isMobileTouchActive() && activeTooltipTarget === target){ // Starts a conditional check and runs the block when the condition is true.
        hideClueTooltip(); // Calls a function with the specified arguments.
        skipTooltipPointerDownId = pointerId; // Performs part of the game logic; see surrounding context for details.
        return; // Stops execution of the current function without a value.
      } // Closes the current block scope.
      activeTooltipTarget = target; // Performs part of the game logic; see surrounding context for details.
      positionClueTooltip(target); // Calls a function with the specified arguments.
      skipTooltipPointerDownId = pointerId; // Performs part of the game logic; see surrounding context for details.
    } else if (isMobileTouchActive() && activeTooltipTarget && clueTextEl.contains(event.target)){ // Performs part of the game logic; see surrounding context for details.
      hideClueTooltip(); // Calls a function with the specified arguments.
      skipTooltipPointerDownId = pointerId; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handlePointerCancel = () => { // Creates a constant for reuse later in the script.
    if (isMobileTouchActive()) return; // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handleScroll = () => { // Creates a constant for reuse later in the script.
    if (!activeTooltipTarget) return; // Starts a conditional check and runs the block when the condition is true.
    if (!document.body.contains(activeTooltipTarget)){ hideClueTooltip(); return; } // Starts a conditional check and runs the block when the condition is true.
    positionClueTooltip(activeTooltipTarget); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handlePointerLeave = (event) => { // Creates a constant for reuse later in the script.
    if (isMobileTouchActive()) return; // Starts a conditional check and runs the block when the condition is true.
    const next = event.relatedTarget; // Defines the constant next with the given value.
    if (next){ // Starts a conditional check and runs the block when the condition is true.
      if (activeTooltipTarget && (activeTooltipTarget === next || activeTooltipTarget.contains(next))) return; // Starts a conditional check and runs the block when the condition is true.
      if (clueTooltipEl && clueTooltipEl.contains(next)) return; // Starts a conditional check and runs the block when the condition is true.
    } // Closes the current block scope.
    hideClueTooltip(); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  clueTextEl.addEventListener('pointerover', handlePointerOver); // Calls the addEventListener method on clueTextEl with 'pointerover', handlePointerOver.
  clueTextEl.addEventListener('pointerout', handlePointerOut); // Calls the addEventListener method on clueTextEl with 'pointerout', handlePointerOut.
  clueTextEl.addEventListener('pointerdown', handlePointerDown); // Calls the addEventListener method on clueTextEl with 'pointerdown', handlePointerDown.
  clueTextEl.addEventListener('pointercancel', handlePointerCancel); // Calls the addEventListener method on clueTextEl with 'pointercancel', handlePointerCancel.
  clueTextEl.addEventListener('pointerleave', handlePointerLeave); // Calls the addEventListener method on clueTextEl with 'pointerleave', handlePointerLeave.
  clueTextEl.addEventListener('pointercancel', hideClueTooltip); // Calls the addEventListener method on clueTextEl with 'pointercancel', hideClueTooltip.
  window.addEventListener('scroll', handleScroll, true); // Calls the addEventListener method on window with 'scroll', handleScroll, true.
  window.addEventListener('resize', handleScroll); // Calls the addEventListener method on window with 'resize', handleScroll.
  const handleDocumentPointerDown = (event) => { // Creates a constant for reuse later in the script.
    if (skipTooltipPointerDownId !== null && event.pointerId === skipTooltipPointerDownId){ // Starts a conditional check and runs the block when the condition is true.
      skipTooltipPointerDownId = null; // Performs part of the game logic; see surrounding context for details.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    skipTooltipPointerDownId = null; // Performs part of the game logic; see surrounding context for details.
    if (!activeTooltipTarget) return; // Starts a conditional check and runs the block when the condition is true.
    const targetNode = event.target; // Defines the constant targetNode with the given value.
    if (activeTooltipTarget && activeTooltipTarget.contains(targetNode)){ // Starts a conditional check and runs the block when the condition is true.
      if (isMobileTouchActive()) hideClueTooltip(); // Starts a conditional check and runs the block when the condition is true.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    if (clueTooltipEl && clueTooltipEl.contains(targetNode)){ // Starts a conditional check and runs the block when the condition is true.
      hideClueTooltip(); // Calls a function with the specified arguments.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    if (clueTextEl.contains(targetNode)){ // Starts a conditional check and runs the block when the condition is true.
      if (isMobileTouchActive()) hideClueTooltip(); // Starts a conditional check and runs the block when the condition is true.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    hideClueTooltip(); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  document.addEventListener('pointerdown', handleDocumentPointerDown); // Calls the addEventListener method on document with 'pointerdown', handleDocumentPointerDown.
} // Closes the current block scope.
// Blank line preserved for readability.
function renderClue(ent){ // Declares the function renderClue that accepts ent.
  hideClueTooltip(); // Calls a function with the specified arguments.
  const segs = (ent.clue && ent.clue.segments) || []; // Defines the constant segs with the given value.
  const surface = (ent.clue && ent.clue.surface) || ''; // Defines the constant surface with the given value.
  let html = buildClueMarkup(surface, segs); // Defines the variable html with the given value.
  if (!html) html = escapeHtml(surface); // Starts a conditional check and runs the block when the condition is true.
  const enumeration = ent.enumeration || (ent.answer ? String(ent.answer.length) : ''); // Defines the constant enumeration with the given value.
  if (enumeration) { // Starts a conditional check and runs the block when the condition is true.
    html += ` (<span class="enumeration">${escapeHtml(enumeration)}</span>)`; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
  const dirLabel = ent.direction[0].toUpperCase() + ent.direction.slice(1); // Defines the constant dirLabel with the given value.
  const num = ent.id.match(/^\d+/)[0]; // Defines the constant num with the given value.
  clueHeaderEl.textContent = `${num} ${dirLabel}`;  // “1 Across” / “1 Down” // Performs part of the game logic; see surrounding context for details.
  clueTextEl.innerHTML = html; // Sets innerHTML on clueTextEl to html so the UI reflects the latest state.
  if (puzzleFinished && ent.hintState){ // Starts a conditional check and runs the block when the condition is true.
    ent.hintState.definition = true; // Sets definition on ent.hintState to true so the UI reflects the latest state.
    ent.hintState.analyse = true; // Sets analyse on ent.hintState to true so the UI reflects the latest state.
  } // Closes the current block scope.
  applyHintClasses(ent); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function renderLetters(){ // Declares the function renderLetters with no parameters.
  grid.flat().forEach(cell => { // Performs part of the game logic; see surrounding context for details.
    [...cell.el.childNodes].forEach(n => { // Performs part of the game logic; see surrounding context for details.
      if (n.nodeType === 1 && n.classList.contains('num')) return; // Starts a conditional check and runs the block when the condition is true.
      cell.el.removeChild(n); // Calls the removeChild method on cell.el with n.
    }); // Ends the current callback or object literal and closes the surrounding block.
    cell.el.classList.remove('active'); // Calls the remove method on cell.el.classList with 'active'.
    if (cell.block) return; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
    // Apply colouring rules.  Hint overlay takes precedence over baseColour. // Comment giving context; kept with an added plain-language note.
    let bg = '#fff'; // Defines the variable bg with the given value.
    if (cell.isGrey) bg = HINT_COLOUR_VALUE; // Starts a conditional check and runs the block when the condition is true.
    else if (cell.baseColour !== 'none') bg = BASE_COLOUR_VALUES[cell.baseColour]; // Provides an alternate condition in the conditional chain.
    cell.el.style.background = bg; // Sets background on cell.el.style to bg so the UI reflects the latest state.
    cell.el.style.color = '#000'; // keep text legible over hint colour // Performs part of the game logic; see surrounding context for details.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  grid.flat().forEach(cell => { // Performs part of the game logic; see surrounding context for details.
    if (cell.letter) { // Starts a conditional check and runs the block when the condition is true.
      const d = document.createElement('div'); // Defines the constant d with the given value.
      d.className = 'letter'; // Sets className on d to 'letter' so the UI reflects the latest state.
      d.style.display = 'grid'; // Sets display on d.style to 'grid' so the UI reflects the latest state.
      d.style.placeItems = 'center'; // Sets placeItems on d.style to 'center' so the UI reflects the latest state.
      d.style.width = '100%'; // Sets width on d.style to '100%' so the UI reflects the latest state.
      d.style.height = '100%'; // Sets height on d.style to '100%' so the UI reflects the latest state.
      d.style.fontWeight = '700'; // Sets fontWeight on d.style to '700' so the UI reflects the latest state.
      d.textContent = cell.letter; // Sets textContent on d to cell.letter so the UI reflects the latest state.
      cell.el.appendChild(d); // Calls the appendChild method on cell.el with d.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
  highlightActive(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function setCurrentEntry(ent, fromCellKey=null){ // Declares the function setCurrentEntry that accepts ent, fromCellKey=null.
  currentEntry = ent; // Performs part of the game logic; see surrounding context for details.
  if (!ent){ // Starts a conditional check and runs the block when the condition is true.
    hideClueTooltip(); // Calls a function with the specified arguments.
    mobileBehaviours.onEntryCleared(); // Calls the onEntryCleared method on mobileBehaviours with no arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  renderClue(ent); // Calls a function with the specified arguments.
  if (fromCellKey){ // Starts a conditional check and runs the block when the condition is true.
    const i = ent.cells.findIndex(c => key(c.r,c.c)===fromCellKey); // Defines the constant i with the given value.
    ent.iActive = (i>=0 ? i : 0); // Sets iActive on ent to (i>=0 ? i : 0) so the UI reflects the latest state.
  } else if (ent.iActive==null){ // Performs part of the game logic; see surrounding context for details.
    ent.iActive = 0; // Sets iActive on ent to 0 so the UI reflects the latest state.
  } // Closes the current block scope.
  if (ent.cells[ent.iActive].locked) { // Starts a conditional check and runs the block when the condition is true.
    nextCell(+1) || nextCell(-1); // Calls a function with the specified arguments.
  } // Closes the current block scope.
  const cell = ent.cells[ent.iActive]; // Defines the constant cell with the given value.
  activeCellKey = key(cell.r,cell.c); // Calls a function with the specified arguments.
  renderLetters(); // Calls a function with the specified arguments.
  mobileBehaviours.onEntryFocus(); // Calls the onEntryFocus method on mobileBehaviours with no arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function highlightActive(){ // Declares the function highlightActive with no parameters.
  if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  const active = currentEntry.cells[currentEntry.iActive]; // Defines the constant active with the given value.
  currentEntry.cells.forEach(c => { // Performs part of the game logic; see surrounding context for details.
    if (c !== active) c.el.style.background = ACTIVE_ENTRY_BG; // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (active) active.el.classList.add('active'); // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
function handleCellClick(k){ // Declares the function handleCellClick that accepts k.
  const cell = cellMap.get(k); // Defines the constant cell with the given value.
  if (!cell || cell.block) return; // Starts a conditional check and runs the block when the condition is true.
  const belongs = cell.entries || []; // Defines the constant belongs with the given value.
  if (!belongs.length) return; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  let pref = dirToggle.get(k) || 'across'; // Defines the variable pref with the given value.
  if (lastClickedCellKey === k) pref = pref==='across' ? 'down' : 'across'; // Starts a conditional check and runs the block when the condition is true.
  lastClickedCellKey = k; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  let ent = belongs.find(e => e.direction===pref) || belongs[0]; // Defines the variable ent with the given value.
// Blank line preserved for readability.
  if (ent && isEntrySolved(ent)){ // Starts a conditional check and runs the block when the condition is true.
    const alternative = belongs.find(e => !isEntrySolved(e)); // Defines the constant alternative with the given value.
    if (alternative) ent = alternative; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
// Blank line preserved for readability.
  if (!ent) return; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  if (isEntrySolved(ent)){ // Starts a conditional check and runs the block when the condition is true.
    mobileBehaviours.hideKeyboard(); // Calls the hideKeyboard method on mobileBehaviours with no arguments.
    if (!puzzleFinished) return; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
// Blank line preserved for readability.
  dirToggle.set(k, ent.direction); // Calls the set method on dirToggle with k, ent.direction.
  setCurrentEntry(ent, k); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function moveCursor(dx, dy){ // Declares the function moveCursor that accepts dx, dy.
  if (activeCellKey == null) return; // Starts a conditional check and runs the block when the condition is true.
  let [r, c] = activeCellKey.split(',').map(Number); // Calls a function with the specified arguments.
  const rows = grid.length; // Defines the constant rows with the given value.
  const cols = grid[0].length; // Defines the constant cols with the given value.
  let nr = r + dy; // Defines the variable nr with the given value.
  let nc = c + dx; // Defines the variable nc with the given value.
// Blank line preserved for readability.
  // Skip over locked cells so navigation can pass solved clues. // Comment giving context; kept with an added plain-language note.
  while (nr >= 0 && nr < rows && nc >= 0 && nc < cols){ // Starts a loop that continues while the condition stays true.
    const k = key(nr, nc); // Defines the constant k with the given value.
    const cell = cellMap.get(k); // Defines the constant cell with the given value.
    if (cell && !cell.block && !cell.locked){ // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
      const dir = dx !== 0 ? 'across' : 'down'; // Defines the constant dir with the given value.
      const ent = cell.entries.find(e => e.direction === dir) || cell.entries[0]; // Defines the constant ent with the given value.
      if (ent) setCurrentEntry(ent, k); else { activeCellKey = k; renderLetters(); } // Starts a conditional check and runs the block when the condition is true.
      lastClickedCellKey = k; // Performs part of the game logic; see surrounding context for details.
      break; // Leaves the current loop or switch case.
    } // Closes the current block scope.
    nr += dy; // Performs part of the game logic; see surrounding context for details.
    nc += dx; // Performs part of the game logic; see surrounding context for details.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function nextCell(inc){ // Declares the function nextCell that accepts inc.
  if (!currentEntry) return null; // Starts a conditional check and runs the block when the condition is true.
  let i = currentEntry.iActive; // Defines the variable i with the given value.
  do { // Performs part of the game logic; see surrounding context for details.
    i += inc; // Performs part of the game logic; see surrounding context for details.
  } while (i >= 0 && i < currentEntry.cells.length && currentEntry.cells[i].locked); // Calls a function with the specified arguments.
  if (i < 0 || i >= currentEntry.cells.length) return null; // Starts a conditional check and runs the block when the condition is true.
  currentEntry.iActive = i; // Sets iActive on currentEntry to i so the UI reflects the latest state.
  const cell = currentEntry.cells[i]; // Defines the constant cell with the given value.
  activeCellKey = key(cell.r,cell.c); // Calls a function with the specified arguments.
  return cell; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function typeChar(ch){ // Declares the function typeChar that accepts ch.
  if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  let cell = currentEntry.cells[currentEntry.iActive]; // Defines the variable cell with the given value.
  if (cell.locked){ // Starts a conditional check and runs the block when the condition is true.
    cell = nextCell(+1); // Calls a function with the specified arguments.
    if (!cell || cell.locked) return; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
  cell.letter = ch.toUpperCase(); // Sets letter on cell to ch.toUpperCase() so the UI reflects the latest state.
  // Check every entry that uses this cell so crossing clues can // Comment giving context; kept with an added plain-language note.
  // auto-solve when their final letter is entered. // Comment giving context; kept with an added plain-language note.
  cell.entries.forEach(checkIfSolved); // Calls the forEach method on cell.entries with checkIfSolved.
  nextCell(+1); // Calls a function with the specified arguments.
  renderLetters(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function backspace(){ // Declares the function backspace with no parameters.
  if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  let cell = currentEntry.cells[currentEntry.iActive]; // Defines the variable cell with the given value.
  if (cell.locked){ // Starts a conditional check and runs the block when the condition is true.
    cell = nextCell(-1); // Calls a function with the specified arguments.
    if (!cell || cell.locked) return; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
  cell.letter = ''; // Sets letter on cell to '' so the UI reflects the latest state.
  nextCell(-1); // Calls a function with the specified arguments.
  renderLetters(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function clearCurrentEntry(){ // Declares the function clearCurrentEntry with no parameters.
  if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  if (isEntrySolved(currentEntry)){ // Starts a conditional check and runs the block when the condition is true.
    mobileBehaviours.hideKeyboard(); // Calls the hideKeyboard method on mobileBehaviours with no arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
// Blank line preserved for readability.
  let cleared = false; // Defines the variable cleared with the given value.
  currentEntry.cells.forEach((cell) => { // Performs part of the game logic; see surrounding context for details.
    if (cell.locked) return; // Starts a conditional check and runs the block when the condition is true.
    if (cell.letter){ // Starts a conditional check and runs the block when the condition is true.
      cell.letter = ''; // Sets letter on cell to '' so the UI reflects the latest state.
      cleared = true; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  if (!cleared) { // Starts a conditional check and runs the block when the condition is true.
    mobileBehaviours.onEntryFocus(); // Calls the onEntryFocus method on mobileBehaviours with no arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
// Blank line preserved for readability.
  let focusIndex = currentEntry.cells.findIndex(cell => !cell.locked); // Defines the variable focusIndex with the given value.
  if (focusIndex === -1) focusIndex = 0; // Starts a conditional check and runs the block when the condition is true.
  currentEntry.iActive = focusIndex; // Sets iActive on currentEntry to focusIndex so the UI reflects the latest state.
  const first = currentEntry.cells[currentEntry.iActive]; // Defines the constant first with the given value.
  if (first) activeCellKey = key(first.r, first.c); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  currentEntry.cells.forEach(cell => cell.entries.forEach(checkIfSolved)); // Calls the forEach method on currentEntry.cells with cell => cell.entries.forEach(checkIfSolved).
  renderLetters(); // Calls a function with the specified arguments.
  mobileBehaviours.onEntryFocus(); // Calls the onEntryFocus method on mobileBehaviours with no arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function submitAnswer(){ // Declares the function submitAnswer with no parameters.
  if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
  const guess = currentEntry.cells.map(c => c.letter||' ').join('').toUpperCase(); // Defines the constant guess with the given value.
  const target = currentEntry.answer.toUpperCase(); // Defines the constant target with the given value.
  if (guess === target){ // Starts a conditional check and runs the block when the condition is true.
    onClueSolved(currentEntry.id); // Calls a function with the specified arguments.
    game.classList.add('flash-green'); // Calls the add method on game.classList with 'flash-green'.
    setTimeout(() => { // Performs part of the game logic; see surrounding context for details.
      game.classList.remove('flash-green'); // Calls the remove method on game.classList with 'flash-green'.
    }, 650); // Calls a function with the specified arguments.
    } else { // Provides the alternate branch of a conditional.
      game.classList.add('flash-red'); // Calls the add method on game.classList with 'flash-red'.
      setTimeout(() => game.classList.remove('flash-red'), 450); // Calls a function with the specified arguments.
    } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function finishGame(){ // Declares the function finishGame with no parameters.
  var fireworks = document.getElementById('fireworks'); // Caches the DOM element with id 'fireworks' in the variable fireworks.
  if (fireworks) fireworks.classList.add('on'); // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
function closeHintDropdown(){ // Declares the function closeHintDropdown with no parameters.
  if (hintDropdown) hintDropdown.classList.remove('open'); // Starts a conditional check and runs the block when the condition is true.
  if (btnHints) btnHints.setAttribute('aria-expanded', 'false'); // Starts a conditional check and runs the block when the condition is true.
  if (hintMenu) hintMenu.setAttribute('aria-hidden', 'true'); // Starts a conditional check and runs the block when the condition is true.
  mobileBehaviours.onHintMenuClosed(); // Calls the onHintMenuClosed method on mobileBehaviours with no arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
// ----- Help & hints & misc ----- // Comment giving context; kept with an added plain-language note.
function setupHandlers(){ // Declares the function setupHandlers with no parameters.
  if (puzzleSelect) puzzleSelect.addEventListener('change', () => { // Starts a conditional check and runs the block when the condition is true.
    const value = puzzleSelect.value; // Defines the constant value with the given value.
    const idx = Number(value); // Defines the constant idx with the given value.
    if (value === '' || Number.isNaN(idx) || !puzzles[idx]) return; // Starts a conditional check and runs the block when the condition is true.
    loadPuzzleByIndex(idx); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Help modal open/close // Comment giving context; kept with an added plain-language note.
  const openHelp = () => { helpModal.hidden = false; }; // Defines the constant openHelp with the given value.
  const closeHelp = () => { helpModal.hidden = true; }; // Defines the constant closeHelp with the given value.
  if (btnHelp) btnHelp.addEventListener('click', openHelp); // Starts a conditional check and runs the block when the condition is true.
  if (btnHelpGame) btnHelpGame.addEventListener('click', openHelp); // Starts a conditional check and runs the block when the condition is true.
  if (btnHelpBottom) btnHelpBottom.addEventListener('click', openHelp); // Starts a conditional check and runs the block when the condition is true.
  if (helpClose) helpClose.addEventListener('click', closeHelp); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  // Hints dropdown // Comment giving context; kept with an added plain-language note.
  if (btnHints) btnHints.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    const expanded = btnHints.getAttribute('aria-expanded') === 'true'; // Defines the constant expanded with the given value.
    if (expanded) { // Starts a conditional check and runs the block when the condition is true.
      closeHintDropdown(); // Calls a function with the specified arguments.
    } else { // Provides the alternate branch of a conditional.
      btnHints.setAttribute('aria-expanded', 'true'); // Calls the setAttribute method on btnHints with 'aria-expanded', 'true'.
      if (hintMenu) hintMenu.setAttribute('aria-hidden', 'false'); // Starts a conditional check and runs the block when the condition is true.
      if (hintDropdown) hintDropdown.classList.add('open'); // Starts a conditional check and runs the block when the condition is true.
      mobileBehaviours.onHintMenuOpened(); // Calls the onHintMenuOpened method on mobileBehaviours with no arguments.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (btnHintDef) btnHintDef.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (!currentEntry){ // Starts a conditional check and runs the block when the condition is true.
      closeHintDropdown(); // Calls a function with the specified arguments.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    const nextState = !currentEntry.hintState.definition; // Defines the constant nextState with the given value.
    currentEntry.hintState.definition = nextState; // Sets definition on currentEntry.hintState to nextState so the UI reflects the latest state.
    applyHintClasses(currentEntry); // Calls a function with the specified arguments.
    if (nextState) onHintUsed(currentEntry.id, 'definition'); // Starts a conditional check and runs the block when the condition is true.
    closeHintDropdown(); // Calls a function with the specified arguments.
    mobileBehaviours.onHintSelected(); // Calls the onHintSelected method on mobileBehaviours with no arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (btnHintLetter) btnHintLetter.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (!currentEntry){ // Starts a conditional check and runs the block when the condition is true.
      closeHintDropdown(); // Calls a function with the specified arguments.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    onHintUsed(currentEntry.id, 'reveal-letter'); // Calls a function with the specified arguments.
    closeHintDropdown(); // Calls a function with the specified arguments.
    mobileBehaviours.onHintSelected(); // Calls the onHintSelected method on mobileBehaviours with no arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (btnHintAnalyse) btnHintAnalyse.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (!currentEntry){ // Starts a conditional check and runs the block when the condition is true.
      closeHintDropdown(); // Calls a function with the specified arguments.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    const nextState = !currentEntry.hintState.analyse; // Defines the constant nextState with the given value.
    currentEntry.hintState.analyse = nextState; // Sets analyse on currentEntry.hintState to nextState so the UI reflects the latest state.
    applyHintClasses(currentEntry); // Calls a function with the specified arguments.
    if (nextState) onHintUsed(currentEntry.id, 'analyse'); // Starts a conditional check and runs the block when the condition is true.
    closeHintDropdown(); // Calls a function with the specified arguments.
    mobileBehaviours.onHintSelected(); // Calls the onHintSelected method on mobileBehaviours with no arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Top Menu dropdown — removed; guards keep this safe if elements don't exist // Comment giving context; kept with an added plain-language note.
  if (btnMenu) btnMenu.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    const expanded = btnMenu.getAttribute('aria-expanded') === 'true'; // Defines the constant expanded with the given value.
    btnMenu.setAttribute('aria-expanded', String(!expanded)); // Calls the setAttribute method on btnMenu with 'aria-expanded', String(!expanded).
    if (menuPanel) menuPanel.setAttribute('aria-hidden', String(expanded)); // Starts a conditional check and runs the block when the condition is true.
    if (topMenuWrap){ // Starts a conditional check and runs the block when the condition is true.
      if (expanded) topMenuWrap.classList.remove('open'); else topMenuWrap.classList.add('open'); // Starts a conditional check and runs the block when the condition is true.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (menuHelp) menuHelp.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (helpModal) helpModal.hidden = false; // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (menuRestart) menuRestart.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    restartGame(); // Calls a function with the specified arguments.
    if (btnMenu) btnMenu.setAttribute('aria-expanded','false'); // Starts a conditional check and runs the block when the condition is true.
    if (menuPanel) menuPanel.setAttribute('aria-hidden','true'); // Starts a conditional check and runs the block when the condition is true.
    if (topMenuWrap) topMenuWrap.classList.remove('open'); // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Reveal answer: fill the current entry with the correct letters and mark it as solved // Comment giving context; kept with an added plain-language note.
  if (btnGiveUp) btnGiveUp.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (!currentEntry) return; // Starts a conditional check and runs the block when the condition is true.
    currentEntry.cells.forEach((cell, idx) => { // Performs part of the game logic; see surrounding context for details.
      cell.letter = currentEntry.answer[idx]; // Sets letter on cell to currentEntry.answer[idx] so the UI reflects the latest state.
      // Highlight entire answer when revealed // Comment giving context; kept with an added plain-language note.
      cell.isGrey = true; // Sets isGrey on cell to true so the UI reflects the latest state.
    }); // Ends the current callback or object literal and closes the surrounding block.
    // After revealing, re-check all affected clues. // Comment giving context; kept with an added plain-language note.
    currentEntry.cells.forEach(cell => cell.entries.forEach(checkIfSolved)); // Calls the forEach method on currentEntry.cells with cell => cell.entries.forEach(checkIfSolved).
    renderLetters(); // Calls a function with the specified arguments.
    submitAnswer(); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Share modal handlers // Comment giving context; kept with an added plain-language note.
  if (shareClose) shareClose.addEventListener('click', closeShareModal); // Starts a conditional check and runs the block when the condition is true.
  if (btnCopyResult) btnCopyResult.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    const text = buildShareText(); // Defines the constant text with the given value.
    if (!text) return; // Starts a conditional check and runs the block when the condition is true.
    navigator.clipboard.writeText(text).then(() => { // Performs part of the game logic; see surrounding context for details.
      if (copyToast){ // Starts a conditional check and runs the block when the condition is true.
        copyToast.hidden = false; // Sets hidden on copyToast to false so the UI reflects the latest state.
        setTimeout(() => { copyToast.hidden = true; }, 1500); // Calls a function with the specified arguments.
      } // Closes the current block scope.
    }).catch(() => {}); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (btnViewResult) btnViewResult.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (!puzzleFinished) return; // Starts a conditional check and runs the block when the condition is true.
    populateResultsModal(); // Calls a function with the specified arguments.
    if (!completionMessage) completionMessage = pickCelebrationMessage(); // Starts a conditional check and runs the block when the condition is true.
    applyCompletionMessage(completionMessage); // Calls a function with the specified arguments.
    renderSharePreview(); // Calls a function with the specified arguments.
    btnViewResult.focus(); // Calls the focus method on btnViewResult with no arguments.
    mobileBehaviours.hideKeyboard(); // Calls the hideKeyboard method on mobileBehaviours with no arguments.
    openShareModal(); // Calls a function with the specified arguments.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Close dropdowns when clicking outside // Comment giving context; kept with an added plain-language note.
  document.addEventListener('click', (e) => { // Performs part of the game logic; see surrounding context for details.
    const t = e.target; // Defines the constant t with the given value.
    // Hints // Comment giving context; kept with an added plain-language note.
    if (hintDropdown && !hintDropdown.contains(t)){ // Starts a conditional check and runs the block when the condition is true.
      if (hintDropdown.classList.contains('open')){ // Starts a conditional check and runs the block when the condition is true.
        closeHintDropdown(); // Calls a function with the specified arguments.
      } // Closes the current block scope.
    } // Closes the current block scope.
    // Top menu // Comment giving context; kept with an added plain-language note.
    if (topMenuWrap && !topMenuWrap.contains(t)){ // Starts a conditional check and runs the block when the condition is true.
      if (topMenuWrap.classList.contains('open')){ // Starts a conditional check and runs the block when the condition is true.
        topMenuWrap.classList.remove('open'); // Calls the remove method on topMenuWrap.classList with 'open'.
        if (btnMenu) btnMenu.setAttribute('aria-expanded','false'); // Starts a conditional check and runs the block when the condition is true.
        if (menuPanel) menuPanel.setAttribute('aria-hidden','true'); // Starts a conditional check and runs the block when the condition is true.
      } // Closes the current block scope.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Back (welcome removed) — guard // Comment giving context; kept with an added plain-language note.
  if (btnBack) btnBack.addEventListener('click', () => { // Starts a conditional check and runs the block when the condition is true.
    if (game) game.hidden = true; // Starts a conditional check and runs the block when the condition is true.
    if (welcome) welcome.hidden = false; // Starts a conditional check and runs the block when the condition is true.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  // Typing // Comment giving context; kept with an added plain-language note.
  if (mobileInput) mobileInput.addEventListener('input', e => { // Starts a conditional check and runs the block when the condition is true.
    const char = e.data || e.target.value; // Defines the constant char with the given value.
    if (/^[a-zA-Z]$/.test(char)) typeChar(char); // Starts a conditional check and runs the block when the condition is true.
    e.target.value = ''; // Sets value on e.target to '' so the UI reflects the latest state.
  }); // Ends the current callback or object literal and closes the surrounding block.
  document.addEventListener('keydown', e => { // Performs part of the game logic; see surrounding context for details.
    if (/^[a-zA-Z]$/.test(e.key)) { // Starts a conditional check and runs the block when the condition is true.
      // If the hidden mobile input is focused, its own input listener // Comment giving context; kept with an added plain-language note.
      // already handled this character. Avoid duplicating it. // Comment giving context; kept with an added plain-language note.
      if (e.target !== mobileInput) typeChar(e.key); // Starts a conditional check and runs the block when the condition is true.
    } else if (e.key === 'Backspace'){ e.preventDefault(); backspace(); } // Performs part of the game logic; see surrounding context for details.
    else if (e.key === 'Enter'){ submitAnswer(); } // Provides an alternate condition in the conditional chain.
    else if (e.key === 'ArrowLeft'){ e.preventDefault(); moveCursor(-1,0); } // Provides an alternate condition in the conditional chain.
    else if (e.key === 'ArrowRight'){ e.preventDefault(); moveCursor(1,0); } // Provides an alternate condition in the conditional chain.
    else if (e.key === 'ArrowUp'){ e.preventDefault(); moveCursor(0,-1); } // Provides an alternate condition in the conditional chain.
    else if (e.key === 'ArrowDown'){ e.preventDefault(); moveCursor(0,1); } // Provides an alternate condition in the conditional chain.
  }); // Ends the current callback or object literal and closes the surrounding block.
} // Closes the current block scope.
function focusFirstCell(){ // Declares the function focusFirstCell with no parameters.
  const start = key(0,0); // Defines the constant start with the given value.
  const cell = cellMap.get(start); // Defines the constant cell with the given value.
  if (cell && !cell.block){ // Starts a conditional check and runs the block when the condition is true.
    handleCellClick(start); // Calls a function with the specified arguments.
  } else if (entries[0]){ // Performs part of the game logic; see surrounding context for details.
    setCurrentEntry(entries[0]); // Calls a function with the specified arguments.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function restartGame(){ // Declares the function restartGame with no parameters.
  entries.forEach(ent => { // Performs part of the game logic; see surrounding context for details.
    ent.status = 'unsolved'; // Sets status on ent to 'unsolved' so the UI reflects the latest state.
    ent.cells.forEach(c => { // Performs part of the game logic; see surrounding context for details.
      c.letter = ''; // Sets letter on c to '' so the UI reflects the latest state.
      c.baseColour = 'none'; // Sets baseColour on c to 'none' so the UI reflects the latest state.
      c.isGrey = false; // Sets isGrey on c to false so the UI reflects the latest state.
// Blank line preserved for readability.
      c.locked = false; // Sets locked on c to false so the UI reflects the latest state.
    }); // Ends the current callback or object literal and closes the surrounding block.
    if (ent.hintState){ // Starts a conditional check and runs the block when the condition is true.
      ent.hintState.definition = false; // Sets definition on ent.hintState to false so the UI reflects the latest state.
      ent.hintState.analyse = false; // Sets analyse on ent.hintState to false so the UI reflects the latest state.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
  puzzleFinished = false; // Performs part of the game logic; see surrounding context for details.
  updateCompletionUi(false); // Calls a function with the specified arguments.
  if (shareModal) shareModal.hidden = true; // Starts a conditional check and runs the block when the condition is true.
  if (copyToast) copyToast.hidden = true; // Starts a conditional check and runs the block when the condition is true.
  if (shareGrid) shareGrid.innerHTML = ''; // Starts a conditional check and runs the block when the condition is true.
  if (resultsBody) resultsBody.innerHTML = ''; // Starts a conditional check and runs the block when the condition is true.
  completionMessage = null; // Performs part of the game logic; see surrounding context for details.
  applyCompletionMessage(null); // Calls a function with the specified arguments.
  const fireworks = document.getElementById('fireworks'); // Caches the DOM element with id 'fireworks' in the constant fireworks.
  if (fireworks) fireworks.classList.remove('on'); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  if (clueTextEl) clueTextEl.classList.remove('help-on', 'annot-on'); // Starts a conditional check and runs the block when the condition is true.
  hideClueTooltip(); // Calls a function with the specified arguments.
  resetHintPrompt(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  focusFirstCell(); // Calls a function with the specified arguments.
  renderLetters(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function escapeHtml(s=''){ // Declares the function escapeHtml that accepts s=''.
  return String(s).replace(/[&<>"']/g, m => ( // Returns this value from the current function.
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] // Performs part of the game logic; see surrounding context for details.
  )); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function buildClueMarkup(surface='', segments=[]){ // Declares the function buildClueMarkup that accepts surface='', segments=[].
  const text = surface || ''; // Defines the constant text with the given value.
  if (!text) return ''; // Starts a conditional check and runs the block when the condition is true.
  if (!Array.isArray(segments) || !segments.length) return escapeHtml(text); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  const lower = text.toLowerCase(); // Defines the constant lower with the given value.
  const taken = Array(text.length).fill(false); // Defines the constant taken with the given value.
  const matches = []; // Initialises the array matches so it can collect related values later.
// Blank line preserved for readability.
  segments.forEach((seg, idx) => { // Performs part of the game logic; see surrounding context for details.
    const segText = seg && seg.text ? String(seg.text).trim() : ''; // Defines the constant segText with the given value.
    if (!segText) return; // Starts a conditional check and runs the block when the condition is true.
    const segLower = segText.toLowerCase(); // Defines the constant segLower with the given value.
    let start = lower.indexOf(segLower); // Defines the variable start with the given value.
    while (start !== -1){ // Starts a loop that continues while the condition stays true.
      let free = true; // Defines the variable free with the given value.
      for (let i = start; i < start + segLower.length; i++){ // Begins a loop that will iterate multiple times.
        if (taken[i]) { free = false; break; } // Starts a conditional check and runs the block when the condition is true.
      } // Closes the current block scope.
      if (free){ // Starts a conditional check and runs the block when the condition is true.
        matches.push({ start, end: start + segLower.length, seg, order: idx }); // Calls the push method on matches with { start, end: start + segLower.length, seg, order: idx }.
        for (let i = start; i < start + segLower.length; i++) taken[i] = true; // Begins a loop that will iterate multiple times.
        break; // Leaves the current loop or switch case.
      } // Closes the current block scope.
      start = lower.indexOf(segLower, start + 1); // Calls a function with the specified arguments.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  if (!matches.length) return escapeHtml(text); // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  matches.sort((a,b) => (a.start - b.start) || (a.order - b.order)); // Calls the sort method on matches with (a,b) => (a.start - b.start) || (a.order - b.order).
// Blank line preserved for readability.
  let html = ''; // Defines the variable html with the given value.
  let cursor = 0; // Defines the variable cursor with the given value.
  matches.forEach(match => { // Performs part of the game logic; see surrounding context for details.
    if (cursor < match.start){ // Starts a conditional check and runs the block when the condition is true.
      html += escapeHtml(text.slice(cursor, match.start)); // Calls a function with the specified arguments.
    } // Closes the current block scope.
    const seg = match.seg || {}; // Defines the constant seg with the given value.
    const cls = seg.type === 'definition' ? 'def' : seg.type; // Defines the constant cls with the given value.
    const tip = seg.tooltip || (seg.category && TIP[seg.category]) || ''; // Defines the constant tip with the given value.
    const segmentText = text.slice(match.start, match.end); // Defines the constant segmentText with the given value.
    const classNames = [cls]; // Initialises the array classNames so it can collect related values later.
    let tooltipAttr = ''; // Defines the variable tooltipAttr with the given value.
    let cellsAttr = ''; // Defines the variable cellsAttr with the given value.
    if (tip){ // Starts a conditional check and runs the block when the condition is true.
      classNames.push('has-tip'); // Calls the push method on classNames with 'has-tip'.
      if (seg.tipNumber != null) classNames.push(`tip-${seg.tipNumber}`); // Starts a conditional check and runs the block when the condition is true.
      tooltipAttr = ` data-tooltip="${escapeHtml(tip)}"`; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
    if (Array.isArray(seg.positions) && seg.positions.length){ // Starts a conditional check and runs the block when the condition is true.
      const cells = seg.positions.map(idx => Number(idx) + 1).filter(n => Number.isFinite(n)); // Defines the constant cells with the given value.
      if (cells.length) cellsAttr = ` data-tip-cells="${cells.join(',')}"`; // Starts a conditional check and runs the block when the condition is true.
    } // Closes the current block scope.
    html += `<span class="${classNames.join(' ')}"${tooltipAttr}${cellsAttr}>${escapeHtml(segmentText)}</span>`; // Performs part of the game logic; see surrounding context for details.
    cursor = match.end; // Performs part of the game logic; see surrounding context for details.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (cursor < text.length){ // Starts a conditional check and runs the block when the condition is true.
    html += escapeHtml(text.slice(cursor)); // Calls a function with the specified arguments.
  } // Closes the current block scope.
  return html; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function cloneGridTemplate(){ // Declares the function cloneGridTemplate with no parameters.
  return { // Returns this value from the current function.
    rows: GRID_TEMPLATE.rows, // Specifies the number of rows in the grid template.
    cols: GRID_TEMPLATE.cols, // Specifies the number of columns in the grid template.
    blocks: GRID_TEMPLATE.blocks.map(pair => pair.slice()), // Lists the coordinates of black squares in the template.
    numbers: { // Provides starting numbers for clues in the template.
      all: GRID_TEMPLATE.numbers.all.map(item => item.slice()) // Holds the list of numbered cell definitions.
    } // Closes the current block scope.
  }; // Performs part of the game logic; see surrounding context for details.
} // Closes the current block scope.
// Blank line preserved for readability.
function extractClueParts(raw){ // Declares the function extractClueParts that accepts raw.
  if (raw == null) return { surface: '', enumeration: null }; // Starts a conditional check and runs the block when the condition is true.
  let surface = String(raw); // Defines the variable surface with the given value.
  let enumeration = null; // Defines the variable enumeration with the given value.
  const match = surface.match(/\s*\(([\d,\-– ]+)\)\s*$/); // Defines the constant match with the given value.
  if (match){ // Starts a conditional check and runs the block when the condition is true.
    enumeration = match[1].replace(/\s+/g, ''); // Calls a function with the specified arguments.
    surface = surface.slice(0, match.index); // Calls a function with the specified arguments.
  } // Closes the current block scope.
  return { surface: surface.trim(), enumeration }; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function interpretSegmentType(raw){ // Declares the function interpretSegmentType that accepts raw.
  const lower = String(raw || '').trim().toLowerCase(); // Defines the constant lower with the given value.
  if (!lower) return { type: 'indicator', category: null }; // Starts a conditional check and runs the block when the condition is true.
  if (lower === 'definition') return { type: 'definition', category: null }; // Starts a conditional check and runs the block when the condition is true.
  if (lower === 'fodder') return { type: 'fodder', category: null }; // Starts a conditional check and runs the block when the condition is true.
  let category = lower; // Defines the variable category with the given value.
  if (category.endsWith(' indicator')) category = category.replace(/\s+indicator$/, ''); // Starts a conditional check and runs the block when the condition is true.
  if (category === 'letter substitution') category = 'substitution'; // Starts a conditional check and runs the block when the condition is true.
  if (category === 'double definition') category = 'double'; // Starts a conditional check and runs the block when the condition is true.
  if (category === 'literally') category = 'lit'; // Starts a conditional check and runs the block when the condition is true.
  if (category === 'selection indicator') category = 'selection'; // Starts a conditional check and runs the block when the condition is true.
  if (!category) category = lower; // Starts a conditional check and runs the block when the condition is true.
  if (category === 'charade'){ // Starts a conditional check and runs the block when the condition is true.
    return { type: 'fodder', category }; // Returns this value from the current function.
  } // Closes the current block scope.
  return { type: 'indicator', category }; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function parsePositionList(raw, answerLength){ // Declares the function parsePositionList that accepts raw and answerLength.
  if (raw == null) return []; // Starts a conditional check and runs the block when the condition is true.
  const maxLen = Number.isFinite(answerLength) && answerLength > 0 ? Math.floor(answerLength) : null; // Defines the constant maxLen with the given value.
  const collectNumbers = (values) => { // Creates a constant function to gather numeric entries.
    const seen = new Set(); // Creates a new Set instance and keeps it in the constant seen.
    const result = []; // Initialises the array result so it can collect related values later.
    values.forEach(value => { // Performs part of the game logic; see surrounding context for details.
      const num = Number(value); // Defines the constant num with the given value.
      if (!Number.isFinite(num)) return; // Starts a conditional check and runs the block when the condition is true.
      const int = Math.trunc(num); // Defines the constant int with the given value.
      if (int < 0 || seen.has(int)) return; // Starts a conditional check and runs the block when the condition is true.
      seen.add(int); // Calls the add method on seen with int.
      result.push(int); // Calls the push method on result with int.
    }); // Ends the current callback or object literal and closes the surrounding block.
    return result; // Returns this value from the current function.
  }; // Ends the arrow function assignment.
  if (Array.isArray(raw)){ // Starts a conditional check and runs the block when the condition is true.
    const numbers = collectNumbers(raw); // Defines the constant numbers with the given value.
    return normalisePositions(numbers, maxLen); // Returns this value from the current function.
  } // Closes the current block scope.
// Blank line preserved for readability.
  const str = String(raw).trim(); // Defines the constant str with the given value.
  if (!str) return []; // Starts a conditional check and runs the block when the condition is true.
  const values = []; // Initialises the array values so it can collect related values later.
  const regex = /(\d+)(?:\s*-\s*(\d+))?/g; // Defines the constant regex with the given value.
  let match; // Creates a mutable variable for later updates.
  while ((match = regex.exec(str))){ // Starts a loop that continues while the condition stays true.
    let start = Number(match[1]); // Defines the variable start with the given value.
    if (!Number.isFinite(start)) continue; // Starts a conditional check and runs the block when the condition is true.
    let end = match[2] != null ? Number(match[2]) : start; // Defines the variable end with the given value.
    if (!Number.isFinite(end)) end = start; // Starts a conditional check and runs the block when the condition is true.
    if (end < start){ // Starts a conditional check and runs the block when the condition is true.
      const tmp = end; // Defines the constant tmp with the given value.
      end = start; // Performs part of the game logic; see surrounding context for details.
      start = tmp; // Performs part of the game logic; see surrounding context for details.
    } // Closes the current block scope.
    for (let n = start; n <= end; n++){ // Begins a loop that will iterate multiple times.
      values.push(n); // Calls the push method on values with n.
    } // Closes the current block scope.
  } // Closes the current block scope.
  const numbers = collectNumbers(values); // Defines the constant numbers with the given value.
  return normalisePositions(numbers, maxLen); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function normalisePositions(numbers, maxLen){ // Declares the helper function normalisePositions that accepts numbers and maxLen.
  if (!Array.isArray(numbers) || !numbers.length) return []; // Starts a conditional check and runs the block when the condition is true.
  const unique = []; // Initialises the array unique so it can collect related values later.
  const seen = new Set(); // Creates a new Set instance and keeps it in the constant seen.
  numbers.forEach(num => { // Performs part of the game logic; see surrounding context for details.
    if (seen.has(num)) return; // Starts a conditional check and runs the block when the condition is true.
    seen.add(num); // Calls the add method on seen with num.
    unique.push(num); // Calls the push method on unique with num.
  }); // Ends the current callback or object literal and closes the surrounding block.
  if (!unique.length) return []; // Starts a conditional check and runs the block when the condition is true.
  let base = 0; // Creates a mutable variable for later updates.
  const hasZero = unique.some(num => num === 0); // Defines the constant hasZero with the given value.
  if (!hasZero){ // Starts a conditional check and runs the block when the condition is true.
    if (maxLen != null){ // Starts a conditional check and runs the block when the condition is true.
      const hitsLength = unique.some(num => num === maxLen); // Defines the constant hitsLength with the given value.
      const exceedsLength = unique.some(num => num > maxLen); // Defines the constant exceedsLength with the given value.
      if (hitsLength || exceedsLength){ // Starts a conditional check and runs the block when the condition is true.
        base = 1; // Updates the variable base with a new value.
      } else if (unique.length === 1 && unique[0] === 1){ // Starts a conditional check and runs the block when the condition is true.
        base = 1; // Updates the variable base with a new value.
      }
    } else if (unique.length === 1 && unique[0] === 1){ // Starts a conditional check and runs the block when the condition is true.
      base = 1; // Updates the variable base with a new value.
    }
  }
  const result = []; // Initialises the array result so it can collect related values later.
  const finalSeen = new Set(); // Creates a new Set instance and keeps it in the constant finalSeen.
  unique.forEach(num => { // Performs part of the game logic; see surrounding context for details.
    const idx = base === 1 ? num - 1 : num; // Defines the constant idx with the given value.
    if (!Number.isFinite(idx) || idx < 0) return; // Starts a conditional check and runs the block when the condition is true.
    if (maxLen != null && idx >= maxLen) return; // Starts a conditional check and runs the block when the condition is true.
    if (finalSeen.has(idx)) return; // Starts a conditional check and runs the block when the condition is true.
    finalSeen.add(idx); // Calls the add method on finalSeen with idx.
    result.push(idx); // Calls the push method on result with idx.
  }); // Ends the current callback or object literal and closes the surrounding block.
  return result; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function readTooltipField(row, index, field, suffix){ // Declares the function readTooltipField that accepts row, index, field, suffix.
  if (!row) return null; // Starts a conditional check and runs the block when the condition is true.
  const variants = []; // Initialises the array variants so it can collect related values later.
  const lower = field.toLowerCase(); // Defines the constant lower with the given value.
  const upper = field.toUpperCase(); // Defines the constant upper with the given value.
  const capital = field.charAt(0).toUpperCase() + field.slice(1); // Defines the constant capital with the given value.
  const forms = [field, lower, upper, capital]; // Initialises the array forms so it can collect related values later.
  const seen = new Set(); // Creates a new Set instance and keeps it in the constant seen.
  const add = (key) => { // Creates a constant for reuse later in the script.
    if (!key || seen.has(key)) return; // Starts a conditional check and runs the block when the condition is true.
    seen.add(key); // Calls the add method on seen with key.
    variants.push(key); // Calls the push method on variants with key.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  if (index != null){ // Starts a conditional check and runs the block when the condition is true.
    forms.forEach(form => add(`Tooltip_${index}_${form}`)); // Calls the forEach method on forms with form => add(`Tooltip_${index}_${form}`).
  } // Closes the current block scope.
// Blank line preserved for readability.
  if (suffix != null){ // Starts a conditional check and runs the block when the condition is true.
    forms.forEach(form => add(`Tooltip_${form}${suffix}`)); // Calls the forEach method on forms with form => add(`Tooltip_${form}${suffix}`).
  } else { // Provides the alternate branch of a conditional.
    forms.forEach(form => add(`Tooltip_${form}`)); // Calls the forEach method on forms with form => add(`Tooltip_${form}`).
  } // Closes the current block scope.
// Blank line preserved for readability.
  if (index != null){ // Starts a conditional check and runs the block when the condition is true.
    forms.forEach(form => add(`Tooltip_${form}_${index}`)); // Calls the forEach method on forms with form => add(`Tooltip_${form}_${index}`).
    if (index > 1){ // Starts a conditional check and runs the block when the condition is true.
      const alt = index - 1; // Defines the constant alt with the given value.
      forms.forEach(form => add(`Tooltip_${form}.${alt}`)); // Calls the forEach method on forms with form => add(`Tooltip_${form}.${alt}`).
      forms.forEach(form => add(`Tooltip_${form}_${alt}`)); // Calls the forEach method on forms with form => add(`Tooltip_${form}_${alt}`).
    } // Closes the current block scope.
  } // Closes the current block scope.
// Blank line preserved for readability.
  for (const key of variants){ // Begins a loop that will iterate multiple times.
    if (Object.prototype.hasOwnProperty.call(row, key)){ // Starts a conditional check and runs the block when the condition is true.
      const value = row[key]; // Defines the constant value with the given value.
      if (value != null && String(value).trim() !== '') return value; // Starts a conditional check and runs the block when the condition is true.
    } // Closes the current block scope.
  } // Closes the current block scope.
  return null; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function buildSegmentsLegacy(row, answerLength){ // Declares the function buildSegmentsLegacy that accepts row and answerLength.
  const segments = []; // Initialises the array segments so it can collect related values later.
  if (!row) return segments; // Starts a conditional check and runs the block when the condition is true.
  for (let i = 1; i <= 6; i++){ // Begins a loop that will iterate multiple times.
    const suffix = i === 1 ? '' : `.${i-1}`; // Defines the constant suffix with the given value.
    const typeRaw = readTooltipField(row, i, 'type', suffix); // Defines the constant typeRaw with the given value.
    const textRaw = readTooltipField(row, i, 'section', suffix); // Defines the constant textRaw with the given value.
    const tooltipRaw = readTooltipField(row, i, 'text', suffix); // Defines the constant tooltipRaw with the given value.
    const posRaw = readTooltipField(row, i, 'Position', suffix); // Defines the constant posRaw with the given value.
    const segText = textRaw ? String(textRaw).trim() : ''; // Defines the constant segText with the given value.
    const tipText = tooltipRaw ? String(tooltipRaw).trim() : ''; // Defines the constant tipText with the given value.
    const typeStr = typeRaw ? String(typeRaw).trim() : ''; // Defines the constant typeStr with the given value.
    if (!typeStr && !segText) continue; // Starts a conditional check and runs the block when the condition is true.
    const { type, category } = interpretSegmentType(typeStr); // Calls a function with the specified arguments.
    const segment = { type, text: segText }; // Starts defining the object literal assigned to the constant segment.
    if (category) segment.category = category; // Starts a conditional check and runs the block when the condition is true.
    if (tipText) segment.tooltip = tipText; // Starts a conditional check and runs the block when the condition is true.
    segment.tipNumber = i; // Sets tipNumber on segment to i so the UI reflects the latest state.
    const positions = parsePositionList(posRaw, answerLength); // Defines the constant positions with the given value.
    if (positions.length) segment.positions = positions; // Starts a conditional check and runs the block when the condition is true.
    segments.push(segment); // Calls the push method on segments with segment.
  } // Closes the current block scope.
  return segments; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function hasNewFormatSegmentFields(row){ // Declares the function hasNewFormatSegmentFields that accepts row.
  if (!row || typeof row !== 'object') return false; // Starts a conditional check and runs the block when the condition is true.
  for (let i = 1; i <= 6; i++){ // Begins a loop that will iterate multiple times.
    if (Object.prototype.hasOwnProperty.call(row, `Text_${i}`) || // Starts a conditional check and runs the block when the condition is true.
        Object.prototype.hasOwnProperty.call(row, `Category_${i}`) || // Performs part of the game logic; see surrounding context for details.
        Object.prototype.hasOwnProperty.call(row, `Tooltip_${i}`) || // Performs part of the game logic; see surrounding context for details.
        Object.prototype.hasOwnProperty.call(row, `Cell_Position_${i}`)){ // Performs part of the game logic; see surrounding context for details.
      return true; // Returns this value from the current function.
    } // Closes the current block scope.
  } // Closes the current block scope.
  return false; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function readNewFormatSegmentField(row, base, index){ // Declares the function readNewFormatSegmentField that accepts row, base, index.
  if (!row || typeof row !== 'object') return null; // Starts a conditional check and runs the block when the condition is true.
  const forms = [base, base.toLowerCase(), base.toUpperCase()]; // Initialises the array forms so it can collect related values later.
  for (const form of forms){ // Begins a loop that will iterate multiple times.
    const key = `${form}_${index}`; // Defines the constant key with the given value.
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key]; // Starts a conditional check and runs the block when the condition is true.
  } // Closes the current block scope.
  return null; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function buildSegmentsNewFormat(row, answerLength){ // Declares the function buildSegmentsNewFormat that accepts row and answerLength.
  const segments = []; // Initialises the array segments so it can collect related values later.
  if (!row) return segments; // Starts a conditional check and runs the block when the condition is true.
  for (let i = 1; i <= 6; i++){ // Begins a loop that will iterate multiple times.
    const textRaw = readNewFormatSegmentField(row, 'Text', i); // Defines the constant textRaw with the given value.
    const categoryRaw = readNewFormatSegmentField(row, 'Category', i); // Defines the constant categoryRaw with the given value.
    const tooltipRaw = readNewFormatSegmentField(row, 'Tooltip', i); // Defines the constant tooltipRaw with the given value.
    const posRaw = readNewFormatSegmentField(row, 'Cell_Position', i); // Defines the constant posRaw with the given value.
    const text = textRaw != null ? String(textRaw).trim() : ''; // Defines the constant text with the given value.
    const tipText = tooltipRaw != null ? String(tooltipRaw).trim() : ''; // Defines the constant tipText with the given value.
    const typeStr = categoryRaw != null ? String(categoryRaw).trim() : ''; // Defines the constant typeStr with the given value.
    if (!text && !tipText && !typeStr) continue; // Starts a conditional check and runs the block when the condition is true.
    const { type, category } = interpretSegmentType(typeStr); // Calls a function with the specified arguments.
    const segment = { type, text }; // Starts defining the object literal assigned to the constant segment.
    if (category) segment.category = category; // Starts a conditional check and runs the block when the condition is true.
    if (tipText) segment.tooltip = tipText; // Starts a conditional check and runs the block when the condition is true.
    const positions = parsePositionList(posRaw, answerLength); // Defines the constant positions with the given value.
    if (positions.length) segment.positions = positions; // Starts a conditional check and runs the block when the condition is true.
    segment.tipNumber = i; // Sets tipNumber on segment to i so the UI reflects the latest state.
    segments.push(segment); // Calls the push method on segments with segment.
  } // Closes the current block scope.
  return segments; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function buildSegments(row, answerLength){ // Declares the function buildSegments that accepts row and answerLength.
  if (hasNewFormatSegmentFields(row)) return buildSegmentsNewFormat(row, answerLength); // Starts a conditional check and runs the block when the condition is true.
  return buildSegmentsLegacy(row, answerLength); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function normalisePositionKey(raw){ // Declares the function normalisePositionKey that accepts raw.
  if (raw == null) return ''; // Starts a conditional check and runs the block when the condition is true.
  let str = String(raw).trim().toUpperCase(); // Defines the variable str with the given value.
  if (!str) return ''; // Starts a conditional check and runs the block when the condition is true.
  str = str.replace(/[^A-Z0-9]+/g, ' '); // Calls a function with the specified arguments.
  str = str.replace(/\bACROSS\b/g, 'A'); // Calls a function with the specified arguments.
  str = str.replace(/\bDOWN\b/g, 'D'); // Calls a function with the specified arguments.
  str = str.replace(/\s+/g, ''); // Calls a function with the specified arguments.
  return str; // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function createPuzzleFromRows(key, rows){ // Declares the function createPuzzleFromRows that accepts key, rows.
  const entries = []; // Initialises the array entries so it can collect related values later.
  rows.forEach(row => { // Performs part of the game logic; see surrounding context for details.
    const pos = normalisePositionKey(row.Position || row.position); // Defines the constant pos with the given value.
    const layout = POSITION_MAP[pos]; // Defines the constant layout with the given value.
    if (!layout) return; // Starts a conditional check and runs the block when the condition is true.
    const { surface, enumeration } = extractClueParts(row.Clue); // Calls a function with the specified arguments.
    const answerRaw = String(row.Solution || '').toUpperCase(); // Defines the constant answerRaw with the given value.
    const answerLength = answerRaw.replace(/[^A-Z0-9]/g, '').length; // Defines the constant answerLength with the given value.
    const commentRaw = row.Setters_Comment ?? row.SettersComment ?? row.SetterComment ?? row['Setter Comment'] ?? row["Setter's Comment"] ?? row['Setter’s Comment'] ?? row['Setters Comment']; // Defines the constant commentRaw with the given value.
    const setterComment = commentRaw != null ? String(commentRaw).trim() : ''; // Defines the constant setterComment with the given value.
// Blank line preserved for readability.
    entries.push({ // Performs part of the game logic; see surrounding context for details.
      id: layout.id, // Stores the clue identifier for this entry.
      direction: layout.direction, // Notes whether the entry runs across or down.
      row: layout.row, // Records the starting row for this entry.
      col: layout.col, // Records the starting column for this entry.
      answer: answerRaw, // Stores the correct answer text for the entry.
      clue: { // Holds the structured clue data for the entry.
        surface, // Continues the current list or object literal.
        segments: buildSegments(row, answerLength) // Sets the segments property on this object.
      }, // Continues the current list or object literal.
      enumeration: enumeration || null, // Stores the enumeration hint for the entry length pattern.
      setterComment // Performs part of the game logic; see surrounding context for details.
    }); // Ends the current callback or object literal and closes the surrounding block.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  entries.sort((a,b) => { // Performs part of the game logic; see surrounding context for details.
    const ai = POSITION_ORDER.indexOf(a.id); // Defines the constant ai with the given value.
    const bi = POSITION_ORDER.indexOf(b.id); // Defines the constant bi with the given value.
    if (ai === -1 && bi === -1) return a.id.localeCompare(b.id); // Starts a conditional check and runs the block when the condition is true.
    if (ai === -1) return 1; // Starts a conditional check and runs the block when the condition is true.
    if (bi === -1) return -1; // Starts a conditional check and runs the block when the condition is true.
    return ai - bi; // Returns this value from the current function.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  return { // Returns this value from the current function.
    id: key, // Stores the clue identifier for this entry.
    title: `Crossword ${key}`, // Sets the title property on this object.
    grid: cloneGridTemplate(), // Sets the grid property on this object.
    entries // Performs part of the game logic; see surrounding context for details.
  }; // Performs part of the game logic; see surrounding context for details.
} // Closes the current block scope.
// Blank line preserved for readability.
function groupRowsIntoPuzzles(rows){ // Declares the function groupRowsIntoPuzzles that accepts rows.
  if (!Array.isArray(rows) || !rows.length) return []; // Starts a conditional check and runs the block when the condition is true.
  const grouped = new Map(); // Creates a new Map instance and keeps it in the constant grouped.
  rows.forEach(row => { // Performs part of the game logic; see surrounding context for details.
    const keyRaw = row.Crossword ?? row.crossword; // Defines the constant keyRaw with the given value.
    const key = keyRaw != null ? String(keyRaw).trim() : ''; // Defines the constant key with the given value.
    if (!key) return; // Starts a conditional check and runs the block when the condition is true.
    if (!grouped.has(key)) grouped.set(key, []); // Starts a conditional check and runs the block when the condition is true.
    grouped.get(key).push(row); // Calls the get method on grouped with key).push(row.
  }); // Ends the current callback or object literal and closes the surrounding block.
  const keys = [...grouped.keys()].sort((a,b) => { // Initialises the array keys so it can collect related values later.
    const na = Number(a); // Defines the constant na with the given value.
    const nb = Number(b); // Defines the constant nb with the given value.
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb; // Starts a conditional check and runs the block when the condition is true.
    return String(a).localeCompare(String(b)); // Returns this value from the current function.
  }); // Ends the current callback or object literal and closes the surrounding block.
  return keys.map(key => createPuzzleFromRows(key, grouped.get(key) || [])); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function parseSimpleWorkbook(json){ // Declares the function parseSimpleWorkbook that accepts json.
  const rows = []; // Initialises the array rows so it can collect related values later.
  const collectRows = arr => { // Creates a constant for reuse later in the script.
    if (!Array.isArray(arr)) return; // Starts a conditional check and runs the block when the condition is true.
    arr.forEach(item => { // Performs part of the game logic; see surrounding context for details.
      if (item && typeof item === 'object' && (item.Crossword != null || item.crossword != null)){ // Starts a conditional check and runs the block when the condition is true.
        rows.push(item); // Calls the push method on rows with item.
      } // Closes the current block scope.
    }); // Ends the current callback or object literal and closes the surrounding block.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  if (Array.isArray(json)){ // Starts a conditional check and runs the block when the condition is true.
    collectRows(json); // Calls a function with the specified arguments.
  } else if (json && typeof json === 'object'){ // Performs part of the game logic; see surrounding context for details.
    Object.keys(json).forEach(key => { // Performs part of the game logic; see surrounding context for details.
      collectRows(json[key]); // Calls a function with the specified arguments.
    }); // Ends the current callback or object literal and closes the surrounding block.
  } // Closes the current block scope.
// Blank line preserved for readability.
  return groupRowsIntoPuzzles(rows); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function parseWorkbook(json){ // Declares the function parseWorkbook that accepts json.
  return parseSimpleWorkbook(json); // Returns this value from the current function.
} // Closes the current block scope.
// Blank line preserved for readability.
function populatePuzzleSelect(){ // Declares the function populatePuzzleSelect with no parameters.
  if (!puzzleSelect) return; // Starts a conditional check and runs the block when the condition is true.
  puzzleSelect.innerHTML = ''; // Sets innerHTML on puzzleSelect to '' so the UI reflects the latest state.
  if (!puzzles.length){ // Starts a conditional check and runs the block when the condition is true.
    const option = document.createElement('option'); // Defines the constant option with the given value.
    option.value = ''; // Sets value on option to '' so the UI reflects the latest state.
    option.textContent = 'No crosswords found'; // Sets textContent on option to 'No crosswords found' so the UI reflects the latest state.
    puzzleSelect.appendChild(option); // Calls the appendChild method on puzzleSelect with option.
    puzzleSelect.disabled = true; // Sets disabled on puzzleSelect to true so the UI reflects the latest state.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  puzzles.forEach((p, idx) => { // Performs part of the game logic; see surrounding context for details.
    const option = document.createElement('option'); // Defines the constant option with the given value.
    option.value = String(idx); // Sets value on option to String(idx) so the UI reflects the latest state.
    option.textContent = p.title || `Crossword ${p.id || idx + 1}`; // Sets textContent on option to p.title || `Crossword ${p.id || idx + 1}` so the UI reflects the latest state.
    puzzleSelect.appendChild(option); // Calls the appendChild method on puzzleSelect with option.
  }); // Ends the current callback or object literal and closes the surrounding block.
  puzzleSelect.disabled = puzzles.length <= 1; // Sets disabled on puzzleSelect to puzzles.length <= 1 so the UI reflects the latest state.
  puzzleSelect.value = String(currentPuzzleIndex); // Sets value on puzzleSelect to String(currentPuzzleIndex) so the UI reflects the latest state.
} // Closes the current block scope.
// Blank line preserved for readability.
function updatePuzzleMeta(){ // Declares the function updatePuzzleMeta with no parameters.
  if (!puzzleDate) return; // Starts a conditional check and runs the block when the condition is true.
  const current = puzzles[currentPuzzleIndex]; // Defines the constant current with the given value.
  if (!current){ // Starts a conditional check and runs the block when the condition is true.
    puzzleDate.textContent = ''; // Sets textContent on puzzleDate to '' so the UI reflects the latest state.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
  const label = current.title || `Crossword ${current.id || currentPuzzleIndex + 1}`; // Defines the constant label with the given value.
  if (puzzles.length > 1){ // Starts a conditional check and runs the block when the condition is true.
    puzzleDate.textContent = `${label} (${currentPuzzleIndex + 1}/${puzzles.length})`; // Sets textContent on puzzleDate to `${label} (${currentPuzzleIndex + 1}/${puzzles.length})` so the UI reflects the latest state.
  } else { // Provides the alternate branch of a conditional.
    puzzleDate.textContent = label; // Sets textContent on puzzleDate to label so the UI reflects the latest state.
  } // Closes the current block scope.
} // Closes the current block scope.
// Blank line preserved for readability.
function loadPuzzleByIndex(idx){ // Declares the function loadPuzzleByIndex that accepts idx.
  if (!puzzles[idx]) return; // Starts a conditional check and runs the block when the condition is true.
  currentPuzzleIndex = idx; // Performs part of the game logic; see surrounding context for details.
  if (puzzleSelect) puzzleSelect.value = String(idx); // Starts a conditional check and runs the block when the condition is true.
  applyPuzzle(puzzles[idx]); // Calls a function with the specified arguments.
  updatePuzzleMeta(); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function applyPuzzle(data){ // Declares the function applyPuzzle that accepts data.
  puzzle = data; // Performs part of the game logic; see surrounding context for details.
  grid = []; // Performs part of the game logic; see surrounding context for details.
  cellMap.clear(); // Calls the clear method on cellMap with no arguments.
  entries = []; // Performs part of the game logic; see surrounding context for details.
  currentEntry = null; // Performs part of the game logic; see surrounding context for details.
  activeCellKey = null; // Performs part of the game logic; see surrounding context for details.
  lastClickedCellKey = null; // Performs part of the game logic; see surrounding context for details.
  dirToggle.clear(); // Calls the clear method on dirToggle with no arguments.
  puzzleFinished = false; // Performs part of the game logic; see surrounding context for details.
  updateCompletionUi(false); // Calls a function with the specified arguments.
  if (shareModal) shareModal.hidden = true; // Starts a conditional check and runs the block when the condition is true.
  if (copyToast) copyToast.hidden = true; // Starts a conditional check and runs the block when the condition is true.
  if (resultsBody) resultsBody.innerHTML = ''; // Starts a conditional check and runs the block when the condition is true.
  completionMessage = null; // Performs part of the game logic; see surrounding context for details.
  applyCompletionMessage(null); // Calls a function with the specified arguments.
  const fireworks = document.getElementById('fireworks'); // Caches the DOM element with id 'fireworks' in the constant fireworks.
  if (fireworks) fireworks.classList.remove('on'); // Starts a conditional check and runs the block when the condition is true.
  if (clueTextEl) { // Starts a conditional check and runs the block when the condition is true.
    clueTextEl.classList.remove('help-on', 'annot-on'); // Calls the remove method on clueTextEl.classList with 'help-on', 'annot-on'.
    clueTextEl.textContent = ''; // Sets textContent on clueTextEl to '' so the UI reflects the latest state.
  } // Closes the current block scope.
  if (clueHeaderEl) clueHeaderEl.textContent = '—'; // Starts a conditional check and runs the block when the condition is true.
  hideClueTooltip(); // Calls a function with the specified arguments.
  closeHintDropdown(); // Calls a function with the specified arguments.
  resetHintPrompt(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  buildGrid(); // Calls a function with the specified arguments.
  placeEntries(); // Calls a function with the specified arguments.
  focusFirstCell(); // Calls a function with the specified arguments.
  if (mobileInput && !mobileBehaviours.isActive()) mobileInput.focus(); // Starts a conditional check and runs the block when the condition is true.
} // Closes the current block scope.
// Blank line preserved for readability.
function useFallbackPuzzle(){ // Declares the function useFallbackPuzzle with no parameters.
  puzzles = [{ // Performs part of the game logic; see surrounding context for details.
    id: 'fallback', // Stores the clue identifier for this entry.
    title: 'Fallback Puzzle', // Sets the title property on this object.
    grid: cloneGridTemplate(), // Sets the grid property on this object.
    entries: [ // Sets the entries property on this object.
      { id: '1A', direction: 'across', row: 0, col: 0, answer: 'DISCO', clue: { surface: 'Dance floor genre', segments: [] }, enumeration: '5', setterComment: '' }, // Adds an object entry within the surrounding array.
      { id: '2A', direction: 'across', row: 2, col: 0, answer: 'INANE', clue: { surface: 'Silly or senseless', segments: [] }, enumeration: '5', setterComment: '' }, // Adds an object entry within the surrounding array.
      { id: '3A', direction: 'across', row: 4, col: 0, answer: 'TAROT', clue: { surface: 'Cards for fortunes', segments: [] }, enumeration: '5', setterComment: '' }, // Adds an object entry within the surrounding array.
      { id: '1D', direction: 'down', row: 0, col: 0, answer: 'DRIFT', clue: { surface: 'Move with the tide', segments: [] }, enumeration: '5', setterComment: '' }, // Adds an object entry within the surrounding array.
      { id: '2D', direction: 'down', row: 0, col: 2, answer: 'STAIR', clue: { surface: 'Single step', segments: [] }, enumeration: '5', setterComment: '' }, // Adds an object entry within the surrounding array.
      { id: '3D', direction: 'down', row: 0, col: 4, answer: 'OVERT', clue: { surface: 'Plain to see', segments: [] }, enumeration: '5', setterComment: '' } // Performs part of the game logic; see surrounding context for details.
    ] // Performs part of the game logic; see surrounding context for details.
  }]; // Performs part of the game logic; see surrounding context for details.
  currentPuzzleIndex = 0; // Performs part of the game logic; see surrounding context for details.
  populatePuzzleSelect(); // Calls a function with the specified arguments.
  loadPuzzleByIndex(0); // Calls a function with the specified arguments.
} // Closes the current block scope.
// Blank line preserved for readability.
function loadCrosswordsFromFile(file){ // Declares the function loadCrosswordsFromFile that accepts file.
  if (!file){ // Starts a conditional check and runs the block when the condition is true.
    console.error('No crossword data file specified; using fallback data.'); // Calls the error method on console with 'No crossword data file specified; using fallback data.'.
    useFallbackPuzzle(); // Calls a function with the specified arguments.
    return; // Stops execution of the current function without a value.
  } // Closes the current block scope.
// Blank line preserved for readability.
  fetch(file) // Performs part of the game logic; see surrounding context for details.
    .then(r => { // Performs part of the game logic; see surrounding context for details.
      if (!r.ok) throw new Error(`Failed to load ${file}: ${r.status}`); // Starts a conditional check and runs the block when the condition is true.
      return r.json(); // Returns this value from the current function.
    }) // Performs part of the game logic; see surrounding context for details.
    .then(json => { // Performs part of the game logic; see surrounding context for details.
      const parsed = parseWorkbook(json); // Defines the constant parsed with the given value.
      if (!parsed.length) throw new Error('No crossword data found in workbook'); // Starts a conditional check and runs the block when the condition is true.
      puzzles = parsed; // Performs part of the game logic; see surrounding context for details.
      currentPuzzleIndex = 0; // Performs part of the game logic; see surrounding context for details.
      populatePuzzleSelect(); // Calls a function with the specified arguments.
      loadPuzzleByIndex(0); // Calls a function with the specified arguments.
    }) // Performs part of the game logic; see surrounding context for details.
    .catch(err => { // Performs part of the game logic; see surrounding context for details.
      console.error(`Failed to load crosswords from ${file}:`, err); // Calls the error method on console with `Failed to load crosswords from ${file}:`, err.
      useFallbackPuzzle(); // Calls a function with the specified arguments.
    }); // Ends the current callback or object literal and closes the surrounding block.
} // Closes the current block scope.
// Blank line preserved for readability.
function createMobileBehaviours(){ // Declares the function createMobileBehaviours with no parameters.
  const noop = { // Starts defining the object literal assigned to the constant noop.
    isActive: () => false, // Sets the isActive property on this object.
    updateState: () => {}, // Sets the updateState property on this object.
    onEntryFocus: () => {}, // Sets the onEntryFocus property on this object.
    onEntryCleared: () => {}, // Sets the onEntryCleared property on this object.
    onHintMenuOpened: () => {}, // Sets the onHintMenuOpened property on this object.
    onHintMenuClosed: () => {}, // Sets the onHintMenuClosed property on this object.
    onHintSelected: () => {}, // Sets the onHintSelected property on this object.
    hideKeyboard: () => {} // Sets the hideKeyboard property on this object.
  }; // Performs part of the game logic; see surrounding context for details.
  if (!mobileKeyboard) return noop; // Starts a conditional check and runs the block when the condition is true.
// Blank line preserved for readability.
  const widthQuery = window.matchMedia('(max-width: 768px)'); // Defines the constant widthQuery with the given value.
  const pointerQueries = []; // Initialises the array pointerQueries so it can collect related values later.
  ['(pointer: coarse)', '(any-pointer: coarse)'].forEach(q => { // Performs part of the game logic; see surrounding context for details.
    try { // Begins a try block to catch potential errors.
      const mq = window.matchMedia(q); // Defines the constant mq with the given value.
      if (mq && mq.media !== 'not all') pointerQueries.push(mq); // Starts a conditional check and runs the block when the condition is true.
    } catch (err) { // Performs part of the game logic; see surrounding context for details.
      // Ignore unsupported media query strings. // Comment giving context; kept with an added plain-language note.
    } // Closes the current block scope.
  }); // Ends the current callback or object literal and closes the surrounding block.
// Blank line preserved for readability.
  let active = false; // Defines the variable active with the given value.
  let keyboardVisible = false; // Defines the variable keyboardVisible with the given value.
  let hintMenuOpen = false; // Defines the variable hintMenuOpen with the given value.
  let keyboardBuilt = false; // Defines the variable keyboardBuilt with the given value.
// Blank line preserved for readability.
  const body = document.body; // Defines the constant body with the given value.
// Blank line preserved for readability.
  const addMediaListener = (mq, handler) => { // Creates a constant for reuse later in the script.
    if (!mq) return; // Starts a conditional check and runs the block when the condition is true.
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler); // Starts a conditional check and runs the block when the condition is true.
    else if (typeof mq.addListener === 'function') mq.addListener(handler); // Provides an alternate condition in the conditional chain.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const isTouchCapable = () => { // Creates a constant for reuse later in the script.
    if (pointerQueries.some(q => q.matches)) return true; // Starts a conditional check and runs the block when the condition is true.
    if ('ontouchstart' in window) return true; // Starts a conditional check and runs the block when the condition is true.
    if (typeof navigator !== 'undefined' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) return true; // Starts a conditional check and runs the block when the condition is true.
    return false; // Returns this value from the current function.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const shouldEnable = () => widthQuery.matches && isTouchCapable(); // Defines the constant shouldEnable with the given value.
// Blank line preserved for readability.
  const syncKeyboardHeight = () => { // Creates a constant for reuse later in the script.
    if (!keyboardVisible) return; // Starts a conditional check and runs the block when the condition is true.
    const height = mobileKeyboard.offsetHeight; // Defines the constant height with the given value.
    body.style.setProperty('--mobile-keyboard-height', `${height}px`); // Calls the setProperty method on body.style with '--mobile-keyboard-height', `${height}px`.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const hideKeyboardInternal = (opts = {}) => { // Creates a constant for reuse later in the script.
    if (!keyboardVisible) return; // Starts a conditional check and runs the block when the condition is true.
    keyboardVisible = false; // Performs part of the game logic; see surrounding context for details.
    mobileKeyboard.classList.remove('visible'); // Calls the remove method on mobileKeyboard.classList with 'visible'.
    mobileKeyboard.hidden = true; // Sets hidden on mobileKeyboard to true so the UI reflects the latest state.
    mobileKeyboard.setAttribute('aria-hidden', 'true'); // Calls the setAttribute method on mobileKeyboard with 'aria-hidden', 'true'.
    body.classList.remove('mobile-keyboard-open'); // Calls the remove method on body.classList with 'mobile-keyboard-open'.
    body.style.removeProperty('--mobile-keyboard-height'); // Calls the removeProperty method on body.style with '--mobile-keyboard-height'.
    if (!opts.preserveHintState) hintMenuOpen = false; // Starts a conditional check and runs the block when the condition is true.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const showKeyboard = () => { // Creates a constant for reuse later in the script.
    if (!active || hintMenuOpen) return; // Starts a conditional check and runs the block when the condition is true.
    if (!keyboardBuilt) buildKeyboard(); // Starts a conditional check and runs the block when the condition is true.
    if (keyboardVisible){ // Starts a conditional check and runs the block when the condition is true.
      syncKeyboardHeight(); // Calls a function with the specified arguments.
      return; // Stops execution of the current function without a value.
    } // Closes the current block scope.
    keyboardVisible = true; // Performs part of the game logic; see surrounding context for details.
    mobileKeyboard.hidden = false; // Sets hidden on mobileKeyboard to false so the UI reflects the latest state.
    mobileKeyboard.classList.add('visible'); // Calls the add method on mobileKeyboard.classList with 'visible'.
    mobileKeyboard.setAttribute('aria-hidden', 'false'); // Calls the setAttribute method on mobileKeyboard with 'aria-hidden', 'false'.
    body.classList.add('mobile-keyboard-open'); // Calls the add method on body.classList with 'mobile-keyboard-open'.
    syncKeyboardHeight(); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const handleKeyboardClick = (e) => { // Creates a constant for reuse later in the script.
    const btn = e.target.closest('button[data-key], button[data-action]'); // Defines the constant btn with the given value.
    if (!btn) return; // Starts a conditional check and runs the block when the condition is true.
    e.preventDefault(); // Calls the preventDefault method on e with no arguments.
    const action = btn.dataset.action; // Defines the constant action with the given value.
    if (action === 'delete'){ backspace(); return; } // Starts a conditional check and runs the block when the condition is true.
    if (action === 'clear'){ clearCurrentEntry(); return; } // Starts a conditional check and runs the block when the condition is true.
    if (action === 'close'){ hideKeyboardInternal(); return; } // Starts a conditional check and runs the block when the condition is true.
    const keyVal = btn.dataset.key; // Defines the constant keyVal with the given value.
    if (keyVal) typeChar(keyVal); // Starts a conditional check and runs the block when the condition is true.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const buildKeyboard = () => { // Creates a constant for reuse later in the script.
    if (keyboardBuilt) return; // Starts a conditional check and runs the block when the condition is true.
    keyboardBuilt = true; // Performs part of the game logic; see surrounding context for details.
    mobileKeyboard.innerHTML = ''; // Sets innerHTML on mobileKeyboard to '' so the UI reflects the latest state.
    const layout = [ // Initialises the array layout so it can collect related values later.
      ['Q','W','E','R','T','Y','U','I','O','P'], // Adds another item to this array literal.
      ['A','S','D','F','G','H','J','K','L'], // Adds another item to this array literal.
      ['Z','X','C','V','B','N','M'] // Performs part of the game logic; see surrounding context for details.
    ]; // Performs part of the game logic; see surrounding context for details.
    layout.forEach(row => { // Performs part of the game logic; see surrounding context for details.
      const rowEl = document.createElement('div'); // Defines the constant rowEl with the given value.
      rowEl.className = 'mobile-keyboard-row'; // Sets className on rowEl to 'mobile-keyboard-row' so the UI reflects the latest state.
      row.forEach(letter => { // Performs part of the game logic; see surrounding context for details.
        const btn = document.createElement('button'); // Defines the constant btn with the given value.
        btn.type = 'button'; // Sets type on btn to 'button' so the UI reflects the latest state.
        btn.textContent = letter; // Sets textContent on btn to letter so the UI reflects the latest state.
        btn.dataset.key = letter; // Sets key on btn.dataset to letter so the UI reflects the latest state.
        rowEl.appendChild(btn); // Calls the appendChild method on rowEl with btn.
      }); // Ends the current callback or object literal and closes the surrounding block.
      mobileKeyboard.appendChild(rowEl); // Calls the appendChild method on mobileKeyboard with rowEl.
    }); // Ends the current callback or object literal and closes the surrounding block.
    const controls = document.createElement('div'); // Defines the constant controls with the given value.
    controls.className = 'mobile-keyboard-row controls'; // Sets className on controls to 'mobile-keyboard-row controls' so the UI reflects the latest state.
// Blank line preserved for readability.
    const backspaceBtn = document.createElement('button'); // Defines the constant backspaceBtn with the given value.
    backspaceBtn.type = 'button'; // Sets type on backspaceBtn to 'button' so the UI reflects the latest state.
    backspaceBtn.dataset.action = 'delete'; // Sets action on backspaceBtn.dataset to 'delete' so the UI reflects the latest state.
    backspaceBtn.classList.add('delete-key'); // Calls the add method on backspaceBtn.classList with 'delete-key'.
    backspaceBtn.setAttribute('aria-label', 'Backspace'); // Calls the setAttribute method on backspaceBtn with 'aria-label', 'Backspace'.
    backspaceBtn.textContent = '⌫'; // Sets textContent on backspaceBtn to '⌫' so the UI reflects the latest state.
// Blank line preserved for readability.
    const clearBtn = document.createElement('button'); // Defines the constant clearBtn with the given value.
    clearBtn.type = 'button'; // Sets type on clearBtn to 'button' so the UI reflects the latest state.
    clearBtn.dataset.action = 'clear'; // Sets action on clearBtn.dataset to 'clear' so the UI reflects the latest state.
    clearBtn.classList.add('action-key'); // Calls the add method on clearBtn.classList with 'action-key'.
    clearBtn.setAttribute('aria-label', 'Clear current clue'); // Calls the setAttribute method on clearBtn with 'aria-label', 'Clear current clue'.
    clearBtn.textContent = 'Clear'; // Sets textContent on clearBtn to 'Clear' so the UI reflects the latest state.
// Blank line preserved for readability.
    const closeBtn = document.createElement('button'); // Defines the constant closeBtn with the given value.
    closeBtn.type = 'button'; // Sets type on closeBtn to 'button' so the UI reflects the latest state.
    closeBtn.dataset.action = 'close'; // Sets action on closeBtn.dataset to 'close' so the UI reflects the latest state.
    closeBtn.classList.add('close-keyboard'); // Calls the add method on closeBtn.classList with 'close-keyboard'.
    closeBtn.setAttribute('aria-label', 'Hide keyboard'); // Calls the setAttribute method on closeBtn with 'aria-label', 'Hide keyboard'.
    closeBtn.textContent = 'Hide'; // Sets textContent on closeBtn to 'Hide' so the UI reflects the latest state.
// Blank line preserved for readability.
    controls.append(backspaceBtn, clearBtn, closeBtn); // Calls the append method on controls with backspaceBtn, clearBtn, closeBtn.
    mobileKeyboard.appendChild(controls); // Calls the appendChild method on mobileKeyboard with controls.
// Blank line preserved for readability.
    mobileKeyboard.addEventListener('click', handleKeyboardClick); // Calls the addEventListener method on mobileKeyboard with 'click', handleKeyboardClick.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const enable = () => { // Creates a constant for reuse later in the script.
    if (active) return; // Starts a conditional check and runs the block when the condition is true.
    active = true; // Performs part of the game logic; see surrounding context for details.
    body.classList.add('mobile-touch'); // Calls the add method on body.classList with 'mobile-touch'.
    hintMenuOpen = false; // Performs part of the game logic; see surrounding context for details.
    buildKeyboard(); // Calls a function with the specified arguments.
    if (mobileInput) mobileInput.blur(); // Starts a conditional check and runs the block when the condition is true.
    keyboardVisible = false; // Performs part of the game logic; see surrounding context for details.
    showKeyboard(); // Calls a function with the specified arguments.
    window.addEventListener('resize', syncKeyboardHeight); // Calls the addEventListener method on window with 'resize', syncKeyboardHeight.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const disable = () => { // Creates a constant for reuse later in the script.
    if (!active) return; // Starts a conditional check and runs the block when the condition is true.
    hideKeyboardInternal(); // Calls a function with the specified arguments.
    active = false; // Performs part of the game logic; see surrounding context for details.
    hintMenuOpen = false; // Performs part of the game logic; see surrounding context for details.
    body.classList.remove('mobile-touch', 'mobile-keyboard-open'); // Calls the remove method on body.classList with 'mobile-touch', 'mobile-keyboard-open'.
    body.style.removeProperty('--mobile-keyboard-height'); // Calls the removeProperty method on body.style with '--mobile-keyboard-height'.
    window.removeEventListener('resize', syncKeyboardHeight); // Calls the removeEventListener method on window with 'resize', syncKeyboardHeight.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const evaluate = () => { // Creates a constant for reuse later in the script.
    if (shouldEnable()) enable(); else disable(); // Starts a conditional check and runs the block when the condition is true.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  const orientationHandler = () => { // Creates a constant for reuse later in the script.
    setTimeout(() => { // Performs part of the game logic; see surrounding context for details.
      syncKeyboardHeight(); // Calls a function with the specified arguments.
      evaluate(); // Calls a function with the specified arguments.
      showKeyboard(); // Calls a function with the specified arguments.
    }, 200); // Calls a function with the specified arguments.
  }; // Performs part of the game logic; see surrounding context for details.
// Blank line preserved for readability.
  addMediaListener(widthQuery, evaluate); // Calls a function with the specified arguments.
  pointerQueries.forEach(q => addMediaListener(q, evaluate)); // Calls the forEach method on pointerQueries with q => addMediaListener(q, evaluate).
  window.addEventListener('orientationchange', orientationHandler); // Calls the addEventListener method on window with 'orientationchange', orientationHandler.
// Blank line preserved for readability.
  // Initial state // Comment giving context; kept with an added plain-language note.
  evaluate(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  return { // Returns this value from the current function.
    isActive: () => active, // Sets the isActive property on this object.
    updateState: evaluate, // Sets the updateState property on this object.
    onEntryFocus: () => { if (active) showKeyboard(); }, // Sets the onEntryFocus property on this object.
    onEntryCleared: () => { if (active && !hintMenuOpen) showKeyboard(); }, // Sets the onEntryCleared property on this object.
    onHintMenuOpened: () => { // Sets the onHintMenuOpened property on this object.
      if (!active) return; // Starts a conditional check and runs the block when the condition is true.
      hintMenuOpen = true; // Performs part of the game logic; see surrounding context for details.
      hideKeyboardInternal({ preserveHintState: true }); // Calls a function with the specified arguments.
    }, // Continues the current list or object literal.
    onHintMenuClosed: () => { // Sets the onHintMenuClosed property on this object.
      if (!active) return; // Starts a conditional check and runs the block when the condition is true.
      hintMenuOpen = false; // Performs part of the game logic; see surrounding context for details.
      showKeyboard(); // Calls a function with the specified arguments.
    }, // Continues the current list or object literal.
    onHintSelected: () => { // Sets the onHintSelected property on this object.
      if (!active) return; // Starts a conditional check and runs the block when the condition is true.
      hintMenuOpen = false; // Performs part of the game logic; see surrounding context for details.
      showKeyboard(); // Calls a function with the specified arguments.
    }, // Continues the current list or object literal.
    hideKeyboard: () => { if (active) hideKeyboardInternal(); } // Sets the hideKeyboard property on this object.
  }; // Performs part of the game logic; see surrounding context for details.
} // Closes the current block scope.
// Blank line preserved for readability.
// ----- Boot ----- // Comment giving context; kept with an added plain-language note.
window.addEventListener('load', () => { // Performs part of the game logic; see surrounding context for details.
  mobileBehaviours.updateState(); // Calls the updateState method on mobileBehaviours with no arguments.
  setupHandlers(); // Calls a function with the specified arguments.
  setupTooltipHandlers(); // Calls a function with the specified arguments.
// Blank line preserved for readability.
  loadCrosswordsFromFile(DATA_FILE); // Calls a function with the specified arguments.
}); // Ends the current callback or object literal and closes the surrounding block.
