import BackgroundClassic from "./backgrounds/BgClassic.js";
import FloorClassic from "./floors/FloorClassic.js";


// Used for background and floor
export default class ParallaxElement {
    constructor(level, type, multiplier, amount, id) {
        this.level = level;
        this.multiplier = multiplier;
        this.amount = amount;
        this.type = type;

        if(this.type == "floor") {
            this.y = 0;
            switch(id) {
                case 0:
                    this.element = new FloorClassic(800,200);
                    break;
            }
        } else if(this.type == "background") {
            switch(id) {
                case 0:
                    this.element = new BackgroundClassic(1000, 1000);
                    break;
            }
        }

        this.resetPosition();
    }

    update(camera, distance) {
        this.x += distance * this.multiplier;
        if(this.x + this.element.getWidth() < camera.getX()) {
            this.x += this.element.getWidth();
        }
    }

    /**
     * Move the element to its initial position.
     */
    resetPosition() {
        this.x = -this.element.getWidth();
        this.y = this.type == "floor" ? 0 : -this.element.getHeight();
        console.log(this.x, this.y);
    }

    render(channels) {
        // Prepare element for rendering (set up gradients, etc.)
        this.element.renderInit(this.x, this.y, channels);

        // Render background multiple times
        for(let i = 0; i < this.amount; i++) {
            let x = Math.floor((this.element.getWidth() * i) + this.x);
            let y = Math.floor(this.y);
            this.element.render(x, y);
        }
    }
}