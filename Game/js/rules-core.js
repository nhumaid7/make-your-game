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
  pauseTimer();


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
  startTimer();

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
  stopTimer();
  gameState.isPlaying = false;
  gameState.gameOver = true;
  gameState.isPlayerTurn = false;

  setCharSad();

  const bestScore = saveBestScore();
  gameInstruction.textContent = 'You Lose';
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

function gameWon() {
  stopRhythmGame();

  AudioManager.stopMusic();
  stopTimer();

  gameState.isPlaying = false;
  gameState.gameOver = true;
  gameState.isPlayerTurn = false;

  setCharHappy();

  const bestScore = saveBestScore();
  gameInstruction.textContent = 'YOU WIN!';
  gameStatus.textContent = `Congratulations! Final Score: ${gameState.score} | Best Score: ${bestScore}. Press ENTER to play again.`;
  gameStatus.className = 'game-status success';

  startBtn.disabled = false;

  // ✅ pause disabled on game won
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