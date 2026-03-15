// ===== RHYTHM GAME + WORKING PAUSE (merged) =====
function loadBestScore() {
  return parseInt(localStorage.getItem('friendsBestScore') || '0', 10);
}

function saveBestScore() {
  const bestScore = loadBestScore();
  if (gameState.score > bestScore) {
    localStorage.setItem('friendsBestScore', String(gameState.score));
    return gameState.score;
  }
  return bestScore;
}

function checkLevelUp() {
  const newLevel = Math.floor(gameState.score / 1000) + 1;

  if (newLevel > gameState.currentLevel) {
    gameState.currentLevel = newLevel;

    gameState.arrowSpeed = Math.min(8, gameState.arrowSpeed + 0.35);
    gameState.baseSpawnInterval = Math.max(700, gameState.baseSpawnInterval - 120);

    updateDisplay();
    showHitFeedback(`LEVEL ${gameState.currentLevel}`, '#4caf50', 180, 80);

    gameStatus.textContent = `LEVEL UP! You reached level ${gameState.currentLevel}`;
    gameStatus.className = 'game-status success';
  }
}

function updateRunStatus(accuracyText = '') {
  const bestScore = loadBestScore();
  const comboText = gameState.consecutiveHits > 1 ? ` | Combo x${gameState.consecutiveHits}` : '';
  const accuracyPart = accuracyText ? `${accuracyText}` : 'Keep going!';
  gameStatus.textContent = `${accuracyPart}${comboText} | Best: ${bestScore}`;
  gameStatus.className = 'game-status success';
}
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
  gameStatus.textContent = `Ready to play! Best Score: ${loadBestScore()}`;
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
     if (gameState.gameOver) {
        location.reload();
        return;
    }
  if (gameState.isPlaying) return;

  gameState.isPlaying = true;
  gameState.gameOver = false;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.consecutiveHits = 0;
  gameState.isPlayerTurn = true;
  gameState.gamePaused = false;
  gameState.currentLevel = 1;

  initRhythmGame();
  applyLevelSettings();
  updateDisplay();

  gameInstruction.textContent = 'Press matching keys when arrows reach the green target!';
  gameStatus.textContent = `Game started. Best Score: ${loadBestScore()}`;
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

   const bestScore = saveBestScore();
  gameInstruction.textContent = 'Game Over!';
  gameStatus.textContent = `Final Score: ${gameState.score} | Best Score: ${bestScore}. Press SPACE to play again.`;
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

function applyDifficultyWindows() {
  switch (gameState.baseDifficulty) {
    case 1:
      gameState.perfectZoneStart = 10;
      gameState.perfectZoneEnd = 42;
      gameState.goodZoneStart = -5;
      gameState.goodZoneEnd = 58;
      break;
    case 2:
      gameState.perfectZoneStart = 15;
      gameState.perfectZoneEnd = 35;
      gameState.goodZoneStart = 0;
      gameState.goodZoneEnd = 50;
      break;
    case 3:
      gameState.perfectZoneStart = 18;
      gameState.perfectZoneEnd = 30;
      gameState.goodZoneStart = 5;
      gameState.goodZoneEnd = 42;
      break;
    default:
      gameState.perfectZoneStart = 15;
      gameState.perfectZoneEnd = 35;
      gameState.goodZoneStart = 0;
      gameState.goodZoneEnd = 50;
  }
}

function applyLevelSettings() {
  gameState.level3TargetActive = false;

  if (gameState.currentLevel === 1) {
    gameState.arrowSpeed = gameState.baseSpeed;
    gameState.currentSpawnInterval = gameState.baseSpawnInterval;
    applyDifficultyWindows();
  }

  if (gameState.currentLevel === 2) {
    gameState.arrowSpeed = gameState.baseSpeed * 2;
    gameState.currentSpawnInterval = gameState.baseSpawnInterval;
    applyDifficultyWindows();
  }

  if (gameState.currentLevel === 3) {
    gameState.arrowSpeed = gameState.baseSpeed;
    gameState.currentSpawnInterval = gameState.baseSpawnInterval;
    gameState.level3TargetActive = true;
    gameState.targetZoneSpeed = 2.5;
  }
}

function checkLevelProgression() {
  let newLevel = 1;

  if (gameState.score >= 2000) {
    newLevel = 3;
  } else if (gameState.score >= 1000) {
    newLevel = 2;
  }

  if (newLevel !== gameState.currentLevel) {
    gameState.currentLevel = newLevel;
    applyLevelSettings();
    updateDisplay();

    gameStatus.textContent = `LEVEL ${gameState.currentLevel}!`;
    gameStatus.className = 'game-status success';
  }
}

// ===== RHYTHM GAME CORE =====

