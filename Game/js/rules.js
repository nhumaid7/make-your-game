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
    gameState.isShowingSequence = false;
    gameState.isPlayerTurn = true;
    gameInstruction.textContent = 'Hit the first arrow shown in the queue.';
    gameStatus.textContent = 'Sequence is fixed until you press a key.';
    gameStatus.className = 'game-status';
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
    repeatBtn.disabled = true;
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
    }, shiftDuration);
}

function clearSequenceDisplay() {
    sequenceDisplay.innerHTML = '';
}

function updateDisplay() {
    levelDisplay.textContent = gameState.currentLevel;
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
}