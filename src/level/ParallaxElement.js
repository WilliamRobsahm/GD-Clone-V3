import { canvas } from "../misc/global.js";
import BackgroundClassic from "./backgrounds/BackgroundClassic.js";
import FloorClassic from "./floors/FloorClassic.js";


// Used for background and floor
export default class ParallaxElement {
    constructor(level, type, multiplier = 0) {
        this.level = level;
        this.multiplier = multiplier;
        this.type = type;
        this.element;
        this.x;
        this.y;
    }

    update(camera, distance) {
        if(!this.element) {
            this.setVariant();
            return;
        }

        this.x += distance * this.multiplier;
        if(this.x + this.element.getWidth() < camera.getX()) {
            this.x += this.element.getWidth();
        }
    }

    setVariant(id = 0) {
        if(this.type == "floor") {
            switch(id) {
                case 0:
                    this.element = new FloorClassic(800,200);
                    break;
            }
        } 
        
        else if(this.type == "background") {
            switch(id) {
                case 0:
                    this.element = new BackgroundClassic(1000, 1000);
                    break;
            }
        }

        this.resetPosition();
    }

    /**
     * Move the element to its initial position.
     */
    resetPosition() {
        if(!this.element) return;
        this.x = -this.element.getWidth();
        this.y = this.type == "floor" ? 0 : -this.element.getHeight();
    }

    getSegmentCount() {
        if(!this.element) return;
        return Math.ceil(canvas.width / this.element.getWidth()) + 1;
    }

    render(channels) {
        if(!this.element) {
            this.setVariant();
            return;
        }

        this.segmentCount = this.getSegmentCount();

        // Prepare element for rendering (set up gradients, etc.)
        this.element.renderInit(this.x, this.y, channels);

        // Render background multiple times
        for(let i = 0; i < this.segmentCount; i++) {
            this.element.renderSegment(this.x, this.y, i);
        }
    }
}