function initRhythmGame() {
  gameState.activeArrows = [];
  gameState.arrowSpeed = gameState.baseSpeed || gameState.speed || 3;
  gameState.baseSpawnInterval = gameState.baseSpawnInterval || 2000;
  gameState.currentSpawnInterval = gameState.baseSpawnInterval;

  gameState.lastSpawnTime = 0;

  gameState.targetZoneX = 0;
  gameState.targetZoneDirection = 1;
  gameState.targetZoneWidth = 60;
  gameState.level3TargetActive = false;

  applyLevelSettings();

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

  updateMovingTargetZone();
  updateArrowPositions();
  gameState.animationFrame = requestAnimationFrame(rhythmLoop);
}

// Get current target zone bounds (used for hit detection)
function getTargetZoneBounds() {
  const targetZone = document.querySelector('.target-zone');

  if (!targetZone) {
    return {
      goodStart: gameState.goodZoneStart,
      goodEnd: gameState.goodZoneEnd,
      perfectStart: gameState.perfectZoneStart,
      perfectEnd: gameState.perfectZoneEnd
    };
  }

  if (!gameState.level3TargetActive) {
    return {
      goodStart: gameState.goodZoneStart,
      goodEnd: gameState.goodZoneEnd,
      perfectStart: gameState.perfectZoneStart,
      perfectEnd: gameState.perfectZoneEnd
    };
  }

  const left = gameState.targetZoneX;
  const width = gameState.targetZoneWidth;
  const perfectPadding = 15;

  return {
    goodStart: left,
    goodEnd: left + width,
    perfectStart: left + perfectPadding,
    perfectEnd: left + width - perfectPadding
  };
}

function updateMovingTargetZone() {
  const targetZone = document.querySelector('.target-zone');
  if (!targetZone || !gameState.level3TargetActive) return;

  const laneWidth = sequenceDisplay.offsetWidth;
  const maxX = laneWidth - gameState.targetZoneWidth;

  gameState.targetZoneX += gameState.targetZoneSpeed * gameState.targetZoneDirection;

  if (gameState.targetZoneX <= 0) {
    gameState.targetZoneX = 0;
    gameState.targetZoneDirection = 1;
  }

  if (gameState.targetZoneX >= maxX) {
    gameState.targetZoneX = maxX;
    gameState.targetZoneDirection = -1;
  }

  targetZone.style.left = `${gameState.targetZoneX}px`;
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
    left: '/Game/assets/images/char/prev.png',
    right: '/Game/assets/images/char/next.png'
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
  const bounds = getTargetZoneBounds();

  for (let i = gameState.activeArrows.length - 1; i >= 0; i--) {
    const arrow = gameState.activeArrows[i];

    arrow.left -= gameState.arrowSpeed;
    arrow.element.style.left = `${arrow.left}px`;

    const arrowRight = arrow.left + arrow.width;
    const arrowCenter = arrow.left + arrow.width / 2;

    arrow.element.classList.remove('in-hit-zone', 'in-perfect-zone');

    if (arrowCenter >= bounds.perfectStart && arrowCenter <= bounds.perfectEnd) {
      arrow.element.classList.add('in-perfect-zone');
      if (targetZone) targetZone.classList.add('perfect-ready');
    } else if (arrowCenter >= bounds.goodStart && arrowCenter <= bounds.goodEnd) {
      arrow.element.classList.add('in-hit-zone');
    }

    const missedFixedZone =
      !gameState.level3TargetActive && arrowRight < bounds.goodStart;

    const missedMovingZone =
      gameState.level3TargetActive && arrowCenter < bounds.goodStart;

    if (missedFixedZone || missedMovingZone) {
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
      return c >= bounds.perfectStart && c <= bounds.perfectEnd;
    });

    if (!hasPerfectArrow) targetZone.classList.remove('perfect-ready');
  }
}

function handleRhythmHit(direction) {
  if (!gameState.isPlayerTurn || !gameState.isPlaying || gameState.gamePaused) return;

  const bounds = getTargetZoneBounds();

  const arrowsInZone = gameState.activeArrows.filter(a => {
    const center = a.left + a.width / 2;
    return center >= bounds.goodStart && center <= bounds.goodEnd;
  });

  if (arrowsInZone.length === 0) {
    showHitFeedback('TOO EARLY', '#ff9800', 100, 50);
    gameState.consecutiveHits = 0;
    setCharSad();
    return;
  }

  let hitArrow = arrowsInZone.find(a =>
    a.direction === direction && (a.left + a.width / 2) >= bounds.perfectStart
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

  if (arrowCenter >= bounds.perfectStart && arrowCenter <= bounds.perfectEnd) {
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
  checkLevelProgression();

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