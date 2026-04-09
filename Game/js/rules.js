// // Game audio
// const gameMusic = new Audio('/Game/assets/sounds/friends.mp3');
// gameMusic.loop = true;
// gameMusic.volume = 0.5;

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

  gameInstruction.textContent = 'Press Enter';
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

  AudioManager.playMusic(GAME_MUSIC);

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

  gameInstruction.textContent = 'Hit Arrows';
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

  AudioManager.stopMusic();

  gameState.isPlaying = false;
  gameState.gameOver = true;
  gameState.isPlayerTurn = false;

  setCharSad();

   const bestScore = saveBestScore();
  gameInstruction.textContent = 'Game Over';
  gameStatus.textContent = `Final Score: ${gameState.score} | Best Score: ${bestScore}. Press ENTER to play again.`;
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
      gameState.perfectZoneStart = 0;
      gameState.perfectZoneEnd = 80;
      gameState.goodZoneStart = -12;
      gameState.goodZoneEnd = 92;
      break;

    case 2:
      gameState.perfectZoneStart = 5;
      gameState.perfectZoneEnd = 75;
      gameState.goodZoneStart = -8;
      gameState.goodZoneEnd = 88;
      break;

    case 3:
      gameState.perfectZoneStart = 10;
      gameState.perfectZoneEnd = 70;
      gameState.goodZoneStart = -5;
      gameState.goodZoneEnd = 85;
      break;

    default:
      gameState.perfectZoneStart = 0;
      gameState.perfectZoneEnd = 80;
      gameState.goodZoneStart = -12;
      gameState.goodZoneEnd = 92;
  }
}

