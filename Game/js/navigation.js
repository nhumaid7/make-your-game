// NEW: Curtain Transition Functions
function closeCurtains(callback) {
    return new Promise((resolve) => {

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
    await closeCurtains();
    window.location.href = '/Game/templtes/char.html';
    await openCurtains();
}
async function showTutorialWithCurtain()   {
    await closeCurtains();
    window.location.href = '/Game/tutorial.html';
    await openCurtains();
} 

// Screen navigation functions 
function showMainMenu() {
    const hud = document.getElementById('game-hud');
    if (hud) hud.style.display = 'none';
       document.body.style.backgroundImage =
        "url('/Game/assets/images/mainBckground.jpg')";
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
    const hud = document.getElementById('game-hud');
    if (hud) hud.style.display = 'flex';
    
        document.body.style.backgroundImage =
        "url('/Game/assets/images/gameScreenBG.jpg')";
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


const backBtn = document.getElementById("backToMenuBtn");

if (backBtn) {
  backBtn.addEventListener("click", function () {
    const curtainTop = document.getElementById("curtainTop");
    const curtainBottom = document.getElementById("curtainBottom");

    if (curtainTop) curtainTop.classList.add("open");
    if (curtainBottom) curtainBottom.classList.add("open");

    setTimeout(() => {
      window.location.href = "/Game/index.html";
    }, 800);
  });
}
