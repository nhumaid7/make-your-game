// Character animation functions 
function getSelectedCharacterImage(state = 'select') {
    if (!gameState.selectedCharacter) {
        return '/Game/assets/images/chandler/chandler.svg';
    }

    if (state === 'right1' && gameState.selectedCharacter.imageRight1) {
        return gameState.selectedCharacter.imageRight1;
    }

    if (state === 'right2' && gameState.selectedCharacter.imageRight2) {
        return gameState.selectedCharacter.imageRight2;
    }

    if (state === 'wrong' && gameState.selectedCharacter.imageWrong) {
        return gameState.selectedCharacter.imageWrong;
    }

    if (gameState.selectedCharacter.imageSelect) {
        return gameState.selectedCharacter.imageSelect;
    }

    if (gameState.selectedCharacter.image) {
        return gameState.selectedCharacter.image;
    }

    return '/Game/assets/images/chandler/chandler.svg';
}

function setCharNormal() {
    gameState.charState = 'normal';
    gameState.nextCorrectImage = 1;
    charImage.src = getSelectedCharacterImage('select');
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Normal)`;
}

function setCharHappy() {
    gameState.charState = 'happy';
    if (gameState.nextCorrectImage === 2) {
        charImage.src = getSelectedCharacterImage('right2');
        gameState.nextCorrectImage = 1;
    } else {
        charImage.src = getSelectedCharacterImage('right1');
        gameState.nextCorrectImage = 2;
    }
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Happy)`;
}

function setCharSad() {
    gameState.charState = 'sad';
    gameState.nextCorrectImage = 1;
    charImage.src = getSelectedCharacterImage('wrong');
    charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Sad)`;
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