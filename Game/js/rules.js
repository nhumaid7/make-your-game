// Game logic functions for rhythm-based arrow game

function resetGame() {
    // Stop any running game and clear arrows
    stopRhythmGame();
    initRhythmGame(); // Initialize rhythm game variables
    
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.isPlaying = false;
    gameState.gameOver = false;
    gameState.isPlayerTurn = true; // Set to true for rhythm game
    gameState.consecutiveHits = 0;
    
    // Clear old sequence variables
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.isShowingSequence = false;
    gameState.correctInLevel = 0;

    updateDisplay();
    clearMovingArrows();
    gameInstruction.textContent = 'Press SPACE to start the rhythm game!';
    gameStatus.textContent = 'Ready to play!';
    gameStatus.className = 'game-status';

    setCharNormal();

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = true);
}

function startGame() {
    if (gameState.isPlaying) return;

    gameState.isPlaying = true;
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.consecutiveHits = 0;
    gameState.isPlayerTurn = true;
    
    initRhythmGame();
    updateDisplay();
    
    gameInstruction.textContent = 'Press matching keys when arrows reach the green target!';
    gameStatus.textContent = 'Game started. Watch for arrows!';
    gameStatus.className = 'game-status';
    
    setCharNormal();
    
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    arrowButtons.forEach(btn => btn.disabled = false);
    
    startRhythmGame();
}

function handleArrowClick(direction) {
    // Call the rhythm game hit handler
    handleRhythmHit(direction);
}

function gameOver() {
    stopRhythmGame();

    gameState.isPlaying = false;
    gameState.gameOver = true;
    gameState.isPlayerTurn = false;

    // Clear timers and animations when game ends
    clearMoveTimer();
    stopContinuousMovement();

    // CHAR SAD for game over
    setCharSad();

    gameInstruction.textContent = 'Game Over!';
    gameStatus.textContent = `Final Score: ${gameState.score}. Press SPACE to play again.`;
    gameStatus.className = 'game-status error';

    startBtn.disabled = false;
    // allow player to pause/resume or replay the last sequence after losing
    pauseBtn.disabled = false;
    arrowButtons.forEach(btn => btn.disabled = true);
}

function updateDisplay() {
    levelDisplay.textContent = gameState.currentLevel;
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
}

// ===== RHYTHM GAME FUNCTIONS =====

// Initialize rhythm game variables
function initRhythmGame() {
    gameState.activeArrows = [];
    gameState.arrowSpeed = 3; // pixels per frame
    gameState.baseSpawnInterval = 2000; // 2 seconds
    gameState.currentSpawnInterval = 2000;
    gameState.lastSpawnTime = 0;
    gameState.targetPosition = 30; // Left target position (30px from left)
    gameState.perfectZoneStart = 15; // Perfect hit zone (15-35px)
    gameState.perfectZoneEnd = 35;
    gameState.goodZoneStart = 0; // Good hit zone (0-50px)
    gameState.goodZoneEnd = 50;
    gameState.animationFrame = null;
    gameState.arrowCount = 0;
    gameState.consecutiveHits = 0;
    gameState.lastHitAccuracy = '';
}

// Start the rhythm game loop
function startRhythmGame() {
    if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
    }
    
    gameState.activeArrows = [];
    gameState.lastSpawnTime = performance.now();
    gameState.currentSpawnInterval = gameState.baseSpawnInterval;
    
    // Clear any existing arrows from display
    clearMovingArrows();
    
    // Start the game loop
    function gameLoop(currentTime) {
        if (!gameState.isPlaying || gameState.gameOver) {
            return;
        }
        
        // Check if it's time to spawn a new arrow
        if (currentTime - gameState.lastSpawnTime >= gameState.currentSpawnInterval) {
            spawnArrow();
            gameState.lastSpawnTime = currentTime;
            
            // Randomize next spawn interval (between 1.5 and 3 seconds)
            const variation = 500; // 0.5 second variation
            gameState.currentSpawnInterval = gameState.baseSpawnInterval + 
                (Math.random() * variation * 2 - variation);
        }
        
        // Update all arrow positions
        updateArrowPositions();
        
        // Continue the loop
        gameState.animationFrame = requestAnimationFrame(gameLoop);
    }
    
    gameState.animationFrame = requestAnimationFrame(gameLoop);
}

