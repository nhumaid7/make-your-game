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
    gameState.correctInLevel = 0;

    updateDisplay();
    clearSequenceDisplay();
    gameInstruction.textContent = 'Click "Start Sequence" or press SPACE to begin!';
    gameStatus.textContent = 'Ready to play!';
    gameStatus.className = 'game-status';

    setCharNormal(); // Reset character to normal

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
    gameState.correctInLevel = 0;

    updateDisplay();
    gameInstruction.textContent = 'Press the next matching arrow (or WASD)!';
    gameStatus.textContent = 'Game started. Follow the sequence queue.';
    gameStatus.className = 'game-status';

    setCharNormal();

    startBtn.disabled = true;
    repeatBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = false);

    showSequence();
}

// Repeat the current sequence but reset score and lives so the player can try again
function repeatGame() {
    // clear any pending move timer
    clearMoveTimer();

    // Reset requested values
    gameState.lives = 3;
    gameState.score = 0;
    gameState.gameOver = false;
    gameState.isPlaying = true;
    gameState.isPlayerTurn = false;
    gameState.playerSequence = [];

    updateDisplay();
    setCharNormal();

    startBtn.disabled = true;
    // We'll disable repeat while the sequence is being shown/played
    repeatBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = false);

    // Ensure there's a sequence to replay
    if (!gameState.sequence.length) {
        gameState.sequence = generateSequence();
    }

    // Show the sequence (this will start the move timer once shown)
    showSequence();
}

function generateSequence() {
    const sequence = [];
    const length = Math.max(4, gameState.sequenceLength + (gameState.difficulty - 1));

    for (let i = 0; i < length; i++) {
        const randomDirection = arrowDirections[Math.floor(Math.random() * arrowDirections.length)];
        sequence.push(randomDirection);
    }

    return sequence;
}

function showSequence() {
    if (!gameState.sequence.length) {
        gameState.sequence = generateSequence();
    }

    renderSequenceDisplay();

    // When showing the sequence we disable player input and the repeat button
    repeatBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = true);

    // compute highlight delay from gameState.speed (higher -> faster)
    const baseHighlight = 600; // ms for speed 1
    const speedFactor = Math.max(0, (gameState.speed - 1));
    const highlightDelay = Math.max(80, baseHighlight - speedFactor * 160);

    // sequentially highlight each arrow for the preview
    const arrowElements = Array.from(document.querySelectorAll('.sequence-arrow'));
    let i = 0;

    function playStep() {
        // clear previous active
        arrowElements.forEach(a => a.classList.remove('active'));
        if (arrowElements[i]) {
            arrowElements[i].classList.add('active');
        }
        i++;
        if (i <= arrowElements.length) {
            setTimeout(playStep, highlightDelay);
        } else {
            // finished preview
            arrowElements.forEach(a => a.classList.remove('active'));
            // restore state depending on whether the game is playing
            if (gameState.isPlaying) {
                gameState.isShowingSequence = false;
                gameState.isPlayerTurn = true;
                gameInstruction.textContent = 'Hit the first arrow shown in the queue.';
                gameStatus.textContent = 'Sequence ready. Your turn!';
                gameStatus.className = 'game-status';
                arrowButtons.forEach(btn => btn.disabled = false);
                // enable repeating after preview
                repeatBtn.disabled = false;
                // start the per-step move timer
                startMoveTimer();
            } else {
                gameState.isShowingSequence = false;
                gameState.isPlayerTurn = false;
                gameInstruction.textContent = 'Sequence preview finished.';
                gameStatus.textContent = 'Preview complete.';
                gameStatus.className = 'game-status';
                // allow the user to replay again or start a new game
                repeatBtn.disabled = false;
            }
        }
    }

    // Kick off the preview
    playStep();
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

    // clear any pending move timer because player acted
    clearMoveTimer();
    gameState.lastKeyPress = direction;

    const expectedDirection = gameState.sequence[0];
    const isCorrect = direction === expectedDirection;

    if (!isCorrect) {
        setCharSad();
        gameState.lives--;

        gameInstruction.textContent = 'Wrong key.';
        gameStatus.textContent = `Wrong! Expected ${arrowIcons[expectedDirection]}. Lives: ${gameState.lives}`;
        gameStatus.className = 'game-status error';
        updateDisplay();

        if (gameState.lives <= 0) {
            gameOver();
            return;
        }
    } else {
        setCharHappy();
        gameState.score += 10 * gameState.difficulty;
        gameState.correctInLevel++;

        const levelTarget = getLevelTarget();
        if (gameState.correctInLevel >= levelTarget) {
            gameState.currentLevel++;
            gameState.correctInLevel = 0;
            gameInstruction.textContent = 'Level up! Keep going.';
            gameStatus.textContent = `Great! Welcome to Level ${gameState.currentLevel}.`;
        } else {
            gameInstruction.textContent = 'Correct! Hit the next arrow.';
            gameStatus.textContent = 'Nice move. Sequence shifted forward.';
        }
        gameStatus.className = 'game-status success';
        updateDisplay();
    }

    advanceSequenceWindow();
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.gameOver = true;
    gameState.isPlayerTurn = false;

    // CHAR SAD for game over
    setCharSad();

    gameInstruction.textContent = 'Game Over!';
    gameStatus.textContent = `Final Score: ${gameState.score}. Press SPACE to play again.`;
    gameStatus.className = 'game-status error';

    startBtn.disabled = false;
    // allow player to replay the last sequence after losing
    repeatBtn.disabled = false;
    arrowButtons.forEach(btn => btn.disabled = true);
}

