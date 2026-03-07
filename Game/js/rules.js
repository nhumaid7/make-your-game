// ===== RHYTHM GAME + WORKING PAUSE (merged) =====

// Reset the game state
function resetGame() {
  stopRhythmGame();
  initRhythmGame();

  gameState.currentLevel = 1;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.isPlaying = false;
  gameState.gameOver = false;
  gameState.isPlayerTurn = true;
  gameState.consecutiveHits = 0;
  gameState.gamePaused = false;

  updateDisplay();
  clearMovingArrows();

  gameInstruction.textContent = 'Press SPACE to start the rhythm game!';
  gameStatus.textContent = 'Ready to play!';
  gameStatus.className = 'game-status';

  setCharNormal();

  startBtn.disabled = false;

  // ✅ Pause should be disabled until the game starts
  if (pauseBtn) {
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  arrowButtons.forEach(btn => (btn.disabled = true));
}

function startGame() {
  if (gameState.isPlaying) return;

  gameState.isPlaying = true;
  gameState.gameOver = false;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.consecutiveHits = 0;
  gameState.isPlayerTurn = true;
  gameState.gamePaused = false;

  initRhythmGame();
  updateDisplay();

  gameInstruction.textContent = 'Press matching keys when arrows reach the green target!';
  gameStatus.textContent = 'Game started. Watch for arrows!';
  gameStatus.className = 'game-status';

  setCharNormal();

  startBtn.disabled = true;

  // ✅ Pause becomes enabled AFTER game starts
  if (pauseBtn) {
    pauseBtn.disabled = false;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  arrowButtons.forEach(btn => (btn.disabled = false));

  startRhythmGame();
}

function handleArrowClick(direction) {
  handleRhythmHit(direction);
}

function gameOver() {
  stopRhythmGame();

  gameState.isPlaying = false;
  gameState.gameOver = true;
  gameState.isPlayerTurn = false;

  setCharSad();

  gameInstruction.textContent = 'Game Over!';
  gameStatus.textContent = `Final Score: ${gameState.score}. Press SPACE to play again.`;
  gameStatus.className = 'game-status error';

  startBtn.disabled = false;

  // ✅ pause disabled on game over
  if (pauseBtn) {
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  arrowButtons.forEach(btn => (btn.disabled = true));
}

function updateDisplay() {
  levelDisplay.textContent = gameState.currentLevel;
  scoreDisplay.textContent = gameState.score;
  livesDisplay.textContent = gameState.lives;
}

// ===== RHYTHM GAME CORE =====

function initRhythmGame() {
  gameState.activeArrows = [];
  gameState.arrowSpeed = gameState.arrowSpeed || 3;

  gameState.baseSpawnInterval = gameState.baseSpawnInterval || 2000;
  gameState.currentSpawnInterval = gameState.baseSpawnInterval;

  gameState.lastSpawnTime = 0;

  gameState.perfectZoneStart = 15;
  gameState.perfectZoneEnd = 35;
  gameState.goodZoneStart = 0;
  gameState.goodZoneEnd = 50;

  gameState.animationFrame = null;
  gameState.arrowCount = 0;
  gameState.consecutiveHits = 0;
}

// ✅ IMPORTANT: make the loop a top-level function so pause/resume can restart it
function rhythmLoop(currentTime) {
  if (!gameState.isPlaying || gameState.gameOver) return;

  // ✅ If paused, don't update anything, but keep requesting frames
  if (gameState.gamePaused) {
    gameState.animationFrame = requestAnimationFrame(rhythmLoop);
    return;
  }

  if (currentTime - gameState.lastSpawnTime >= gameState.currentSpawnInterval) {
    spawnArrow();
    gameState.lastSpawnTime = currentTime;

    const variation = 500;
    gameState.currentSpawnInterval =
      gameState.baseSpawnInterval + (Math.random() * variation * 2 - variation);
  }

  updateArrowPositions();
  gameState.animationFrame = requestAnimationFrame(rhythmLoop);
}

function startRhythmGame() {
  if (gameState.animationFrame) {
    cancelAnimationFrame(gameState.animationFrame);
    gameState.animationFrame = null;
  }

  gameState.activeArrows = [];
  gameState.lastSpawnTime = performance.now();
  gameState.currentSpawnInterval = gameState.baseSpawnInterval;

  clearMovingArrows();
  gameState.animationFrame = requestAnimationFrame(rhythmLoop);
}

// Spawn arrow using images (your paths here)
function spawnArrow() {
  const directions = ['up', 'down', 'left', 'right'];
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];

  const arrowImages = {
    up: '/Game/assets/images/char/up.png',
    down: '/Game/assets/images/char/down.png',
    left: '/Game/assets/images/char/prev.svg',
    right: '/Game/assets/images/char/next.svg'
  };

  const arrowElement = document.createElement('div');
  arrowElement.className = `moving-arrow ${randomDirection}`;
  arrowElement.dataset.direction = randomDirection;
  arrowElement.dataset.id = `arrow-${Date.now()}-${gameState.arrowCount++}`;

  const img = document.createElement('img');
  img.src = arrowImages[randomDirection];
  img.alt = randomDirection;
  img.draggable = false;
  img.className = 'arrow-img';

  arrowElement.appendChild(img);

  const displayWidth = sequenceDisplay.offsetWidth;
  arrowElement.style.left = `${displayWidth - 100}px`;

  sequenceDisplay.appendChild(arrowElement);

  gameState.activeArrows.push({
    id: arrowElement.dataset.id,
    element: arrowElement,
    direction: randomDirection,
    left: displayWidth - 100,
    width: 80,
    isActive: true
  });
}

function updateArrowPositions() {
  const targetZone = document.querySelector('.target-zone');

  for (let i = gameState.activeArrows.length - 1; i >= 0; i--) {
    const arrow = gameState.activeArrows[i];

    arrow.left -= gameState.arrowSpeed;
    arrow.element.style.left = `${arrow.left}px`;

    const arrowRight = arrow.left + arrow.width;
    const arrowCenter = arrow.left + arrow.width / 2;

    arrow.element.classList.remove('in-hit-zone', 'in-perfect-zone');

    if (arrowCenter >= gameState.perfectZoneStart && arrowCenter <= gameState.perfectZoneEnd) {
      arrow.element.classList.add('in-perfect-zone');
      if (targetZone) targetZone.classList.add('perfect-ready');
    } else if (arrowCenter >= gameState.goodZoneStart && arrowCenter <= gameState.goodZoneEnd) {
      arrow.element.classList.add('in-hit-zone');
    }

    if (arrowRight < gameState.goodZoneStart) {
      arrow.element.classList.add('hit-miss');
      gameState.consecutiveHits = 0;

      gameState.lives = Math.max(0, gameState.lives - 1);
      updateDisplay();

      showHitFeedback('MISS', '#f44336', arrow.left, arrow.element.offsetTop);

      setTimeout(() => arrow.element?.remove(), 300);
      gameState.activeArrows.splice(i, 1);

      if (gameState.lives <= 0) gameOver();
    }
  }

  if (targetZone) {
    const hasPerfectArrow = gameState.activeArrows.some(a => {
      const c = a.left + a.width / 2;
      return c >= gameState.perfectZoneStart && c <= gameState.perfectZoneEnd;
    });

    if (!hasPerfectArrow) targetZone.classList.remove('perfect-ready');
  }
}

function handleRhythmHit(direction) {
  if (!gameState.isPlayerTurn || !gameState.isPlaying || gameState.gamePaused) return;

  const arrowsInZone = gameState.activeArrows.filter(a => {
    const center = a.left + a.width / 2;
    return center >= gameState.goodZoneStart && center <= gameState.goodZoneEnd;
  });

  if (arrowsInZone.length === 0) {
    showHitFeedback('TOO EARLY', '#ff9800', 100, 50);
    gameState.consecutiveHits = 0;
    setCharSad();
    return;
  }

  let hitArrow = arrowsInZone.find(a =>
    a.direction === direction && (a.left + a.width / 2) >= gameState.perfectZoneStart
  );

  if (!hitArrow) hitArrow = arrowsInZone.find(a => a.direction === direction);

  if (!hitArrow) {
    showHitFeedback('WRONG KEY', '#f44336', 100, 50);
    gameState.consecutiveHits = 0;
    setCharSad();
    return;
  }

  const arrowCenter = hitArrow.left + hitArrow.width / 2;
  let accuracy = 'good';
  let points = 50;
  let color = '#ffc107';

  if (arrowCenter >= gameState.perfectZoneStart && arrowCenter <= gameState.perfectZoneEnd) {
    accuracy = 'perfect';
    points = 100;
    color = '#4caf50';
    gameState.consecutiveHits++;
  } else {
    gameState.consecutiveHits = Math.max(0, gameState.consecutiveHits - 1);
  }

  const combo = gameState.consecutiveHits;
  const totalPoints = points * (1 + combo * 0.1);

  gameState.score += Math.floor(totalPoints);
  updateDisplay();

  hitArrow.element.classList.add(`hit-${accuracy}`);
  showHitFeedback(
    accuracy.toUpperCase(),
    color,
    hitArrow.left,
    hitArrow.element.offsetTop,
    combo > 1 ? ` x${combo}` : ''
  );

  setCharHappy();
  gameStatus.textContent = `${accuracy.toUpperCase()}! +${Math.floor(totalPoints)} points`;
  gameStatus.className = 'game-status success';

  setTimeout(() => hitArrow.element?.remove(), 200);
  gameState.activeArrows = gameState.activeArrows.filter(a => a.id !== hitArrow.id);
}

function showHitFeedback(text, color, x, y, suffix = '') {
  const feedback = document.createElement('div');
  feedback.className = 'score-popup';
  feedback.textContent = text + suffix;
  feedback.style.color = color;
  feedback.style.left = `${x}px`;
  feedback.style.top = `${y}px`;

  sequenceDisplay.appendChild(feedback);
  setTimeout(() => feedback.remove(), 1000);
}

function clearMovingArrows() {
  document.querySelectorAll('.moving-arrow').forEach(el => el.remove());
  gameState.activeArrows = [];
}

function stopRhythmGame() {
  if (gameState.animationFrame) {
    cancelAnimationFrame(gameState.animationFrame);
    gameState.animationFrame = null;
  }
  clearMovingArrows();
}

// ===== PAUSE / RESUME (fixed for rhythm game) =====

function togglePause() {
  if (!gameState.isPlaying || gameState.gameOver) return;

  if (!gameState.gamePaused) pauseGame();
  else resumeGame();
}

function pauseGame() {
  gameState.gamePaused = true;

  arrowButtons.forEach(btn => (btn.disabled = true));
  if (pauseBtn) {
    pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    pauseBtn.disabled = false;
  }

  gameInstruction.textContent = 'Paused';
  gameStatus.textContent = 'Game paused.';
  gameStatus.className = 'game-status';
}

function resumeGame() {
  gameState.gamePaused = false;

  arrowButtons.forEach(btn => (btn.disabled = false));
  if (pauseBtn) {
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    pauseBtn.disabled = false;
  }

  // ✅ Reset spawn timer so it doesn't instantly spawn a bunch
  gameState.lastSpawnTime = performance.now();

  gameInstruction.textContent = 'Resumed';
  gameStatus.textContent = 'Back in action!';
  gameStatus.className = 'game-status';
}