function applyLevelSettings() {
  gameState.level3TargetActive = false;

  if (gameState.currentLevel === 1) {
    gameState.arrowSpeed = Math.max(2.2, gameState.baseSpeed * 0.9);
    gameState.currentSpawnInterval = Math.max(100, gameState.baseSpawnInterval );
    gameState.targetZoneSpeed = 0;
    applyDifficultyWindows();
  }

  if (gameState.currentLevel === 2) {
    gameState.arrowSpeed = Math.max(3, gameState.baseSpeed * 1.15);
    gameState.currentSpawnInterval = Math.max(1000, gameState.baseSpawnInterval);
    gameState.targetZoneSpeed = 0;
    applyDifficultyWindows();
  }

  if (gameState.currentLevel === 3) {
    gameState.arrowSpeed = Math.max(3.8, gameState.baseSpeed * 1.35);
    gameState.currentSpawnInterval = Math.max(800, gameState.baseSpawnInterval - 150);
    gameState.level3TargetActive = true;
    gameState.targetZoneSpeed = 2.5;
    applyDifficultyWindows();
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
  gameState.targetZoneWidth = 80;
  gameState.level3TargetActive = false;

  applyLevelSettings();

  gameState.animationFrame = null;
  gameState.arrowCount = 0;
  gameState.consecutiveHits = 0;
}


// ✅ IMPORTANT: make the loop a top-level function so pause/resume can restart it
function rhythmLoop(currentTime) {
  if (!gameState.isPlaying || gameState.gameOver) return;

  if (gameState.gamePaused) {
    gameState.animationFrame = requestAnimationFrame(rhythmLoop);
    return;
  }

  if (currentTime - gameState.lastSpawnTime >= gameState.currentSpawnInterval) {
    spawnArrow();
    gameState.lastSpawnTime = currentTime;
  }

  updateMovingTargetZone();
  updateArrowPositions();
  gameState.animationFrame = requestAnimationFrame(rhythmLoop);
}

// Get current target zone bounds (used for hit detection)
function getTargetZoneBounds() {
  const lane = sequenceDisplay || document.querySelector('.sequence-display');
  const targetZone = document.querySelector('.target-zone');
  const targetBox = document.querySelector('.target-zone .target-box');

  if (!lane || !targetZone) {
    return {
      goodStart: gameState.goodZoneStart ?? 0,
      goodEnd: gameState.goodZoneEnd ?? 90,
      perfectStart: gameState.perfectZoneStart ?? 0,
      perfectEnd: gameState.perfectZoneEnd ?? 80
    };
  }

  const laneRect = lane.getBoundingClientRect();
  const zoneRect = targetZone.getBoundingClientRect();

  // GOOD zone = outer green box
  const goodStart = zoneRect.left - laneRect.left;
  const goodEnd = zoneRect.right - laneRect.left;

  // PERFECT zone = inner dashed box
  let perfectStart = goodStart;
  let perfectEnd = goodEnd;

  if (targetBox) {
    const boxRect = targetBox.getBoundingClientRect();
    perfectStart = boxRect.left - laneRect.left;
    perfectEnd = boxRect.right - laneRect.left;
  }

  return {
    goodStart,
    goodEnd,
    perfectStart,
    perfectEnd
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
  let directions;

  if (gameState.currentLevel === 1) {
    directions = ['up', 'down'];
  } else if (gameState.currentLevel === 2) {
    directions = ['up', 'down', 'left', 'right'];
  } else {
    directions = ['up', 'down', 'left', 'right'];
  }

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
  const startX = displayWidth + 20;

  arrowElement.style.left = `${startX}px`;
  sequenceDisplay.appendChild(arrowElement);

  gameState.activeArrows.push({
    id: arrowElement.dataset.id,
    element: arrowElement,
    direction: randomDirection,
    left: startX,
    width: 60,
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

    const arrowLeft = arrow.left;
    const arrowRight = arrow.left + arrow.width;
    const arrowCenter = arrow.left + arrow.width / 2;

    arrow.element.classList.remove('in-hit-zone', 'in-perfect-zone');

    const fullyInsidePerfect =
      arrowLeft >= bounds.perfectStart &&
      arrowRight <= bounds.perfectEnd;

    const partlyInsideGood =
      arrowRight >= bounds.goodStart &&
      arrowLeft <= bounds.goodEnd;

    if (fullyInsidePerfect) {
      arrow.element.classList.add('in-perfect-zone');
      if (targetZone) targetZone.classList.add('perfect-ready');
    } else if (partlyInsideGood) {
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

      if (gameState.lives <= 0) {
        gameOver();
        return;
      }
    }
  }

  if (targetZone) {
    const hasPerfectArrow = gameState.activeArrows.some(a => {
      const left = a.left;
      const right = a.left + a.width;
      return left >= bounds.perfectStart && right <= bounds.perfectEnd;
    });

    if (!hasPerfectArrow) {
      targetZone.classList.remove('perfect-ready');
    }
  }
}

function handleRhythmHit(direction) {
  if (!gameState.isPlayerTurn || !gameState.isPlaying || gameState.gamePaused) return;

  const bounds = getTargetZoneBounds();

  const arrowsInZone = gameState.activeArrows.filter(a => {
    const arrowLeft = a.left;
    const arrowRight = a.left + a.width;

    return arrowRight >= bounds.goodStart && arrowLeft <= bounds.goodEnd;
  });

  if (arrowsInZone.length === 0) {
    AudioManager.glitchMusic(250);
    showHitFeedback('TOO EARLY', '#ff9800', 100, 50);
    gameState.consecutiveHits = 0;
    setCharSad();
    return;
  }

  let hitArrow = arrowsInZone.find(a => {
    const arrowLeft = a.left;
    const arrowRight = a.left + a.width;

    return (
      a.direction === direction &&
      arrowLeft >= bounds.perfectStart &&
      arrowRight <= bounds.perfectEnd
    );
  });

  if (!hitArrow) {
    hitArrow = arrowsInZone.find(a => a.direction === direction);
  }

  if (!hitArrow) {
    AudioManager.glitchMusic(250);
    showHitFeedback('WRONG KEY', '#f44336', 100, 50);
    gameState.consecutiveHits = 0;
    setCharSad();
    return;
  }

  const arrowLeft = hitArrow.left;
  const arrowRight = hitArrow.left + hitArrow.width;

  let accuracy = 'good';
  let points = 50;
  let color = '#ffc107';

  const isPerfect =
    arrowLeft >= bounds.perfectStart &&
    arrowRight <= bounds.perfectEnd;

  if (isPerfect) {
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

   if (pauseOverlay) pauseOverlay.style.display = 'flex';

  // pause music
  AudioManager.pauseMusic();

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

    if (pauseOverlay) pauseOverlay.style.display = 'none';


  // ✅ Reset spawn timer so it doesn't instantly spawn a bunch
  gameState.lastSpawnTime = performance.now();

   // RESUME MUSIC HERE
  AudioManager.resumeMusic();

  gameInstruction.textContent = 'Resumed';
  gameStatus.textContent = 'Back in action!';
  gameStatus.className = 'game-status';
}