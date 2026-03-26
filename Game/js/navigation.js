// NEW: Curtain Transition Functions
function closeCurtains(callback) {
    return new Promise((resolve) => {

        const page = document.getElementById("pageContent");
        const top = document.getElementById("curtainTop");
        const bottom = document.getElementById("curtainBottom");

        // Fade out content
        if (page) page.classList.add('fade-out');

        // Close curtains
        if (top) top.classList.add('open');
        if (bottom) bottom.classList.add('open');

        setTimeout(() => {
            if (callback) callback();
            resolve();
        }, 800);
    });
}

// NEW: Function to open curtains (show new screen)
function openCurtains() {
    return new Promise((resolve) => {

        const page = document.getElementById("pageContent");
        const top = document.getElementById("curtainTop");
        const bottom = document.getElementById("curtainBottom");

        if (top) top.classList.remove('open');
        if (bottom) bottom.classList.remove('open');

        setTimeout(() => {
            if (page) page.classList.remove('fade-out');
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
        setCharNormal();
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

//char.js
async function showCharacterChooserWithCurtain() {

    AudioManager.playMusic(MENU_MUSIC);

    await closeCurtains();
    window.location.href = '/Game/char.html';
    await openCurtains();
}
async function showTutorialWithCurtain()   {

    AudioManager.playMusic(MENU_MUSIC);

    await closeCurtains();
    window.location.href = '/Game/tutorial.html';
    await openCurtains();
} 

// Screen navigation functions 
function showMainMenu() {

    AudioManager.playMusic(MENU_MUSIC);


    const hud = document.getElementById('game-hud');
    if (hud) hud.style.display = 'none';
       document.body.style.backgroundImage =
        "url('/Game/assets/images/menuu.svg')";
    // document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";


    stopRhythmGame(); // Ensure rhythm game is stopped when returning to main menu
    mainMenu.style.display = 'flex';
    gameScreen.style.display = 'none';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'none';

    // Remove keyboard focus from game screen
    window.removeEventListener('keydown', handleKeyPress);
}

function showGameScreen() {

    AudioManager.stopMusic()
    const hud = document.getElementById('game-hud');
    if (hud) hud.style.display = 'flex';
    
        document.body.style.backgroundImage =
        "url('/Game/assets/images/game.svg')";
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";


    mainMenu.style.display = 'none';
    gameScreen.style.display = 'flex';
    optionsScreen.style.display = 'none';
    creditsScreen.style.display = 'none';
   

    // Add keyboard listener when game screen is active
    window.addEventListener('keydown', handleKeyPress);

    resetGame();
    setCharNormal(); // Set normal character at start
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

document.addEventListener("DOMContentLoaded", function () {
    const curtainTop = document.getElementById("curtainTop");
    const curtainBottom = document.getElementById("curtainBottom");

    // Small delay so animation feels smooth
    setTimeout(() => {
        curtainTop.classList.remove("open");
        curtainBottom.classList.remove("open");
    }, 100);
});


// document.querySelectorAll('.back-btn, .back-to-menu-btn').forEach((btn) => {
//     btn.addEventListener('click', async () => {
//                 console.log('game back clicked');

//         await closeCurtains();
//         window.location.href = '/Game/index.html';
//     });
// });

