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
    gamePaused: false,
    speed: 3,
    sequenceLength: 5,
    difficulty: 1,
    baseSpeed: 3,
baseSpawnInterval: 2000,
baseDifficulty: 1,
level3TargetActive: false,
targetZoneX: 0,
targetZoneDirection: 1,
targetZoneSpeed: 2,
targetZoneWidth: 80,

    

    // Character animation state
    charState: 'normal', // normal, happy, sad
    lastKeyPress: null,
    keyPressTimeout: null,
    nextCorrectImage: 1,
    selectedCharacter: {
        name: 'Chandler',
        image: '/Game/assets/images/chandler/chandler.svg',
        imageSelect: '/Game/assets/images/chandler/chandler.svg',
        imageRight1: '/Game/assets/images/chandler/chandler 1.svg',
        imageRight2: '/Game/assets/images/chandler/chandler 2.svg',
        imageWrong: '/Game/assets/images/chandler/chandler 0.svg'
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
const pauseBtn = document.getElementById('pause-btn');
const arrowButtons = document.querySelectorAll('.arrow-btn');

const speedSlider = document.getElementById('speed-slider');
const lengthSlider = document.getElementById('length-slider');
const difficultySlider = document.getElementById('difficulty-slider');

// NEW: Curtain elements
const curtainTop = document.getElementById('curtainTop');
const curtainBottom = document.getElementById('curtainBottom');
const curtainSpinner = document.getElementById('curtainSpinner');
const pageContent = document.getElementById('pageContent');

//New: Pause menu elements
const pauseOverlay = document.getElementById('pause-overlay');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
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
        if (parsedCharacter && parsedCharacter.name) {
            const characterFolder = parsedCharacter.name.toLowerCase();
            const baseImage =
                parsedCharacter.image ||
                parsedCharacter.imageSelect ||
                `/Game/assets/images/${characterFolder}/${characterFolder}.svg`;

            gameState.selectedCharacter = {
                ...parsedCharacter,
                image: baseImage,
                imageSelect: parsedCharacter.imageSelect || baseImage,
                imageRight1:
                    parsedCharacter.imageRight1 ||
                    `/Game/assets/images/${characterFolder}/${characterFolder} 1.svg`,
                imageRight2:
                    parsedCharacter.imageRight2 ||
                    `/Game/assets/images/${characterFolder}/${characterFolder} 2.svg`,
                imageWrong:
                    parsedCharacter.imageWrong ||
                    `/Game/assets/images/${characterFolder}/${characterFolder} 0.svg`
            };
        }
    } catch (error) {
        gameState.selectedCharacter = {
            name: 'Chandler',
            image: '/Game/assets/images/chandler/chandler.svg',
            imageSelect: '/Game/assets/images/chandler/chandler.svg',
            imageRight1: '/Game/assets/images/chandler/chandler 1.svg',
            imageRight2: '/Game/assets/images/chandler/chandler 2.svg',
            imageWrong: '/Game/assets/images/chandler/chandler 0.svg'
        };
    }
}


