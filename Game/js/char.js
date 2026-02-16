const characters = [
    { name: 'Chandler', image: '/Game/assets/images/chandler/chandler.svg' },
    { name: 'Joey', image: '/Game/assets/images/joey/joey.svg' },
    { name: 'Monica', image: '/Game/assets/images/monica/monica.svg' },
    { name: 'Phoebe', image: '/Game/assets/images/phoebe/phoebe.svg' },
    { name: 'Rachel', image: '/Game/assets/images/rachel/rachel.svg' },
    { name: 'Ross', image: '/Game/assets/images/ross/ross.svg' }
];

let currentIndex = 0;

const characterName = document.getElementById('characterName');
const characterImage = document.getElementById('characterImage');
const statusText = document.getElementById('statusText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const chooseBtn = document.getElementById('chooseBtn');

function renderCharacter() {
    const selected = characters[currentIndex];
    characterName.textContent = selected.name;
    characterImage.src = selected.image;
    characterImage.alt = selected.name;
    characterImage.style.transform = `scale(${selected.scale || 1})`;
    statusText.textContent = '';
}

prevBtn.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    renderCharacter();
});

nextBtn.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % characters.length;
    renderCharacter();
});

chooseBtn.addEventListener('click', function () {
    const selected = characters[currentIndex];
    localStorage.setItem('selectedCharacter', JSON.stringify(selected));
    statusText.textContent = `${selected.name} selected!`;
    setTimeout(function () {
        window.location.href = '/Game/index.html?play=1';
    }, 300);
});

renderCharacter();
