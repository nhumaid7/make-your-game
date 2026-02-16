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

    updateDisplay();
    gameInstruction.textContent = 'Watch the sequence carefully!';
    gameStatus.textContent = 'Showing sequence...';
    gameStatus.className = 'game-status';

    setCharNormal();

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
        // Wrong sequence - CHAR SAD
        setCharSad();

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

    // Correct key press - CHAR HAPPY
    setCharHappy();

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

    // CHAR SAD for game over
    setCharSad();

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