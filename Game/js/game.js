// main-game.js
// Game state
const gameState = {
    currentLevel: 1,
    score: 0,
    lives: 3,
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    isShowingSequence: false,
    isPlayerTurn: false,
    speed: 3,
    sequenceLength: 5,
    difficulty: 1,
    
    // Cat animation state
    catState: 'normal', // normal, happy, sad
    lastKeyPress: null,
    keyPressTimeout: null
};

// DOM elements
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const optionsScreen = document.getElementById('options-screen');
const creditsScreen = document.getElementById('credits-screen');

const playBtn = document.getElementById('play-btn');
const optionsBtn = document.getElementById('options-btn');
const creditsBtn = document.getElementById('credits-btn');
const exitBtn = document.getElementById('exit-btn');
const supportBtn = document.getElementById('support-btn');

const backFromGameBtn = document.getElementById('back-from-game');
const backFromOptionsBtn = document.getElementById('back-from-options');
const backFromCreditsBtn = document.getElementById('back-from-credits');

const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const sequenceDisplay = document.getElementById('sequence-display');
const gameInstruction = document.getElementById('game-instruction');
const gameStatus = document.getElementById('game-status');
const catImage = document.getElementById('cat-image');

const startBtn = document.getElementById('start-btn');
const repeatBtn = document.getElementById('repeat-btn');
const arrowButtons = document.querySelectorAll('.arrow-btn');

const speedSlider = document.getElementById('speed-slider');
const lengthSlider = document.getElementById('length-slider');
const difficultySlider = document.getElementById('difficulty-slider');

// Curtain elements
const curtainTop = document.getElementById('curtainTop');
const curtainBottom = document.getElementById('curtainBottom');
const curtainSpinner = document.getElementById('curtainSpinner');
const pageContent = document.getElementById('pageContent');

// Curtain Transition Functions
function closeCurtains(callback) {
    return new Promise((resolve) => {
        // Show spinner
        if (curtainSpinner) curtainSpinner.style.display = 'block';
        
        // Fade out content
        if (pageContent) pageContent.classList.add('fade-out');
        
        // Close curtains
        if (curtainTop) curtainTop.classList.add('open');
        if (curtainBottom) curtainBottom.classList.add('open');
        
        // Wait for curtain animation to complete
        setTimeout(() => {
            if (callback) callback();
            resolve();
        }, 800);
    });
}

// Function to open curtains (show new screen)
function openCurtains() {
    return new Promise((resolve) => {
        // Open curtains (remove open class to close them)
        if (curtainTop) curtainTop.classList.remove('open');
        if (curtainBottom) curtainBottom.classList.remove('open');
        
        // Wait for curtain animation
        setTimeout(() => {
            // Hide spinner
            if (curtainSpinner) curtainSpinner.style.display = 'none';
            
            // Fade in content
            if (pageContent) pageContent.classList.remove('fade-out');
            resolve();
        }, 800);
    });
}

// Enhanced navigation functions with curtain effects
async function showMainMenuWithCurtain() {
    await closeCurtains();
    showMainMenu();
    await openCurtains();
}

async function showGameScreenWithCurtain() {
    await closeCurtains(() => {
        // Reset game during curtain transition
        resetGame();
        setCatNormal();
    });
    showGameScreen();
    await openCurtains();
}

async function showOptionsScreenWithCurtain() {
    await closeCurtains();
    showOptionsScreen();
    await openCurtains();
}

async function showCreditsScreenWithCurtain() {
    await closeCurtains();
    showCreditsScreen();
    await openCurtains();
}

// Initialize the game
function initGame() {
    // Setup event listeners for menu buttons with curtain effects
    playBtn.addEventListener('click', showGameScreenWithCurtain);
    optionsBtn.addEventListener('click', showOptionsScreenWithCurtain);
    creditsBtn.addEventListener('click', showCreditsScreenWithCurtain);
    exitBtn.addEventListener('click', exitGame);
    supportBtn.addEventListener('click', supportGame);
    
    // Setup event listeners for back buttons with curtain effects
    backFromGameBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromOptionsBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromCreditsBtn.addEventListener('click', showMainMenuWithCurtain);
    
    // Setup game control buttons
    startBtn.addEventListener('click', startGame);
    repeatBtn.addEventListener('click', showSequence);
    
    // Setup keyboard listeners
    window.addEventListener('keydown', handleKeyPress);
    
    // Setup option sliders
    speedSlider.addEventListener('input', updateSpeed);
    lengthSlider.addEventListener('input', updateLength);
    difficultySlider.addEventListener('input', updateDifficulty);
    
    // Load saved settings
    loadSettings();
}

