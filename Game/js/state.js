// initialize game state and DOM (Document Object Model) elements
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

    // Character animation state
    charState: 'normal', // normal, happy, sad
    lastKeyPress: null,
    keyPressTimeout: null,
    selectedCharacter: {
        name: 'Chandler',
        image: '/Game/assets/images/chandler/chandler.svg'
    }
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
const charImage = document.getElementById('char-image');

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

function loadSelectedCharacter() {
    const savedCharacter = localStorage.getItem('friendsSelectedCharacter');
    if (!savedCharacter) {
        return;
    }

    try {
        const parsedCharacter = JSON.parse(savedCharacter);
        if (parsedCharacter && parsedCharacter.image) {
            gameState.selectedCharacter = parsedCharacter;
        }
    } catch (error) {
        gameState.selectedCharacter = {
            name: 'Chandler',
            image: '/Game/assets/images/chandler/chandler.svg'
        };
    }
}