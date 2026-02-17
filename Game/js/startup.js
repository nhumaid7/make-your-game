// set up actions and event listeners for the game
function initGame() {
    // UPDATED: Setup event listeners for menu buttons with curtain effects
    playBtn.addEventListener('click', showCharacterChooserWithCurtain);
    optionsBtn.addEventListener('click', showOptionsScreenWithCurtain);
    creditsBtn.addEventListener('click', showCreditsScreenWithCurtain);
    exitBtn.addEventListener('click', exitGame);
    if (supportBtn) {
        supportBtn.addEventListener('click', supportGame);
    }

    // UPDATED: Setup event listeners for back buttons with curtain effects
    backFromGameBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromOptionsBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromCreditsBtn.addEventListener('click', showMainMenuWithCurtain);

    // Setup game control buttons
    startBtn.addEventListener('click', startGame);
    repeatBtn.addEventListener('click', showSequence);
    arrowButtons.forEach((btn) => {
        btn.addEventListener('click', () => handleArrowClick(btn.dataset.direction));
    });

    // Setup keyboard listeners (main change for keyboard input)
    window.addEventListener('keydown', handleKeyPress);

    // Setup option sliders
    speedSlider.addEventListener('input', updateSpeed);
    lengthSlider.addEventListener('input', updateLength);
    difficultySlider.addEventListener('input', updateDifficulty);

    // Load saved settings
    loadSettings();
    loadSelectedCharacter();

    const params = new URLSearchParams(window.location.search);
    const isPlayPage = window.location.pathname.endsWith('/Game/play.html') || window.location.pathname.endsWith('/play.html');
    if (isPlayPage || params.get('play') === '1') {
        showGameScreen();
    }
}

// Options functions
function updateSpeed() {
    gameState.speed = parseInt(speedSlider.value);
    saveSettings();
}

function updateLength() {
    gameState.sequenceLength = parseInt(lengthSlider.value);
    saveSettings();
}

function updateDifficulty() {
    gameState.difficulty = parseInt(difficultySlider.value);
    saveSettings();
}

function saveSettings() {
    const settings = {
        speed: gameState.speed,
        sequenceLength: gameState.sequenceLength,
        difficulty: gameState.difficulty
    };
    localStorage.setItem('friendsSettings', JSON.stringify(settings));
}

// load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('friendsSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        gameState.speed = settings.speed || 3;
        gameState.sequenceLength = settings.sequenceLength || 5;
        gameState.difficulty = settings.difficulty || 1;

        speedSlider.value = gameState.speed;
        lengthSlider.value = gameState.sequenceLength;
        difficultySlider.value = gameState.difficulty;
    }
}

// Add keyboard shortcut for Start/Repeat 
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && gameScreen.style.display === 'flex') {
        event.preventDefault();
        if (startBtn.disabled === false) {
            startGame();
        } else if (repeatBtn.disabled === false && !gameState.isShowingSequence) {
            showSequence();
        }
    }

    // R key for repeat sequence
    if (event.key === 'r' || event.key === 'R') {
        if (repeatBtn.disabled === false && !gameState.isShowingSequence && gameScreen.style.display === 'flex') {
            showSequence();
        }
    }
});

// Other button functions 
function supportGame() {
    alert('Thank you for your support! \n\nIn a real game, this would redirect to a support page.');
}

// NEW: Enhanced exit function with curtain effect
async function exitGame() {
    if (confirm('Are you sure you want to exit Friends?')) {
        await closeCurtains();
        setTimeout(() => {
            alert('Thanks for playing! Come back soon for more Friends adventures!');
            // In a real implementation, this might close the window or redirect
        }, 800);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);