const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const bestEl = document.getElementById("best");
const levelEl = document.getElementById("level");
const currentWordEl = document.getElementById("current-word");
const messageEl = document.getElementById("message");
const targetWordEl = document.getElementById("target-word");
const hintEl = document.getElementById("hint");

const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const shuffleBtn = document.getElementById("shuffle");

const WORD_LIST = [
  "apple",
  "angle",
  "badge",
  "baker",
  "blush",
  "candy",
  "chill",
  "crisp",
  "crane",
  "cream",
  "daisy",
  "dream",
  "eager",
  "earth",
  "fable",
  "feast",
  "frost",
  "glaze",
  "glide",
  "grape",
  "happy",
  "honey",
  "ivory",
  "jelly",
  "laser",
  "lemon",
  "lunar",
  "magic",
  "mango",
  "merry",
  "mocha",
  "noble",
  "ocean",
  "olive",
  "orbit",
  "party",
  "pearl",
  "peach",
  "pixel",
  "plaza",
  "prism",
  "queen",
  "quick",
  "raven",
  "retro",
  "rider",
  "river",
  "sable",
  "salsa",
  "satin",
  "scale",
  "scoot",
  "shine",
  "slice",
  "smile",
  "solar",
  "spice",
  "spike",
  "spoon",
  "sprig",
  "storm",
  "sugar",
  "sunny",
  "tango",
  "tasty",
  "tempo",
  "tiger",
  "treat",
  "trick",
  "vapor",
  "velvet",
  "vivid",
  "wafer",
  "water",
  "whisk",
  "witty",
  "zesty",
  "zonal",
];

const BONUS_WORDS = [
  "amber",
  "amuse",
  "angel",
  "beach",
  "berry",
  "blast",
  "brisk",
  "caper",
  "cider",
  "cloud",
  "cocoa",
  "comet",
  "coral",
  "craft",
  "curve",
  "dolly",
  "dusk",
  "flare",
  "gamer",
  "glory",
  "grind",
  "haste",
  "icing",
  "jolly",
  "karma",
  "koala",
  "lilac",
  "marsh",
  "minty",
  "mirth",
  "north",
  "oasis",
  "panda",
  "petal",
  "piano",
  "plush",
  "poppy",
  "quill",
  "rally",
  "realm",
  "salty",
  "scoop",
  "swift",
  "tidal",
  "toast",
  "tulip",
  "whirl",
  "yummy",
];

const DICTIONARY = new Set([
  ...WORD_LIST,
  ...BONUS_WORDS,
  "ace",
  "ages",
  "air",
  "arc",
  "art",
  "bake",
  "ball",
  "bat",
  "bear",
  "bee",
  "bite",
  "bold",
  "book",
  "bowl",
  "brim",
  "bump",
  "cape",
  "card",
  "care",
  "cart",
  "cast",
  "chat",
  "clap",
  "claw",
  "code",
  "cool",
  "crab",
  "crop",
  "dash",
  "dish",
  "dive",
  "doll",
  "draw",
  "drip",
  "drop",
  "dune",
  "echo",
  "edit",
  "fast",
  "fire",
  "fish",
  "flip",
  "flow",
  "fold",
  "game",
  "gift",
  "glow",
  "grid",
  "gust",
  "harp",
  "heat",
  "hero",
  "hint",
  "jump",
  "keen",
  "kite",
  "lake",
  "lane",
  "late",
  "lava",
  "leaf",
  "life",
  "lily",
  "loop",
  "luck",
  "luxe",
  "mint",
  "mode",
  "mood",
  "muse",
  "nest",
  "note",
  "nova",
  "opal",
  "pace",
  "palm",
  "pink",
  "play",
  "pour",
  "pull",
  "rain",
  "rise",
  "road",
  "rock",
  "roll",
  "rush",
  "seal",
  "seed",
  "ship",
  "sing",
  "skip",
  "slow",
  "snap",
  "snow",
  "song",
  "spin",
  "star",
  "stay",
  "surf",
  "team",
  "tide",
  "time",
  "tone",
  "twin",
  "vibe",
  "view",
  "wave",
  "wild",
  "wind",
  "wing",
  "wink",
  "wish",
  "yarn",
  "zone",
]);

