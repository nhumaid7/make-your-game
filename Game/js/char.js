// map of character name to image path
const characters = [
    { name: 'Chandler', image: '/Game/assets/images/chandler/chandler.svg', nameImage: '/Game/assets/images/char/chandler btn.png' },
    { name: 'Joey', image: '/Game/assets/images/joey/joey.svg', nameImage: '/Game/assets/images/char/joey btn.png' },
    { name: 'Monica', image: '/Game/assets/images/monica/monica.svg', nameImage: '/Game/assets/images/char/monica btn.png' },
    { name: 'Phoebe', image: '/Game/assets/images/phoebe/phoebe.svg', nameImage: '/Game/assets/images/char/phoebe btn.png' },
    { name: 'Rachel', image: '/Game/assets/images/rachel/rachel.svg', nameImage: '/Game/assets/images/char/rachel btn.png' },
    { name: 'Ross', image: '/Game/assets/images/ross/ross.svg', nameImage: '/Game/assets/images/char/ross btn.png' }
];

// current selected character index
let current = 0;

// DOM elements
const characterImage = document.getElementById('characterImage');
const characterNameImage = document.getElementById('characterNameImage');
const statusText = document.getElementById('statusText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const chooseBtn = document.getElementById('chooseBtn');

// render the current character
function renderCharacter() {
    const selected = characters[current];
    characterImage.src = selected.image;
    characterImage.alt = selected.name;
    characterNameImage.src = selected.nameImage;
    characterNameImage.alt = selected.name;
    chooseBtn.setAttribute('aria-label', `Choose ${selected.name}`);
    statusText.textContent = '';
}

// event listeners for buttons
prevBtn.addEventListener('click', function () {
    current = (current - 1 + characters.length) % characters.length;
    renderCharacter();
});

nextBtn.addEventListener('click', function () {
    current = (current + 1) % characters.length;
    renderCharacter();
});

chooseBtn.addEventListener('click', function () {
    const selected = characters[current];
    localStorage.setItem('friendsSelectedCharacter', JSON.stringify(selected));
    statusText.textContent = `${selected.name} selected! Loading tutorial...`;
    setTimeout(() => {
        window.location.href = '/Game/tutorial.html';
    }, 500);
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevBtn.click();
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextBtn.click();
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        chooseBtn.click();
    }
});

renderCharacter();
