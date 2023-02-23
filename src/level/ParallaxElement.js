import BackgroundClassic from "./backgrounds/BgClassic.js";
import FloorClassic from "./floors/FloorClassic.js";


// Used for background and floor
export default class ParallaxElement {
    constructor(level, type, multiplier, amount, element) {
        this.level = level;
        this.multiplier = multiplier;
        this.amount = amount;


        if(type == "floor") {
            this.y = 0;
            switch(element) {
                case 0:
                    this.element = new FloorClassic(800,200);
                    break;
            }
            this.x = -this.element.getWidth();
            this.y = 0;
        } else if(type == "background") {
            switch(element) {
                case 0:
                    this.element = new BackgroundClassic(1000, 1000);
                    break;
            }
            this.x = -this.element.getWidth();
            this.y = -this.element.getHeight();
        }
        
        
    }

    update(camera, distance) {
        this.x += distance * this.multiplier;
        if(this.x + this.element.getWidth() < camera.getX()) {
            this.x += this.element.getWidth();
        }
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