// Spawn a new arrow
function spawnArrow() {
  const directions = ['up', 'down', 'left', 'right'];
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];

  // ✅ Put YOUR arrow image paths here:
  const arrowImages = {
    up:   '/Game/assets/images/char/up.png',
    down: '/Game/assets/images/arrows/down.png',
    left: "/Game/assets/images/char/prev.svg",
    right:'/Game/assets/images/char/next.svg'
  };

  const arrowElement = document.createElement('div');
  arrowElement.className = `moving-arrow ${randomDirection}`;
  arrowElement.dataset.direction = randomDirection;
  arrowElement.dataset.id = `arrow-${Date.now()}-${gameState.arrowCount++}`;

  // Create image
  const img = document.createElement('img');
  img.src = arrowImages[randomDirection];
  img.alt = randomDirection;
  img.draggable = false;
  img.className = 'arrow-img';

  arrowElement.appendChild(img);

  const displayWidth = sequenceDisplay.offsetWidth;
  arrowElement.style.left = `${displayWidth - 100}px`; // start near right

  sequenceDisplay.appendChild(arrowElement);

  gameState.activeArrows.push({
    id: arrowElement.dataset.id,
    element: arrowElement,
    direction: randomDirection,
    left: displayWidth - 100,
    width: 80, // IMPORTANT: match CSS image width
    isActive: true,
    spawnedAt: Date.now()
  });
}

// Update all arrow positions
function updateArrowPositions() {
    const displayWidth = sequenceDisplay.offsetWidth;
    const targetZone = document.querySelector('.target-zone');
    
    for (let i = gameState.activeArrows.length - 1; i >= 0; i--) {
        const arrow = gameState.activeArrows[i];
        
        // Move arrow left
        arrow.left -= gameState.arrowSpeed;
        arrow.element.style.left = `${arrow.left}px`;
        
        // Check if arrow is in hit zones
        const arrowRight = arrow.left + arrow.width;
        const arrowCenter = arrow.left + (arrow.width / 2);
        
        // Remove classes
        arrow.element.classList.remove('in-hit-zone', 'in-perfect-zone');
        
        // Check if in perfect zone (closer to target)
        if (arrowCenter >= gameState.perfectZoneStart && arrowCenter <= gameState.perfectZoneEnd) {
            arrow.element.classList.add('in-perfect-zone');
            if (targetZone) targetZone.classList.add('perfect-ready');
        }
        // Check if in good zone
        else if (arrowCenter >= gameState.goodZoneStart && arrowCenter <= gameState.goodZoneEnd) {
            arrow.element.classList.add('in-hit-zone');
        }
        
        // Check if arrow passed the target (missed)
        if (arrowRight < gameState.goodZoneStart) {
            // Arrow passed without being hit
            arrow.element.classList.add('hit-miss');
            gameState.consecutiveHits = 0;
            
            // Reduce life or add miss penalty
            gameState.lives = Math.max(0, gameState.lives - 1);
            updateDisplay();
            
            // Show miss text
            showHitFeedback('MISS', '#f44336', arrow.left, arrow.element.offsetTop);
            
            // Remove arrow after animation
            setTimeout(() => {
                if (arrow.element && arrow.element.parentNode) {
                    arrow.element.remove();
                }
            }, 300);
            
            gameState.activeArrows.splice(i, 1);
            
            // Check game over
            if (gameState.lives <= 0) {
                gameOver();
            }
        }
    }
    
    // Remove perfect-ready class if no arrows in perfect zone
    if (targetZone) {
        const hasPerfectArrow = gameState.activeArrows.some(arrow => {
            const arrowCenter = arrow.left + (arrow.width / 2);
            return arrowCenter >= gameState.perfectZoneStart && arrowCenter <= gameState.perfectZoneEnd;
        });
        
        if (!hasPerfectArrow) {
            targetZone.classList.remove('perfect-ready');
        }
    }
}

