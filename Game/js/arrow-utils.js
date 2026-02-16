// (helpers)// arrow-utils.js
// Arrow directions and their corresponding icons
const arrowDirections = ['up', 'down', 'left', 'right'];

const arrowIcons = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
};

// Keyboard mapping
const keyMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'W': 'up',
    'S': 'down',
    'A': 'left',
    'D': 'right'
};

// Highlight arrow when player clicks/presses key
function highlightPlayerArrow(index) {
    const arrowElements = document.querySelectorAll('.sequence-arrow');
    
    // First remove active class from all arrows
    arrowElements.forEach(arrow => arrow.classList.remove('active'));
    
    // Then add active class to the specific arrow that was clicked
    // But only if it's the player's turn
    if (gameState.isPlayerTurn && arrowElements[index]) {
        arrowElements[index].classList.add('active');
        
        // Remove the highlight after a short delay
        setTimeout(() => {
            arrowElements[index].classList.remove('active');
        }, 200);
    }
}

// Clear all arrows from the sequence display
function clearSequenceDisplay() {
    const sequenceDisplay = document.getElementById('sequence-display');
    if (sequenceDisplay) {
        sequenceDisplay.innerHTML = '';
    }
}

// Create arrow elements in the sequence display
function createSequenceArrows(sequence) {
    clearSequenceDisplay();
    const sequenceDisplay = document.getElementById('sequence-display');
    
    sequence.forEach((direction, index) => {
        const arrowElement = document.createElement('div');
        arrowElement.className = 'sequence-arrow';
        arrowElement.textContent = arrowIcons[direction];
        arrowElement.dataset.index = index;
        sequenceDisplay.appendChild(arrowElement);
    });
}

// Highlight a control button (big arrow button)
function highlightControlButton(direction, duration = 300) {
    const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
    if (arrowBtn) {
        arrowBtn.classList.add('highlight');
        
        setTimeout(() => {
            arrowBtn.classList.remove('highlight');
        }, duration);
    }
}

// Add keyboard press visual effect
function showKeyboardPress(direction) {
    const arrowBtn = document.querySelector(`.arrow-btn[data-direction="${direction}"]`);
    if (arrowBtn) {
        arrowBtn.classList.add('keyboard-press');
        setTimeout(() => arrowBtn.classList.remove('keyboard-press'), 200);
    }
}

// Disable/enable all arrow buttons
function setArrowButtonsEnabled(enabled) {
    const arrowButtons = document.querySelectorAll('.arrow-btn');
    arrowButtons.forEach(btn => {
        btn.disabled = !enabled;
    });
}