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
  pauseTimer();

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
  resumeTimer();

  gameInstruction.textContent = 'Resumed';
  gameStatus.textContent = 'Back in action!';
  gameStatus.className = 'game-status';
}