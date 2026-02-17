// // (helpers)// arrow-utils.js
// // Arrow directions and their corresponding icons
// const arrowDirections = ['up', 'down', 'left', 'right'];

// const arrowIcons = {
//     up: '↑',
//     down: '↓',
//     left: '←',
//     right: '→'
// };

// // Keyboard mapping
// const keyMap = {
//     'ArrowUp': 'up',
//     'ArrowDown': 'down',
//     'ArrowLeft': 'left',
//     'ArrowRight': 'right',
//     'w': 'up',
//     's': 'down',
//     'a': 'left',
//     'd': 'right',
//     'W': 'up',
//     'S': 'down',
//     'A': 'left',
//     'D': 'right'
// };

// // Highlight arrow when player clicks/presses key
// function highlightPlayerArrow(index) {
//     const arrowElements = document.querySelectorAll('.sequence-arrow');
    
//     // First remove active class from all arrows
//     arrowElements.forEach(arrow => arrow.classList.remove('active'));
    
//     // Then add active class to the specific arrow that was clicked
//     // But only if it's the player's turn
//     if (gameState.isPlayerTurn && arrowElements[index]) {
//         arrowElements[index].classList.add('active');
        
//         // Remove the highlight after a short delay
//         setTimeout(() => {
//             arrowElements[index].classList.remove('active');
//         }, 200);
//     }
// }

// // Clear all arrows from the sequence display
// function clearSequenceDisplay() {
//     const sequenceDisplay = document.getElementById('sequence-display');
//     if (sequenceDisplay) {
//         sequenceDisplay.innerHTML = '';
//     }
// }

// // Create arrow elements in the sequence display
// function createSequenceArrows(sequence) {
//     clearSequenceDisplay();
//     const sequenceDisplay = document.getElementById('sequence-display');
    
//     sequence.forEach((direction, index) => {
//         const arrowElement = document.createElement('div');
//         arrowElement.className = 'sequence-arrow';
//         arrowElement.textContent = arrowIcons[direction];
//         arrowElement.dataset.index = index;
//         sequenceDisplay.appendChild(arrowElement);
//     });
// }

// // Highlight a control button (big arrow button)
// function highlightControlButton(direction, duration = 300) {
//     const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
//     if (arrowBtn) {
//         arrowBtn.classList.add('highlight');
        
//         setTimeout(() => {
//             arrowBtn.classList.remove('highlight');
//         }, duration);
//     }
// }

// // Add keyboard press visual effect
// function showKeyboardPress(direction) {
//     const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
//     if (arrowBtn) {
//         arrowBtn.classList.add('keyboard-press');
//         setTimeout(() => arrowBtn.classList.remove('keyboard-press'), 200);
//     }
// }

// // Disable/enable all arrow buttons
// function setArrowButtonsEnabled(enabled) {
//     const arrowButtons = document.querySelectorAll('.arrow-btn');
//     arrowButtons.forEach(btn => {
//         btn.disabled = !enabled;
//     });
// }





// // Character animation functions 
// function getSelectedCharacterImage() {
//     if (gameState.selectedCharacter && gameState.selectedCharacter.image) {
//         return gameState.selectedCharacter.image;
//     }
//     return '/Game/assets/images/chandler/chandler.svg';
// }

// function setCharNormal() {
//     gameState.charState = 'normal';
//     charImage.src = getSelectedCharacterImage();
//     charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Normal)`;
// }

// function setCharHappy() {
//     gameState.charState = 'happy';
//     charImage.src = getSelectedCharacterImage();
//     charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Happy)`;

//     // Reset to normal after 1 second
//     if (gameState.keyPressTimeout) {
//         clearTimeout(gameState.keyPressTimeout);
//     }
//     gameState.keyPressTimeout = setTimeout(() => {
//         if (gameState.isPlaying && !gameState.gameOver) {
//             setCharNormal();
//         }
//     }, 1000);
// }

// function setCharSad() {
//     gameState.charState = 'sad';
//     charImage.src = getSelectedCharacterImage();
//     charImage.alt = `${gameState.selectedCharacter.name || 'Character'} (Sad)`;

//     // Reset to normal after 1.5 seconds
//     if (gameState.keyPressTimeout) {
//         clearTimeout(gameState.keyPressTimeout);
//     }
//     gameState.keyPressTimeout = setTimeout(() => {
//         if (gameState.isPlaying && !gameState.gameOver) {
//             setCharNormal();
//         }
//     }, 1500);
// }

// // Keyboard input handler (YOUR EXISTING FUNCTION - UNCHANGED)
// function handleKeyPress(event) {
//     // Only process keyboard if it's player's turn and game is active
//     if (!gameState.isPlayerTurn || !gameState.isPlaying) {
//         return;
//     }

//     const key = event.key;
//     const direction = keyMap[key];

//     // If the pressed key is mapped to a direction
//     if (direction) {
//         event.preventDefault(); // Prevent page scrolling
//         handleArrowClick(direction);

//         // Also visually highlight the corresponding button
//         const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
//         if (arrowBtn) {
//             arrowBtn.classList.add('keyboard-press');
//             setTimeout(() => arrowBtn.classList.remove('keyboard-press'), 200);
//         }
//     }
// }