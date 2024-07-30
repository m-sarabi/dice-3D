class Dice {
    constructor() {
        this.degrees = [-30, 30, 0];
        this.duration = 4000;
        this.cubeContainer = document.getElementById('dice-template').content.cloneNode(true).querySelector('.cube-container');
        this.cube = this.cubeContainer.querySelector('.cube');
        this.isRolling = false;
        this.transform = `rotateX(${this.degrees[0]}deg) rotateY(${this.degrees[1]}deg) rotateZ(${this.degrees[2]}deg)`;
        this.currentRoll = 0;
        this.touchStart = 0;
        this.touchEnd = 0;
        this.init();
    }

    init() {
        this.cube.style.transition = `${this.duration}ms ease-in-out`;
        requestAnimationFrame(() => {
            this.cube.style.transform = this.transform;
        });
        this.eventListener();
    }

    eventListener() {
        this.cube.addEventListener('click', () => {
            if (this.isRolling) {
                return;
            }
            this.duration = 4000;
            this.isRolling = true;
            this.cube.style.transition = `${this.duration}ms ease-in-out`;
            this.currentRoll = randomChoice([1, 2, 3, 4, 5, 6]);
            this.calculateDegrees(this.currentRoll);
            requestAnimationFrame(() => {
                this.cube.style.transform = `rotateX(${this.degrees[0]}deg) rotateY(${this.degrees[1]}deg) rotateZ(${this.degrees[2]}deg)`;
            });
            setTimeout(() => {
                this.isRolling = false;
            }, this.duration);
            console.log(this.currentRoll, this.degrees);
        });
        this.swipeStartEvent();
        this.swipeEndEvent();
    }

    swipeStartEvent() {
        this.cubeContainer.addEventListener('touchstart', (event) => {
            event.preventDefault();
            swiping = true;
            this.touchStart = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
            console.log(this.touchStart);
        });
    }

    swipeEndEvent() {
        this.cubeContainer.addEventListener('touchend', (event) => {
            if (swiping === true) {
                console.log(this.touchStart);
                this.touchEnd = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
                this.swipeRotate();
            }
            swiping = false;
        });
    }

    swipeRotate() {
        if (Math.abs(this.touchEnd[0] - this.touchStart[0]) > 2 * Math.abs(this.touchEnd[1] - this.touchStart[1])) {
            if (this.touchEnd[0] - this.touchStart[0] > 20) {
                keyPressed('ArrowRight');
            } else if (this.touchEnd[0] - this.touchStart[0] < -20) {
                keyPressed('ArrowLeft');
            }
        } else if (2 * Math.abs(this.touchEnd[0] - this.touchStart[0]) < Math.abs(this.touchEnd[1] - this.touchStart[1])) {
            if (this.touchEnd[1] - this.touchStart[1] > 20) {
                keyPressed('ArrowDown');
            } else if (this.touchEnd[1] - this.touchStart[1] < -20) {
                keyPressed('ArrowUp');
            }
        } else if (Math.abs(this.touchEnd[0] - this.touchStart[0]) <= 20 && Math.abs(this.touchEnd[1] - this.touchStart[1]) <= 20) {
            this.cube.dispatchEvent(new MouseEvent('click'));
        }
    }

    calculateDegrees(roll) {
        const degrees = [0, 0, 0];
        switch (roll) {
            case 1:
                degrees[0] = degrees[1] = randomChoice([0, 180]);
                degrees[2] = randomChoice([0, 90, 180, 270]);
                break;
            case 6:
                degrees[0] = randomChoice([0, 180]);
                degrees[1] = (degrees[0] + 180) % 360;
                degrees[2] = randomChoice([0, 90, 180, 270]);
                break;
            case 2:
                degrees[0] = randomChoice([0, 90, 180, 270]);
                switch (degrees[0]) {
                    case 0:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = (degrees[1] + 90) % 360;
                        break;
                    case 180:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = 270 - degrees[1];
                        break;
                    case 90:
                    case 270:
                        degrees[1] = randomChoice([0, 90, 180, 270]);
                        degrees[2] = degrees[0];
                        break;
                }
                break;
            case 3:
                degrees[0] = randomChoice([0, 90, 180, 270]);
                switch (degrees[0]) {
                    case 0:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = degrees[1];
                        break;
                    case 180:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = (degrees[1] + 180) % 360;
                        break;
                    case 90:
                    case 270:
                        degrees[1] = randomChoice([0, 90, 180, 270]);
                        degrees[2] = (degrees[0] + 270) % 360;
                        break;
                }
                break;
            case 4:
                degrees[0] = randomChoice([0, 90, 180, 270]);
                switch (degrees[0]) {
                    case 0:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = (degrees[1] + 180) % 360;
                        break;
                    case 180:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = degrees[1];
                        break;
                    case 90:
                    case 270:
                        degrees[1] = randomChoice([0, 90, 180, 270]);
                        degrees[2] = (degrees[0] + 90) % 360;
                        break;
                }
                break;
            case 5:
                degrees[0] = randomChoice([0, 90, 180, 270]);
                switch (degrees[0]) {
                    case 0:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = 270 - degrees[1];
                        break;
                    case 180:
                        degrees[1] = randomChoice([90, 270]);
                        degrees[2] = (degrees[1] + 90) % 360;
                        break;
                    case 90:
                    case 270:
                        degrees[1] = randomChoice([0, 90, 180, 270]);
                        degrees[2] = (degrees[0] + 180) % 360;
                        break;
                }
                break;
        }
        for (let i = 0; i < this.degrees.length; i++) {
            this.degrees[i] -= this.degrees[i] % 360;
            this.degrees[i] += degrees[i];
            const direction = Math.random() < 0.5;
            let rotation;
            if (i === 2) {
                // rotation = Math.floor(Math.random() * 2) * 360 + 360;
                rotation = 360;
            } else {
                rotation = Math.floor(Math.random() * (MAX_ROT - MIN_ROT)) * 360 + MIN_ROT * 360;
            }
            this.degrees[i] += rotation * (direction ? 1 : -1);
        }
    }
}