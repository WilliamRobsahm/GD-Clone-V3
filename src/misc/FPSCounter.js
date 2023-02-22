export default class FPSCounter {
    constructor(game) {
        this.game = game; // Pointer

        this.renderFPS = {
            counter: 0,
            display: 0,
        }

        this.physicsFPS = {
            counter: 0,
            display: 0,
        }

        let updateInterval = setInterval(this.updateDisplay.bind(this),1000);
    }

    getRenderFPS() { return this.renderFPS.display }

    getPhysicsFPS() { return this.physicsFPS.display }

    incrementRender() {
        this.renderFPS.counter += 1;
    }

    incrementPhysics() {
        this.physicsFPS.counter += 1;
    }

    updateDisplay() {
        this.renderFPS.display = this.renderFPS.counter;
        this.physicsFPS.display = this.physicsFPS.counter;
        this.renderFPS.counter = 0;
        this.physicsFPS.counter = 0;
    }
}