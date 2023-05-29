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
        this.x = 0;
        this.y = 0;

        this.floorY = this.level ? this.level.floorY : 0;
    }

    update(cameraX, distance) {
        if(!this.element) {
            this.setVariant();
            return;
        }

        this.x += distance * this.multiplier;
        if(this.x + this.element.getWidth() < cameraX) {
            this.x += this.element.getWidth();
        }

        this.y = this.floorY;
        if(this.type == "background") this.y -= this.element.getHeight();
    }

    getWidth() {
        return this.element.getWidth();
    }

    getHeight() {
        return this.element.getHeight();
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
        this.y = this.floorY;
        if(this.type == "background") this.y -= this.element.getHeight();
    }

    getSegmentCount() {
        if(!this.element) return;
        return Math.ceil(canvas.width / this.element.getWidth()) + 1;
    }

    // Render using bg/g color channels
    render(channels) {
        if(!this.element) {
            this.setVariant();
        }

        this.segmentCount = this.getSegmentCount();

        // Prepare element for rendering (set up gradients, etc.)
        let hsl = this.type == "background" ? channels.getValues("bg") : channels.getValues("g");
        this.element.renderInit(this.x, this.y, hsl);

        // Render background multiple times
        for(let i = 0; i < this.segmentCount; i++) {
            this.element.renderSegment(this.x, this.y, i);
        }
    }

    // Render using hsv
    menuRender(hue) {
        if(!this.element) {
            this.setVariant();
        }

        this.segmentCount = this.getSegmentCount();

        // Prepare element for rendering (set up gradients, etc.)
        let col = this.type == "background" ? `HSL(${hue},80,80)` : `HSL(${hue},80,70)`;
        this.element.renderInit(this.x, this.y, col);

        // Render background multiple times
        for(let i = 0; i < this.segmentCount; i++) {
            this.element.renderSegment(this.x, this.y, i);
        }
    }
}