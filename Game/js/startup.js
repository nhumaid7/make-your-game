function goToMainMenu() {
    closeCurtains().then(() => {
        window.location.href = '/Game/index.html';
    });
}

function initGame() {
    if (playBtn) playBtn.addEventListener('click', showCharacterChooserWithCurtain);
    if (optionsBtn) optionsBtn.addEventListener('click', showOptionsScreenWithCurtain);
    if (creditsBtn) creditsBtn.addEventListener('click', showCreditsScreenWithCurtain);
    if (exitBtn) exitBtn.addEventListener('click', exitGame);
    if (supportBtn) supportBtn.addEventListener('click', supportGame);

    if (backFromGameBtn) backFromGameBtn.addEventListener('click', goToMainMenu);
    if (backFromOptionsBtn) backFromOptionsBtn.addEventListener('click', goToMainMenu);
    if (backFromCreditsBtn) backFromCreditsBtn.addEventListener('click', goToMainMenu);

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

    arrowButtons.forEach((btn) => {
        btn.addEventListener('click', () => handleArrowClick(btn.dataset.direction));
    });

    window.addEventListener('keydown', handleKeyPress);

    if (speedSlider) speedSlider.addEventListener('input', updateSpeed);
    if (lengthSlider) lengthSlider.addEventListener('input', updateLength);
    if (difficultySlider) difficultySlider.addEventListener('input', updateDifficulty);

    loadSettings();
    loadSelectedCharacter();

    const params = new URLSearchParams(window.location.search);
    const isPlayPage =
        window.location.pathname.endsWith('/Game/play.html') ||
        window.location.pathname.endsWith('/play.html');

    if (isPlayPage || params.get('play') === '1') {
        showGameScreen();
    }
}
function applyPlayerSettings() {
    gameState.baseSpeed = parseInt(gameState.speed) || 3;
    gameState.baseDifficulty = parseInt(gameState.difficulty) || 1;

    gameState.baseSpawnInterval = Math.max(800, 2000 - (gameState.sequenceLength * 150));
    gameState.arrowSpeed = gameState.baseSpeed;
}
// Options functions
function updateSpeed() {
    gameState.speed = parseInt(speedSlider.value);
    applyPlayerSettings();
    saveSettings();
}

function updateLength() {
    gameState.sequenceLength = parseInt(lengthSlider.value);
    applyPlayerSettings();
    saveSettings();
}

function updateDifficulty() {
    gameState.difficulty = parseInt(difficultySlider.value);
    applyPlayerSettings();
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

    applyPlayerSettings();
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