const LETTER_POOL = "EEEEEEEAAAAAIIIIOOOONNNNRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ";

const state = {
  rows: 6,
  cols: 6,
  board: [],
  selected: [],
  word: "",
  target: "",
  locked: [],
  sparks: 0,
  score: 0,
  streak: 0,
  multiplier: 1,
  best: Number(localStorage.getItem("lexicrush-best")) || 0,
  level: 1,
  dragging: false,
  pointerId: null,
};

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

function getDailyTarget() {
  const today = new Date();
  const stamp = today.toISOString().slice(0, 10);
  const seed = hashString(stamp);
  return WORD_LIST[seed % WORD_LIST.length];
}

function randomLetter() {
  const index = Math.floor(Math.random() * LETTER_POOL.length);
  return LETTER_POOL[index];
}

function buildBoard() {
  state.board = [];
  for (let row = 0; row < state.rows; row += 1) {
    const line = [];
    for (let col = 0; col < state.cols; col += 1) {
      line.push({ letter: randomLetter() });
    }
    state.board.push(line);
  }
}

function renderBoard() {
  gridEl.innerHTML = "";
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.textContent = state.board[row][col].letter;
      tile.dataset.row = row;
      tile.dataset.col = col;
      gridEl.appendChild(tile);
    }
  }
}

function updateHud() {
  scoreEl.textContent = Math.floor(state.score).toString();
  streakEl.textContent = state.streak.toString();
  bestEl.textContent = state.best.toString();
  levelEl.textContent = state.level.toString();
  currentWordEl.textContent = state.word.length ? state.word : "---";

  const display = state.target
    .split("")
    .map((letter, index) => (state.locked[index] ? letter.toUpperCase() : "_"))
    .join(" ");
  targetWordEl.textContent = display;
  hintEl.textContent = `${state.locked.filter(Boolean).length} locked, ${state.sparks} sparks`;
}

function clearSelection() {
  state.selected = [];
  state.word = "";
  highlightSelection();
  updateHud();
}

function startDaily() {
  state.target = getDailyTarget();
  state.locked = Array.from({ length: state.target.length }, () => false);
  state.sparks = 0;
  updateHud();
}

function highlightSelection() {
  const tiles = gridEl.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    tile.classList.remove("selected", "locked", "spark");
    const row = Number(tile.dataset.row);
    const col = Number(tile.dataset.col);
    const isSelected = state.selected.some((item) => item.row === row && item.col === col);
    if (isSelected) {
      tile.classList.add("selected");
    }
  });
}

function isAdjacent(a, b) {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr <= 1 && dc <= 1;
}

function addSelection(row, col) {
  const existingIndex = state.selected.findIndex((tile) => tile.row === row && tile.col === col);
  if (existingIndex === state.selected.length - 2) {
    state.selected.pop();
  } else if (existingIndex !== -1) {
    return;
  } else if (state.selected.length) {
    const last = state.selected[state.selected.length - 1];
    if (!isAdjacent(last, { row, col })) {
      return;
    }
    state.selected.push({ row, col });
  } else {
    state.selected.push({ row, col });
  }

  state.word = state.selected.map((tile) => state.board[tile.row][tile.col].letter).join("");
  highlightSelection();
  updateHud();
}

function handlePointerDown(event) {
  const tile = event.target.closest(".tile");
  if (!tile) {
    return;
  }
  event.preventDefault();
  gridEl.setPointerCapture(event.pointerId);
  state.dragging = true;
  state.pointerId = event.pointerId;
  clearSelection();
  addSelection(Number(tile.dataset.row), Number(tile.dataset.col));
}

function handlePointerMove(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) {
    return;
  }
  event.preventDefault();
  const element = document.elementFromPoint(event.clientX, event.clientY);
  if (!element) {
    return;
  }
  const tile = element.closest(".tile");
  if (!tile) {
    return;
  }
  addSelection(Number(tile.dataset.row), Number(tile.dataset.col));
}

