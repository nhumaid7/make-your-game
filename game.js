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
    difficulty: 1
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

const startBtn = document.getElementById('start-btn');
const repeatBtn = document.getElementById('repeat-btn');
const arrowButtons = document.querySelectorAll('.arrow-btn');

const speedSlider = document.getElementById('speed-slider');
const lengthSlider = document.getElementById('length-slider');
const difficultySlider = document.getElementById('difficulty-slider');

// Arrow directions and their corresponding icons
const arrowDirections = ['up', 'down', 'left', 'right'];
const arrowIcons = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
};

// Initialize the game
function initGame() {
    // Setup event listeners for menu buttons
    playBtn.addEventListener('click', showGameScreen);
    optionsBtn.addEventListener('click', showOptionsScreen);
    creditsBtn.addEventListener('click', showCreditsScreen);
    exitBtn.addEventListener('click', exitGame);
    supportBtn.addEventListener('click', supportGame);
    
    // Setup event listeners for back buttons
    backFromGameBtn.addEventListener('click', showMainMenu);
    backFromOptionsBtn.addEventListener('click', showMainMenu);
    backFromCreditsBtn.addEventListener('click', showMainMenu);
    
    // Setup game control buttons
    startBtn.addEventListener('click', startGame);
    repeatBtn.addEventListener('click', showSequence);
    
    // Setup arrow button listeners
    arrowButtons.forEach(btn => {
        btn.addEventListener('click', () => handleArrowClick(btn.dataset.direction));
    });
    
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
}

function showGameScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'flex';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'none';
    
    resetGame();
}

function showOptionsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'flex';
    creditsScreen.style.display = 'none';
}

function showCreditsScreen() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'flex';
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
    
    updateDisplay();
    clearSequenceDisplay();
    gameInstruction.textContent = 'Click "Start Sequence" to begin!';
    gameStatus.textContent = 'Ready to play!';
    gameStatus.className = 'game-status';
    
    startBtn.disabled = false;
    repeatBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = true);
}

function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    gameState.sequence = generateSequence();
    gameState.playerSequence = [];
    
    updateDisplay();
    gameInstruction.textContent = 'Watch the sequence carefully!';
    gameStatus.textContent = 'Showing sequence...';
    
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
            
            // Remove highlight after a short time
            setTimeout(() => {
                arrowBtn.classList.remove('highlight');
                
                // If this is the last arrow, enable player turn
                if (index === gameState.sequence.length - 1) {
                    setTimeout(() => {
                        gameState.isShowingSequence = false;
                        gameState.isPlayerTurn = true;
                        gameInstruction.textContent = 'Your turn! Repeat the sequence.';
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
    
    // Remove active class from all arrows
    arrowElements.forEach(arrow => arrow.classList.remove('active'));
    
    // Add active class to current arrow
    if (arrowElements[index]) {
        arrowElements[index].classList.add('active');
    }
}

function handleArrowClick(direction) {
    if (!gameState.isPlayerTurn) return;
    
    // Add to player sequence
    gameState.playerSequence.push(direction);
    
    // Highlight the clicked button
    const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
    arrowBtn.classList.add('highlight');
    setTimeout(() => arrowBtn.classList.remove('highlight'), 300);
    
    // Highlight the corresponding sequence arrow
    const arrowIndex = gameState.playerSequence.length - 1;
    highlightSequenceArrow(arrowIndex);
    
    // Check if the sequence is correct so far
    if (direction !== gameState.sequence[arrowIndex]) {
        // Wrong sequence
        gameState.lives--;
        gameState.isPlayerTurn = false;
        
        gameInstruction.textContent = 'Wrong arrow! Try again.';
        gameStatus.textContent = `Incorrect! You have ${gameState.lives} lives remaining.`;
        gameStatus.className = 'game-status error';
        
        arrowButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = true;
        repeatBtn.disabled = false;
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            // Allow player to retry the same sequence
            setTimeout(() => {
                gameInstruction.textContent = 'Click "Repeat Sequence" to try again.';
            }, 1500);
        }
        
        updateDisplay();
        return;
    }
    
    // Check if player completed the sequence
    if (gameState.playerSequence.length === gameState.sequence.length) {
        // Correct sequence completed
        gameState.score += gameState.currentLevel * 10 * gameState.difficulty;
        gameState.currentLevel++;
        
        gameInstruction.textContent = 'Excellent! Sequence correct!';
        gameStatus.textContent = `Level ${gameState.currentLevel} starting soon...`;
        gameStatus.className = 'game-status success';
        
        gameState.isPlayerTurn = false;
        arrowButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = true;
        repeatBtn.disabled = true;
        
        updateDisplay();
        
        // Start next level after a delay
        setTimeout(() => {
            gameState.sequence = generateSequence();
            gameInstruction.textContent = 'Get ready for the next sequence!';
            gameStatus.textContent = 'Showing sequence...';
            
            setTimeout(showSequence, 1000);
        }, 2000);
    }
}

function gameOver() {
    gameState.isPlaying = false;
    
    gameInstruction.textContent = 'Game Over!';
    gameStatus.textContent = `Final Score: ${gameState.score}. Click "Start Sequence" to play again.`;
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

// Other button functions
function supportGame() {
    alert('Thank you for your support! 🎮\n\nIn a real game, this would redirect to a support page.');
}

function exitGame() {
    if (confirm('Are you sure you want to exit Fat Cat Fest?')) {
        alert('Thanks for playing! Come back soon for more arrow challenges!');
        // In a real implementation, this might close the window or redirect
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);