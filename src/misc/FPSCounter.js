export default class FPSCounter {
    constructor(game) {
        this.game = game; // Pointer

        this.counter = 0;
        this.fps = 0;

        this.updateInterval = setInterval(() => this.updateDisplay(), 1000);
    }

    getFPS() { 
        return this.fps
    }

    increment() {
        this.counter += 1;
    }

    updateDisplay() {
        this.fps = this.counter;
        this.counter = 0;
    }
}