function getLevelTarget() {
    return Math.max(4, gameState.sequenceLength + (gameState.difficulty - 1));
}

function renderSequenceDisplay() {
    clearSequenceDisplay();
    gameState.sequence.forEach((direction, index) => {
        const arrowElement = document.createElement('div');
        arrowElement.className = 'sequence-arrow';
        if (index === 0) {
            arrowElement.classList.add('active');
        }
        arrowElement.textContent = arrowIcons[direction];
        sequenceDisplay.appendChild(arrowElement);
    });
}

function advanceSequenceWindow() {
    const arrowElements = Array.from(document.querySelectorAll('.sequence-arrow'));
    arrowElements.forEach((arrow, index) => {
        arrow.classList.add('shifting');
        if (index === 0) {
            arrow.classList.add('shift-out');
        } else {
            arrow.classList.add('shift-left');
        }
    });

    const shiftDuration = 180;
    setTimeout(() => {
        gameState.sequence.shift();
        const randomDirection = arrowDirections[Math.floor(Math.random() * arrowDirections.length)];
        gameState.sequence.push(randomDirection);
        renderSequenceDisplay();
        // after the visual shift completes and the sequence is re-rendered,
        // start the move timer again so the next arrow will begin to fade/move
        if (gameState.isPlaying && gameState.isPlayerTurn) {
            startMoveTimer();
        }
    }, shiftDuration);
}

// Start a timer that will auto-advance the sequence if the player does not
// press the correct key before the arrow fades/moves away.
function startMoveTimer() {
    clearMoveTimer();

    // base time (ms) can be adjusted by `gameState.speed` (higher speed -> shorter time)
    const baseTime = 2200;
    const speedFactor = Math.max(0, (gameState.speed - 1));
    const time = Math.max(600, baseTime - speedFactor * 350);

    gameState.keyPressTimeout = setTimeout(() => {
        // treat timeout as a missed key (penalize the player)
        setCharSad();
        gameState.lives--;
        gameInstruction.textContent = 'Too slow!';
        const expected = gameState.sequence[0];
        gameStatus.textContent = `Missed ${arrowIcons[expected]}. Lives: ${gameState.lives}`;
        gameStatus.className = 'game-status error';
        updateDisplay();

        if (gameState.lives <= 0) {
            gameOver();
            return;
        }

        // visually advance the sequence as if it shifted out
        advanceSequenceWindow();
    }, time);
}

function clearMoveTimer() {
    if (gameState.keyPressTimeout) {
        clearTimeout(gameState.keyPressTimeout);
        gameState.keyPressTimeout = null;
    }
}

function clearSequenceDisplay() {
    sequenceDisplay.innerHTML = '';
}

function updateDisplay() {
    levelDisplay.textContent = gameState.currentLevel;
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
}