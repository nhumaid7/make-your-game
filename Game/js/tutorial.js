const tutorialStatus = document.getElementById('tutorialStatus');
const startGameBtn = document.getElementById('startGameBtn');
const tutorialItems = document.querySelectorAll('.tutorial-item');

const pressedDirections = new Set();

const tutorialKeyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
    W: 'up',
    A: 'left',
    S: 'down',
    D: 'right'
};

function updateTutorialUI() {
    tutorialItems.forEach((item) => {
        const direction = item.dataset.dir;
        item.classList.toggle('done', pressedDirections.has(direction));
    });

    const remaining = 4 - pressedDirections.size;
    if (remaining > 0) {
        tutorialStatus.textContent = `${remaining} direction(s) left.`;
        return;
    }

    tutorialStatus.textContent = 'Great! Tutorial complete.';
    startGameBtn.disabled = false;
}

window.addEventListener('keydown', (event) => {
    const direction = tutorialKeyMap[event.key];
    if (!direction) {
        return;
    }

    event.preventDefault();
    pressedDirections.add(direction);
    updateTutorialUI();
});

startGameBtn.addEventListener('click', () => {
    window.location.href = '/Game/index.html?play=1';
});

updateTutorialUI();
