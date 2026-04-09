/* =============================================
   TUTORIAL — Sequence Strip
   All 4 arrows shown; press the matching key
   to consume each one; auto-navigates to game.
   ============================================= */

const ARROW_IMAGES = {
    up:    '/Game/assets/images/char/up.png',
    down:  '/Game/assets/images/char/down.png',
    left:  '/Game/assets/images/char/prev.png',
    right: '/Game/assets/images/char/next.png'
};

const KEY_MAP = {
    ArrowUp: 'up', ArrowDown: 'down',
    ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right'
};

// Shuffle all 4 directions into a random sequence
function shuffleSequence() {
    const dirs = ['up', 'down', 'left', 'right'];
    for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    return dirs;
}

let sequence = shuffleSequence();
let currentIndex = 0;
let animating = false;

const arrowTrack  = document.getElementById('tutArrowTrack');
const tutHint     = document.getElementById('tutHint');

/* Build the arrow elements */
function buildStrip() {
    arrowTrack.innerHTML = '';
    sequence.forEach((dir, i) => {
        const el = document.createElement('div');
        el.className = 'tut-arrow' + (i === 0 ? ' tut-arrow--current' : '');
        el.dataset.dir = dir;
        el.style.setProperty('--idx', i);

        const img = document.createElement('img');
        img.src = ARROW_IMAGES[dir];
        img.alt = dir;
        el.appendChild(img);
        arrowTrack.appendChild(el);
    });
}

/* Consume the current (first) arrow */
function consumeCurrent() {
    if (animating) return;
    animating = true;

    const arrows = arrowTrack.querySelectorAll('.tut-arrow');
    const first  = arrows[0];
    if (!first) return;

    // Fly the first arrow out to the left
    first.classList.add('tut-arrow--exit');

    first.addEventListener('animationend', () => {
        first.remove();
        currentIndex++;

        // Mark next arrow as current
        const next = arrowTrack.querySelector('.tut-arrow');
        if (next) {
            next.classList.add('tut-arrow--current');
            tutHint.textContent = 'Nice! Keep going!';
        }

        animating = false;

if (currentIndex >= sequence.length) {
    tutHint.textContent = 'Great! Loading the game…';
    setTimeout(async () => {
        if (typeof closeCurtains === 'function') {
            await closeCurtains();
        }
        window.location.href = '/Game/index.html?play=1';
    }, 700);
}
    }, { once: true });
}

/* Key handler */
window.addEventListener('keydown', (e) => {
    const dir = KEY_MAP[e.key];
    if (!dir) return;
    e.preventDefault();

    if (animating || currentIndex >= sequence.length) return;

    const current = sequence[currentIndex];
    if (dir === current) {
        AudioManager.playButtonSfx();
        consumeCurrent();
    } else {
        // Wrong key — shake the target zone
        const target = document.getElementById('tutTargetZone');
        target.classList.remove('tut-shake');
        void target.offsetWidth; // reflow to restart animation
        target.classList.add('tut-shake');
        tutHint.textContent = 'Wrong key — try again!';
        setTimeout(() => { tutHint.textContent = 'Press the matching arrow key!'; }, 800);
    }
});

/* Back button */
const backBtn = document.getElementById('backToMenuBtn');
if (backBtn) {
    backBtn.addEventListener('click', async () => {
        AudioManager.saveMenuPosition();

        if (typeof closeCurtains === 'function') {
            await closeCurtains();
            window.location.href = '/Game/index.html';
        } else {
            window.location.href = '/Game/index.html';
        }
    });
}

/* Start music and build strip when DOM ready */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AudioManager !== 'undefined' && typeof MENU_MUSIC !== 'undefined') {
        AudioManager.playMusic(MENU_MUSIC);
    }
    buildStrip();
});

document.addEventListener('click', () => {
    if (typeof AudioManager !== 'undefined' && typeof MENU_MUSIC !== 'undefined') {
        AudioManager.playMusic(MENU_MUSIC);
    }
}, { once: true });