function handlePointerUp(event) {
  if (event.pointerId !== state.pointerId) {
    return;
  }
  event.preventDefault();
  if (gridEl.hasPointerCapture(event.pointerId)) {
    gridEl.releasePointerCapture(event.pointerId);
  }
  state.dragging = false;
  state.pointerId = null;
}

function scoreWord(word) {
  const length = word.length;
  const base = length * length;
  return base * state.multiplier;
}

function submitWord() {
  const word = state.word.toLowerCase();
  if (word.length < 3) {
    messageEl.textContent = "Words must be at least 3 letters.";
    return;
  }
  if (!DICTIONARY.has(word)) {
    messageEl.textContent = "Not in the LexiCrush list. Try another word.";
    state.streak = 0;
    state.multiplier = 1;
    clearSelection();
    updateHud();
    return;
  }

  const baseScore = scoreWord(word);
  state.score += baseScore;
  state.streak += 1;
  state.multiplier = Math.min(5, 1 + Math.floor(state.streak / 4));

  let newLocks = 0;
  let sparks = 0;
  const targetLetters = state.target.split("");
  const wordLetters = word.split("");

  for (let i = 0; i < targetLetters.length; i += 1) {
    if (wordLetters[i] && wordLetters[i] === targetLetters[i] && !state.locked[i]) {
      state.locked[i] = true;
      newLocks += 1;
    }
  }

  wordLetters.forEach((letter, index) => {
    if (targetLetters.includes(letter) && letter !== targetLetters[index]) {
      sparks += 1;
    }
  });

  state.sparks = Math.max(state.sparks, sparks);

  const selectedTiles = [...state.selected];
  const powerClear = word.length >= 6;

  if (powerClear && selectedTiles.length) {
    const pivot = selectedTiles[selectedTiles.length - 1];
    for (let col = 0; col < state.cols; col += 1) {
      selectedTiles.push({ row: pivot.row, col });
    }
    state.score += 20 * state.multiplier;
  }

  crushTiles(selectedTiles);

  if (state.score > state.best) {
    state.best = Math.floor(state.score);
    localStorage.setItem("lexicrush-best", state.best.toString());
  }

  if (state.locked.every(Boolean)) {
    state.level += 1;
    state.streak += 2;
    state.score += 120 * state.multiplier;
    messageEl.textContent = "Word locked! New target unlocked.";
    startDaily();
    buildBoard();
    renderBoard();
  } else if (newLocks > 0) {
    messageEl.textContent = `Sweet! ${newLocks} lock${newLocks === 1 ? "" : "s"} earned.`;
  } else {
    messageEl.textContent = "Nice crush. Keep hunting the target word.";
  }

  clearSelection();
  updateHud();
}

function crushTiles(tiles) {
  const toClear = new Set(tiles.map((tile) => `${tile.row},${tile.col}`));

  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      if (toClear.has(`${row},${col}`)) {
        state.board[row][col] = null;
      }
    }
  }

  for (let col = 0; col < state.cols; col += 1) {
    const newColumn = [];
    for (let row = state.rows - 1; row >= 0; row -= 1) {
      const cell = state.board[row][col];
      if (cell) {
        newColumn.push(cell);
      }
    }
    while (newColumn.length < state.rows) {
      newColumn.push({ letter: randomLetter() });
    }
    for (let row = state.rows - 1, i = 0; row >= 0; row -= 1, i += 1) {
      state.board[row][col] = newColumn[i];
    }
  }

  renderBoard();
}

function shuffleBoard() {
  buildBoard();
  renderBoard();
  state.streak = 0;
  state.multiplier = 1;
  state.score = Math.max(0, state.score - 50);
  messageEl.textContent = "Board shuffled. Streak reset.";
  clearSelection();
  updateHud();
}

submitBtn.addEventListener("click", submitWord);
clearBtn.addEventListener("click", clearSelection);
shuffleBtn.addEventListener("click", shuffleBoard);

gridEl.addEventListener("pointerdown", handlePointerDown);
gridEl.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", handlePointerUp);

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitWord();
  }
  if (event.key === "Escape") {
    clearSelection();
  }
});

buildBoard();
renderBoard();
startDaily();
updateHud();
