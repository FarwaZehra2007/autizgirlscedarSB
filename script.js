const choices = {};

const FOOD_IMAGES = {
  eggs: 'images/eggs.png',
  pancakes: 'images/pancakes.png'
};

const TOTAL_STAGES = 8; // highest data-stage value used across screens

function showScreen(id) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (current) current.classList.remove('active');
  next.classList.add('active');
  updateProgress(next);
  spawnSparkles(next);
}

function updateProgress(screenEl) {
  const stage = Number(screenEl.dataset.stage || 0);
  const dotsWrap = screenEl.querySelector('.progress');
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  if (!stage) return; // start & stats screens carry no stage
  for (let i = 1; i <= TOTAL_STAGES; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i <= stage ? ' done' : '');
    dotsWrap.appendChild(dot);
  }
}

// a handful of soft, drifting decorative sparkles/hearts per screen —
// purely visual, regenerated each time a screen becomes active so it
// never feels static. Respects prefers-reduced-motion via CSS.
const SPARKLE_GLYPHS = ['✦', '✧', '❀', '♡'];

function spawnSparkles(screenEl) {
  const layer = screenEl.querySelector('.sparkle-layer');
  if (!layer) return;
  layer.innerHTML = '';
  const count = 8;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'sparkle';
    el.textContent = SPARKLE_GLYPHS[i % SPARKLE_GLYPHS.length];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = 14 + Math.random() * 16 + 'px';
    const duration = 9 + Math.random() * 8;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = -Math.random() * duration + 's';
    layer.appendChild(el);
  }
}

function choose(category, value, nextScreenId) {
  choices[category] = value;
  showScreen(nextScreenId);
}

function chooseFood(value) {
  choices.breakfast = value;

  const overlay = document.getElementById('food-overlay');
  overlay.src = FOOD_IMAGES[value];
  overlay.alt = value;

  document.getElementById('cookingText').textContent =
    value === 'pancakes' ? 'Pancakes it is!' : 'Eggs it is!';

  showScreen('cooking');
}

// FAKE stats — replace with real numbers when you have them
const stats = {
  breakfast: { pancakes: 62, eggs: 38 },
  activity:  { gym: 47, pool: 53 },
  evening:   { concert: 58, lounge: 42 },
  sleep:     { early: 71, late: 29 }
};

function showStats() {
  let html = '';
  for (const category in choices) {
    const value = choices[category];
    const pct = stats[category][value];
    html += `<span class="stat-line">${pct}% of players also picked "${value}" for ${category}.</span>`;
  }
  document.getElementById('statsText').innerHTML = html;
}

function restart() {
  for (const key in choices) delete choices[key];
  showScreen('start');
}

// kick off sparkles on the very first (start) screen
document.addEventListener('DOMContentLoaded', () => {
  spawnSparkles(document.getElementById('start'));
});
