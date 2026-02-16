// sequence-logic.js
// Generate a random sequence based on current settings
function generateSequence() {
    const sequence = [];
    // Use sequenceLength from gameState, but make it increase with level
    const baseLength = gameState.sequenceLength;
    // Add 1 extra arrow for every 2 levels completed
    const extraLength = Math.floor(gameState.currentLevel / 2);
    const totalLength = baseLength + extraLength;
    
    for (let i = 0; i < totalLength; i++) {
        const randomIndex = Math.floor(Math.random() * arrowDirections.length);
        sequence.push(arrowDirections[randomIndex]);
    }
    
    return sequence;
}

// Show the sequence to the player
function showSequence() {
    if (gameState.isShowingSequence) return;
    
    gameState.isShowingSequence = true;
    gameState.playerSequence = [];
    
    // Create sequence display arrows
    createSequenceArrows(gameState.sequence);
    
    // Animate the sequence
    let delay = 0;
    const baseSpeed = 800 - (gameState.speed - 1) * 150; // 800ms to 400ms
    
    gameState.sequence.forEach((direction, index) => {
        setTimeout(() => {
            // Highlight the control button (the big colored arrow buttons)
            highlightControlButton(direction, 300);
            
            if (index === gameState.sequence.length - 1) {
                setTimeout(() => {
                    gameState.isShowingSequence = false;
                    gameState.isPlayerTurn = true;
                    gameInstruction.textContent = 'Your turn! Use arrow keys or WASD!';
                    gameStatus.textContent = 'Enter the sequence now!';
                    gameStatus.className = 'game-status';
                    
                    setArrowButtonsEnabled(true);
                    repeatBtn.disabled = false;
                }, 500);
            }
        }, delay);
        
        delay += baseSpeed;
    });
}

// Handle player's arrow click
function handleArrowClick(direction) {
    if (!gameState.isPlayerTurn || !gameState.isPlaying) return;
    
    // Add to player sequence
    gameState.playerSequence.push(direction);
    gameState.lastKeyPress = direction;
    
    // Highlight the corresponding sequence arrow
    const currentIndex = gameState.playerSequence.length - 1;
    highlightPlayerArrow(currentIndex);
    
    // Check if the sequence is correct so far
    if (direction !== gameState.sequence[currentIndex]) {
        // Wrong sequence - CAT SAD
        setCatSad();
        
        gameState.lives--;
        gameState.isPlayerTurn = false;
        
        gameInstruction.textContent = 'Wrong key! Try again.';
        gameStatus.textContent = `Incorrect! You have ${gameState.lives} lives remaining.`;
        gameStatus.className = 'game-status error';
        
        setArrowButtonsEnabled(false);
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
        setArrowButtonsEnabled(false);
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