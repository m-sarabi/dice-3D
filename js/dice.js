const MAX_ROT = 5;
const MIN_ROT = 4;
const LONG_DURATION = 4000;
const SHORT_DURATION = 500;

let isDark;
const dices = [];

let swiping = false;

let lastClicked = Date.now() - LONG_DURATION;

// handling arrow keys
function keyPressed(key) {
    let dif = 15;
    const rotations = [0, 0, 0];
    switch (key) {
        case 'ArrowRight':
            rotations[1] += dif;
            break;
        case 'ArrowLeft':
            rotations[1] -= dif;
            break;
        case 'ArrowUp':
            rotations[0] += dif;
            break;
        case 'ArrowDown':
            rotations[0] -= dif;
            break;
        case '+':
            rotations[2] += dif;
            break;
        case '-':
            rotations[2] -= dif;
            break;
    }
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', '+', '-'].includes(key)) {
        dices.forEach((dice) => {
            dice.cube.style.transition = SHORT_DURATION + 'ms ease-in-out';
            dice.degrees.forEach((degree, index) => {
                dice.degrees[index] += rotations[index];
            });
            dice.cube.style.transform = `rotateX(${dice.degrees[0]}deg) rotateY(${dice.degrees[1]}deg) rotateZ(${dice.degrees[2]}deg)`;
        });
    }
    // lastClicked = Date.now();
}

// keypress events
document.addEventListener('keydown', function (event) {
    if (event.repeat || Date.now() - lastClicked <= LONG_DURATION) {
        return;
    }
    keyPressed(event.key);
});

function updateThemeIcon() {
    const themeButton = document.getElementById('theme-switch');
    themeButton.innerHTML = '';
    themeButton.appendChild(isDark ?
        document.getElementById('sun-svg').content.cloneNode(true) :
        document.getElementById('moon-svg').content.cloneNode(true));
}

function themeInit() {
    isDark = localStorage.getItem('theme') === null ?
        window.matchMedia('(prefers-color-scheme: dark)').matches :
        localStorage.getItem('theme') === 'dark-mode';
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
    updateThemeIcon();
}

function initEvents() {
    const themeButton = document.getElementById('theme-switch');
    themeButton.addEventListener('click', () => {
        isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
        updateThemeIcon();
    });
}

function init() {
    themeInit();
    initEvents();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    dices.push(new Dice());
    dices.push(new Dice());
    dices.forEach((dice) => {
        document.getElementById('dice-container').appendChild(dice.cubeContainer);
    });

    // const root = document.querySelector(':root');
});