// Screen navigation functions
function showMainMenu() {
    mainMenu.style.display = 'flex';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'none';
    
    // Remove keyboard focus from game screen
    window.removeEventListener('keydown', handleKeyPress);
}

function showGameScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'flex';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'none';
    
    // Add keyboard listener when game screen is active
    window.addEventListener('keydown', handleKeyPress);
    
    resetGame();
    setCatNormal();
}

function showOptionsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'flex';
    creditsScreen.style.display = 'none';
    window.removeEventListener('keydown', handleKeyPress);
}

function showCreditsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'flex';
    window.removeEventListener('keydown', handleKeyPress);
}

// Cat animation functions
function setCatNormal() {
    gameState.catState = 'normal';
    catImage.src = 'cat-normal.png';
    catImage.alt = 'Normal Cat';
}

function setCatHappy() {
    gameState.catState = 'happy';
    catImage.src = 'cat-happy.png';
    catImage.alt = 'Happy Cat';
    
    // Reset to normal after 1 second
    if (gameState.keyPressTimeout) {
        clearTimeout(gameState.keyPressTimeout);
    }
    gameState.keyPressTimeout = setTimeout(() => {
        if (gameState.isPlaying && !gameState.gameOver) {
            setCatNormal();
        }
    }, 1000);
}

function setCatSad() {
    gameState.catState = 'sad';
    catImage.src = 'cat-sad.png';
    catImage.alt = 'Sad Cat';
    
    // Reset to normal after 1.5 seconds
    if (gameState.keyPressTimeout) {
        clearTimeout(gameState.keyPressTimeout);
    }
    gameState.keyPressTimeout = setTimeout(() => {
        if (gameState.isPlaying && !gameState.gameOver) {
            setCatNormal();
        }
    }, 1500);
}

// Keyboard input handler
function handleKeyPress(event) {
    // Only process keyboard if it's player's turn and game is active
    if (!gameState.isPlayerTurn || !gameState.isPlaying) {
        return;
    }
    
    const key = event.key;
    const direction = keyMap[key];
    
    // If the pressed key is mapped to a direction
    if (direction) {
        event.preventDefault(); // Prevent page scrolling
        handleArrowClick(direction);
        
        // Also visually highlight the corresponding button
        showKeyboardPress(direction);
    }
}

// Game logic functions
function resetGame() {
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.isPlaying = false;
    gameState.isShowingSequence = false;
    gameState.isPlayerTurn = false;
    gameState.gameOver = false;
    
    updateDisplay();
    clearSequenceDisplay();
    gameInstruction.textContent = 'Click "Start Sequence" or press SPACE to begin!';
    gameStatus.textContent = 'Ready to play!';
    gameStatus.className = 'game-status';
    
    setCatNormal();
    
    startBtn.disabled = false;
    repeatBtn.disabled = true;
    setArrowButtonsEnabled(false);
}

function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    gameState.gameOver = false;
    gameState.sequence = generateSequence();
    gameState.playerSequence = [];
    
    updateDisplay();
    gameInstruction.textContent = 'Watch the sequence carefully!';
    gameStatus.textContent = 'Showing sequence...';
    gameStatus.className = 'game-status';
    
    setCatNormal();
    
    startBtn.disabled = true;
    repeatBtn.disabled = false;
    setArrowButtonsEnabled(false);
    
    showSequence();
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.gameOver = true;
    gameState.isPlayerTurn = false;
    
    // CAT SAD for game over
    setCatSad();
    
    gameInstruction.textContent = 'Game Over!';
    gameStatus.textContent = `Final Score: ${gameState.score}. Press SPACE to play again.`;
    gameStatus.className = 'game-status error';
    
    startBtn.disabled = false;
    repeatBtn.disabled = true;
    setArrowButtonsEnabled(false);
}

function updateDisplay() {
    levelDisplay.textContent = gameState.currentLevel;
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
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
    localStorage.setItem('fatCatFestSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('fatCatFestSettings');
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

// Keyboard shortcut for Start/Repeat
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
    alert('Thank you for your support! 🐱\n\nIn a real game, this would redirect to a support page.');
}

// Enhanced exit function with curtain effect
async function exitGame() {
    if (confirm('Are you sure you want to exit Fat Cat Fest?')) {
        await closeCurtains();
        setTimeout(() => {
            alert('Thanks for playing! Come back soon for more cat adventures! 🎭🐱');
        }, 800);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);