// set up actions and event listeners for the game
function initGame() {
    // Setup event listeners for menu buttons with curtain effects
    playBtn.addEventListener('click', showCharacterChooserWithCurtain);
    optionsBtn.addEventListener('click', showOptionsScreenWithCurtain);
    creditsBtn.addEventListener('click', showCreditsScreenWithCurtain);
    exitBtn.addEventListener('click', exitGame);
    if (supportBtn) {
        supportBtn.addEventListener('click', supportGame);
    }

    // Setup event listeners for back buttons with curtain effects
    backFromGameBtn.addEventListener('click', showMainMenuWithCurtain);
backFromOptionsBtn.addEventListener('click', showMainMenuWithCurtain);
 backFromCreditsBtn.addEventListener('click', showMainMenuWithCurtain);
    // Setup game control buttons
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    arrowButtons.forEach((btn) => {
        btn.addEventListener('click', () => handleArrowClick(btn.dataset.direction));
    });

    // Setup keyboard listeners
    window.addEventListener('keydown', handleKeyPress);

    // Setup option sliders
    if (speedSlider)speedSlider.addEventListener('input', updateSpeed);
    if (lengthSlider)lengthSlider.addEventListener('input', updateLength);
    if(difficultySlider)difficultySlider.addEventListener('input', updateDifficulty);

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
    // In rhythm game, speed controls arrow movement speed
    gameState.arrowSpeed = gameState.speed; // Map speed slider to arrow speed
    saveSettings();
}

function updateLength() {
    gameState.sequenceLength = parseInt(lengthSlider.value);
    // In rhythm game, length could control spawn rate or difficulty
    // Map to spawn interval (higher length = faster spawns)
    gameState.baseSpawnInterval = Math.max(800, 2000 - (gameState.sequenceLength * 150));
    saveSettings();
}

function updateDifficulty() {
    gameState.difficulty = parseInt(difficultySlider.value);
    // Map difficulty to game parameters
    switch(gameState.difficulty) {
        case 1: // Easy
            gameState.arrowSpeed = 2;
            gameState.baseSpawnInterval = 2000;
            break;
        case 2: // Medium
            gameState.arrowSpeed = 3;
            gameState.baseSpawnInterval = 1500;
            break;
        case 3: // Hard
            gameState.arrowSpeed = 4;
            gameState.baseSpawnInterval = 1000;
            break;
    }
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
        
        // Apply settings to rhythm game
        updateDifficulty(); // This will set arrowSpeed and baseSpawnInterval based on difficulty
    }
}

// Add keyboard shortcut for Start
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && gameScreen.style.display === 'flex') {
        event.preventDefault();
        if (startBtn.disabled === false) {
            startGame();
        }
    }

    // P key toggles pause/resume when a game is active
    if ((event.key === 'p' || event.key === 'P') && gameScreen.style.display === 'flex') {
        if (gameState.isPlaying) togglePause();
    }
});

// Enhanced exit function with curtain effect
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