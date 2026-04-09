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
    gameState.currentSpawnInterval = Math.max(100, gameState.baseSpawnInterval);
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