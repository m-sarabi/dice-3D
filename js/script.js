const MAX_ROT = 5;
const MIN_ROT = 4;
const SHORT_DURATION = 500;
const MAX_DICES = 6;
const MIN_DICES = 1;
const MAX_ZOOM = 30;
const MIN_ZOOM = 5;

let isDark;
const dices = [];

let swiping = false;

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
            dice.cube.style.transition = `transform ${SHORT_DURATION}ms ease-in-out`;
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
    if (dices.some((dice) => dice.isRolling)) {
        return;
    }
    keyPressed(event.key);
});

function updateThemeIcon() {
    const themeButton = document.getElementById('theme-switch');
    themeButton.innerHTML = '';
    themeButton.appendChild(isDark ?
        document.getElementById('moon-svg').content.cloneNode(true) :
        document.getElementById('sun-svg').content.cloneNode(true));
}

function updateMainButtons() {
    document.getElementById('add-dice').disabled = dices.length >= MAX_DICES;
    document.getElementById('remove-dice').disabled = dices.length <= MIN_DICES;
    localStorage.setItem('dice-3d-dices', dices.length.toString());
}

function updateDiceSize(change = 0) {
    const root = document.querySelector(':root');
    let currentSize = localStorage.getItem('dice-3d-size') || '15';
    currentSize = Number(currentSize) + change;
    console.log(currentSize);
    document.getElementById('zoom-in').disabled = currentSize >= MAX_ZOOM;
    document.getElementById('zoom-out').disabled = currentSize <= MIN_ZOOM;
    if (currentSize > MAX_ZOOM || currentSize < MIN_ZOOM) return;
    localStorage.setItem('dice-3d-size', currentSize.toString());
    root.style.setProperty('--cube-size', `min(${currentSize}vh, ${currentSize}vw)`);
}

function themeInit() {
    isDark = localStorage.getItem('dice-3d-theme') === null ?
        window.matchMedia('(prefers-color-scheme: dark)').matches :
        localStorage.getItem('dice-3d-theme') === 'dark-mode';
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
    updateThemeIcon();
}

function initEvents() {
    document.getElementById('theme-switch').addEventListener('click', () => {
        const root = document.querySelector(':root');
        root.style.setProperty('--transition-duration', '0.5s');

        isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        localStorage.setItem('dice-3d-theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
        updateThemeIcon();

        setTimeout(() => {
            root.style.setProperty('--transition-duration', '0.2s');
        }, 500);
    });

    document.getElementById('roll-dice').addEventListener('click', () => {
        if (dices.some((dice) => dice.isRolling)) {
            return;
        }
        dices.forEach((dice) => {
            dice.cube.dispatchEvent(new Event('click'));
        });
    });

    document.getElementById('add-dice').addEventListener('click', () => {
        if (dices.length >= MAX_DICES) {
            return;
        }
        dices.push(new Dice());
        document.getElementById('dice-container').appendChild(dices.at(-1).cubeContainer);
        updateMainButtons();
    });

    document.getElementById('remove-dice').addEventListener('click', () => {
        if (dices.length <= MIN_DICES) {
            return;
        }
        document.getElementById('dice-container').removeChild(dices.at(-1).cubeContainer);
        dices.pop();
        updateMainButtons();
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        updateDiceSize(1);
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        updateDiceSize(-1);
    });
}

function dicesInit() {
    const diceCount = localStorage.getItem('dice-3d-dices') || 1;
    if (diceCount) {
        for (let i = 0; i < Number(diceCount); i++) {
            dices.push(new Dice());
        }
    }
    dices.forEach((dice) => {
        document.getElementById('dice-container').appendChild(dice.cubeContainer);
    });
    updateDiceSize();
    updateMainButtons();
}

function init() {
    themeInit();
    initEvents();
    dicesInit();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
