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

// NEW: Curtain elements
const curtainTop = document.getElementById('curtainTop');
const curtainBottom = document.getElementById('curtainBottom');
const curtainSpinner = document.getElementById('curtainSpinner');
const pageContent = document.getElementById('pageContent');

// Keyboard mapping
const keyMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'W': 'up',
    'S': 'down',
    'A': 'left',
    'D': 'right'
};

// Arrow directions and their corresponding icons
const arrowDirections = ['up', 'down', 'left', 'right'];
const arrowIcons = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
};

// NEW: Curtain Transition Functions
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
        }, 800); // Match this with CSS transition time
    });
}

// NEW: Function to open curtains (show new screen)
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

// NEW: Enhanced navigation functions with curtain effects
async function showMainMenuWithCurtain() {
    await closeCurtains();
    showMainMenu(); // Your existing function
    await openCurtains();
}

async function showGameScreenWithCurtain() {
    await closeCurtains(() => {
        // Reset game during curtain transition
        resetGame();
        setCatNormal();
    });
    showGameScreen(); // Your existing function
    await openCurtains();
}

async function showOptionsScreenWithCurtain() {
    await closeCurtains();
    showOptionsScreen(); // Your existing function
    await openCurtains();
}

async function showCreditsScreenWithCurtain() {
    await closeCurtains();
    showCreditsScreen(); // Your existing function
    await openCurtains();
}

// Initialize the game
function initGame() {
    // UPDATED: Setup event listeners for menu buttons with curtain effects
    playBtn.addEventListener('click', showGameScreenWithCurtain);
    optionsBtn.addEventListener('click', showOptionsScreenWithCurtain);
    creditsBtn.addEventListener('click', showCreditsScreenWithCurtain);
    exitBtn.addEventListener('click', exitGame);
    supportBtn.addEventListener('click', supportGame);
    
    // UPDATED: Setup event listeners for back buttons with curtain effects
    backFromGameBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromOptionsBtn.addEventListener('click', showMainMenuWithCurtain);
    backFromCreditsBtn.addEventListener('click', showMainMenuWithCurtain);
    
    // Setup game control buttons
    startBtn.addEventListener('click', startGame);
    repeatBtn.addEventListener('click', showSequence);
    
    // Setup keyboard listeners (main change for keyboard input)
    window.addEventListener('keydown', handleKeyPress);
    
    // Setup option sliders
    speedSlider.addEventListener('input', updateSpeed);
    lengthSlider.addEventListener('input', updateLength);
    difficultySlider.addEventListener('input', updateDifficulty);
    
    // Load saved settings
    loadSettings();
}

// Screen navigation functions (YOUR EXISTING FUNCTIONS - UNCHANGED)
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
    backFromGameBtn.addEventListener('click', showMainMenuWithCurtain);

    
    // Add keyboard listener when game screen is active
    window.addEventListener('keydown', handleKeyPress);
    
    resetGame();
    setCatNormal(); // Set normal cat at start
}

function showOptionsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'flex';
    creditsScreen.style.display = 'none';
    backFromOptionsBtn.addEventListener('click',showMainMenu)
    window.removeEventListener('keydown', handleKeyPress);
}

function showCreditsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'flex';
    backFromCreditsBtn.addEventListener('click',showMainMenu)
    window.removeEventListener('keydown', handleKeyPress);
}

// Cat animation functions (YOUR EXISTING FUNCTIONS - UNCHANGED)
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

// Keyboard input handler (YOUR EXISTING FUNCTION - UNCHANGED)
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
        const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
        if (arrowBtn) {
            arrowBtn.classList.add('keyboard-press');
            setTimeout(() => arrowBtn.classList.remove('keyboard-press'), 200);
        }
    }
}

// Game logic functions (YOUR EXISTING FUNCTIONS - UNCHANGED)
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
    
    setCatNormal(); // Reset cat to normal
    
    startBtn.disabled = false;
    repeatBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = true);
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
    arrowButtons.forEach(btn => btn.disabled = true);
    
    showSequence();
}

function generateSequence() {
    const sequence = [];
    const baseLength = gameState.sequenceLength;
    const difficulty = gameState.difficulty;
    
    // Increase sequence length based on level and difficulty
    const length = baseLength + Math.floor((gameState.currentLevel - 1) / 2) + (difficulty - 1);
    
    for (let i = 0; i < length; i++) {
        const randomDirection = arrowDirections[Math.floor(Math.random() * arrowDirections.length)];
        sequence.push(randomDirection);
    }
    
    return sequence;
}

