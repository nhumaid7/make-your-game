// Character animation functions 
function getSelectedCharacterImage() {
    if (gameState.selectedCharacter && gameState.selectedCharacter.image) {
        return gameState.selectedCharacter.image;
    }
    return '/Game/assets/images/chandler/chandler.svg';
}

function setCharNormal() {
    gameState.charState = 'normal';
    charImage.src = getSelectedCharacterImage();
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Normal)`;
}

function setCharHappy() {
    gameState.charState = 'happy';
    charImage.src = getSelectedCharacterImage();
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Happy)`;

    // Reset to normal after 1 second
    if (gameState.keyPressTimeout) {
        clearTimeout(gameState.keyPressTimeout);
    }
    gameState.keyPressTimeout = setTimeout(() => {
        if (gameState.isPlaying && !gameState.gameOver) {
            setCharNormal();
        }
    }, 1000);
}

function setCharSad() {
    gameState.charState = 'sad';
    charImage.src = getSelectedCharacterImage();
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Sad)`;

    // Reset to normal after 1.5 seconds
    if (gameState.keyPressTimeout) {
        clearTimeout(gameState.keyPressTimeout);
    }
    gameState.keyPressTimeout = setTimeout(() => {
        if (gameState.isPlaying && !gameState.gameOver) {
            setCharNormal();
        }
    }, 1500);
}

// Keyboard input handler (YOUR EXISTING FUNCTION - UNCHANGED)
function handleKeyPress(event) {
    // Only process keyboard if it's player's turn and game is active
    if (!gameState.isPlayerTurn || !gameState.isPlaying) {
        return;
    }

    const key = event.key;
    const direction = keyMap[key];

    // If the pressed key is mapped to a direction
    if (direction) {
        event.preventDefault(); // Prevent page scrolling
        handleArrowClick(direction);

        // Also visually highlight the corresponding button
        const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
        if (arrowBtn) {
            arrowBtn.classList.add('keyboard-press');
            setTimeout(() => arrowBtn.classList.remove('keyboard-press'), 200);
        }
    }
}