// Handle arrow hit (called from handleArrowClick)
function handleRhythmHit(direction) {
    if (!gameState.isPlayerTurn || !gameState.isPlaying) return;
    
    // Find arrows in hit zone
    const arrowsInZone = gameState.activeArrows.filter(arrow => {
        const arrowCenter = arrow.left + (arrow.width / 2);
        return arrowCenter >= gameState.goodZoneStart && arrowCenter <= gameState.goodZoneEnd;
    });
    
    if (arrowsInZone.length === 0) {
        // No arrow to hit
        showHitFeedback('TOO EARLY', '#ff9800', 100, 50);
        gameState.consecutiveHits = 0;
        setCharSad();
        return;
    }
    
    // Find matching arrow (prioritize arrows in perfect zone)
    let hitArrow = arrowsInZone.find(arrow => 
        arrow.direction === direction && 
        (arrow.left + (arrow.width / 2) >= gameState.perfectZoneStart)
    );
    
    // If no perfect match, find any matching arrow
    if (!hitArrow) {
        hitArrow = arrowsInZone.find(arrow => arrow.direction === direction);
    }
    
    if (hitArrow) {
        // Calculate accuracy
        const arrowCenter = hitArrow.left + (hitArrow.width / 2);
        let accuracy = 'good';
        let points = 50;
        let color = '#ffc107';
        
        if (arrowCenter >= gameState.perfectZoneStart && arrowCenter <= gameState.perfectZoneEnd) {
            accuracy = 'perfect';
            points = 100;
            color = '#4caf50';
            gameState.consecutiveHits++;
        } else {
            points = 50;
            color = '#ffc107';
            gameState.consecutiveHits = Math.max(0, gameState.consecutiveHits - 1);
        }
        
        // Add combo bonus
        const combo = gameState.consecutiveHits;
        const totalPoints = points * (1 + (combo * 0.1)); // 10% bonus per consecutive hit
        
        // Update score
        gameState.score += Math.floor(totalPoints);
        updateDisplay();
        
        // Visual feedback
        hitArrow.element.classList.add(`hit-${accuracy}`);
        showHitFeedback(
            accuracy.toUpperCase(), 
            color, 
            hitArrow.left, 
            hitArrow.element.offsetTop,
            combo > 1 ? ` x${combo}` : ''
        );
        
        // Set character happy
        setCharHappy();
        
        // Update game status
        gameStatus.textContent = `${accuracy.toUpperCase()}! +${Math.floor(totalPoints)} points`;
        gameStatus.className = `game-status success`;
        
        // Remove arrow
        setTimeout(() => {
            if (hitArrow.element && hitArrow.element.parentNode) {
                hitArrow.element.remove();
            }
        }, 200);
        
        // Remove from active array
        gameState.activeArrows = gameState.activeArrows.filter(a => a.id !== hitArrow.id);
        
        // Increase difficulty based on score
        if (gameState.score > 0 && gameState.score % 500 < 50) {
            gameState.arrowSpeed = Math.min(8, 3 + Math.floor(gameState.score / 500));
            gameState.baseSpawnInterval = Math.max(800, 2000 - Math.floor(gameState.score / 200) * 100);
        }
    } else {
        // Wrong direction
        showHitFeedback('WRONG KEY', '#f44336', 100, 50);
        gameState.consecutiveHits = 0;
        setCharSad();
    }
}

// Show floating feedback text
function showHitFeedback(text, color, x, y, suffix = '') {
    const feedback = document.createElement('div');
    feedback.className = 'score-popup';
    feedback.textContent = text + suffix;
    feedback.style.color = color;
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    
    sequenceDisplay.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// Clear all moving arrows
function clearMovingArrows() {
    document.querySelectorAll('.moving-arrow').forEach(el => el.remove());
    gameState.activeArrows = [];
}

// Stop rhythm game
function stopRhythmGame() {
    if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
        gameState.animationFrame = null;
    }
    clearMovingArrows();
}

// Pause / Resume support: toggles timers and continuous movement
function togglePause() {
    // Only allow pausing when a game is in progress
    if (!gameState.isPlaying) return;

    if (!gameState.gamePaused) {
        pauseGame();
    } else {
        resumeGame();
    }
}

function pauseGame() {
    gameState.gamePaused = true;
    // stop any active timers/animations
    clearMoveTimer();
    stopContinuousMovement();

    // disable player input while paused
    arrowButtons.forEach(btn => btn.disabled = true);

    // update UI
    gameInstruction.textContent = 'Paused';
    gameStatus.textContent = 'Game paused.';
    gameStatus.className = 'game-status';

    // change control button to a Resume control (keeps same element id)
    if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        pauseBtn.disabled = false;
    }
}

function resumeGame() {
    gameState.gamePaused = false;

    // restore UI and timers depending on whether it is player's turn
    gameInstruction.textContent = gameState.isPlayerTurn ? 'Your turn.' : 'Sequence running.';
    gameStatus.textContent = 'Resumed.';
    gameStatus.className = 'game-status';

    // restore arrow button enabled state only if it's player's turn
    arrowButtons.forEach(btn => btn.disabled = !gameState.isPlayerTurn);

    // restart timers if appropriate
    if (gameState.isPlayerTurn) {
        startMoveTimer();
    }
    restartContinuousMovement();

    if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        pauseBtn.disabled = false;
    }
}