function showSequence() {
    if (gameState.isShowingSequence) return;
    
    gameState.isShowingSequence = true;
    gameState.playerSequence = [];
    clearSequenceDisplay();
    
    // Create sequence display
    gameState.sequence.forEach((direction, index) => {
        const arrowElement = document.createElement('div');
        arrowElement.className = 'sequence-arrow';
        arrowElement.textContent = arrowIcons[direction];
        arrowElement.dataset.index = index;
        sequenceDisplay.appendChild(arrowElement);
    });
    
    // Animate the sequence
    let delay = 0;
    const baseSpeed = 800 - (gameState.speed - 1) * 150; // 800ms to 400ms
    
    gameState.sequence.forEach((direction, index) => {
        setTimeout(() => {
            highlightSequenceArrow(index);
            
            // Highlight the corresponding control button
            const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
            arrowBtn.classList.add('highlight');
            
            setTimeout(() => {
                arrowBtn.classList.remove('highlight');
                
                if (index === gameState.sequence.length - 1) {
                    setTimeout(() => {
                        gameState.isShowingSequence = false;
                        gameState.isPlayerTurn = true;
                        gameInstruction.textContent = 'Your turn! Use arrow keys or WASD!';
                        gameStatus.textContent = 'Enter the sequence now!';
                        
                        arrowButtons.forEach(btn => btn.disabled = false);
                        repeatBtn.disabled = false;
                    }, 500);
                }
            }, 300);
        }, delay);
        
        delay += baseSpeed;
    });
}

function highlightSequenceArrow(index) {
    const arrowElements = document.querySelectorAll('.sequence-arrow');
    
    arrowElements.forEach(arrow => arrow.classList.remove('active'));
    
    if (arrowElements[index]) {
        arrowElements[index].classList.add('active');
    }
}

function handleArrowClick(direction) {
    if (!gameState.isPlayerTurn || !gameState.isPlaying) return;
    
    // Add to player sequence
    gameState.playerSequence.push(direction);
    gameState.lastKeyPress = direction;
    
    // Check if the sequence is correct so far
    const currentIndex = gameState.playerSequence.length - 1;
    
    if (direction !== gameState.sequence[currentIndex]) {
        // Wrong sequence - CAT SAD
        setCatSad();
        
        gameState.lives--;
        gameState.isPlayerTurn = false;
        
        gameInstruction.textContent = 'Wrong key! Try again.';
        gameStatus.textContent = `Incorrect! You have ${gameState.lives} lives remaining.`;
        gameStatus.className = 'game-status error';
        
        arrowButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = true;
        repeatBtn.disabled = false;
        
        updateDisplay();
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            setTimeout(() => {
                gameInstruction.textContent = 'Press "Repeat Sequence" or R to try again.';
            }, 1500);
        }
        return;
    }
    
    // Correct key press - CAT HAPPY
    setCatHappy();
    
    // Check if player completed the sequence
    if (gameState.playerSequence.length === gameState.sequence.length) {
        // Correct sequence completed
        gameState.score += gameState.currentLevel * 10 * gameState.difficulty;
        gameState.currentLevel++;
        
        gameInstruction.textContent = 'Perfect! Level up!';
        gameStatus.textContent = `Level ${gameState.currentLevel} starting soon...`;
        gameStatus.className = 'game-status success';
        
        gameState.isPlayerTurn = false;
        arrowButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = true;
        repeatBtn.disabled = true;
        
        updateDisplay();
        
        // Start next level after a delay
        setTimeout(() => {
            if (gameState.isPlaying) {
                gameState.sequence = generateSequence();
                gameState.playerSequence = [];
                gameInstruction.textContent = 'Get ready for the next sequence!';
                gameStatus.textContent = 'Showing sequence...';
                gameStatus.className = 'game-status';
                
                setTimeout(showSequence, 1000);
            }
        }, 2000);
    }
    
    updateDisplay();
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
    arrowButtons.forEach(btn => btn.disabled = true);
}

function clearSequenceDisplay() {
    sequenceDisplay.innerHTML = '';
}

function updateDisplay() {
    levelDisplay.textContent = gameState.currentLevel;
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
}

// Options functions (YOUR EXISTING FUNCTIONS - UNCHANGED)
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

// Add keyboard shortcut for Start/Repeat (YOUR EXISTING CODE - UNCHANGED)
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

// Other button functions (YOUR EXISTING FUNCTIONS - UNCHANGED)
function supportGame() {
    alert('Thank you for your support! 🐱\n\nIn a real game, this would redirect to a support page.');
}

// NEW: Enhanced exit function with curtain effect
async function exitGame() {
    if (confirm('Are you sure you want to exit Fat Cat Fest?')) {
        await closeCurtains();
        setTimeout(() => {
            alert('Thanks for playing! Come back soon for more cat adventures! 🎭🐱');
            // In a real implementation, this might close the window or redirect
        }, 800);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);