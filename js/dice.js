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
            console.log(rotations);
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

function themeHandler() {
    isDark = localStorage.getItem('theme') === 'dark-mode';

    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);

    // temp: Temporary change theme button
    document.getElementById('theme-switch').addEventListener('click', () => {
        console.log(isDark);
        isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);

        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
    });
}

function initEvents() {
    themeHandler();
}

function init() {
    initEvents();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    dices.push(new Dice());
    dices.push(new Dice());
    dices.forEach((dice) => {
        document.body.appendChild(dice.cubeContainer);
    });

    const root = document.querySelector(':root');
});
