import { clamp } from "../helpers/helper.js";
import { canvas, FLOOR_HEIGHT } from "../misc/global.js";
import Rect from "../misc/Rect.js";

const ICON_SCREEN_POSITION = 0.24;

export default class Camera extends Rect {
    constructor() {
        super();
        this.minX = false;
        this.previousX = 0;
    }

    reset() {
        this.alignWithPlayerX();
        this.realign();
    }

    getDX() {
        let dx = this.getX() - this.previousX;
        this.previousX = this.getX();
        return dx;
    }

    getX() {
        if(this.minX && this.x < this.minX) {
            return this.minX;
        } else {
            return this.x;
        }
    }

    getCenterY() {
        let y = this.getY();
        let h = this.getHeight();
        console.log(y, h);
        return y + h / 2;
    }

    getWidth() { return canvas.width }
    getHeight() { return canvas.height }

    updateSize() {
        this.width = canvas.width;
        this.height = canvas.height;
    }

    // Update the camera to follow the player horizontally
    alignWithPlayerX(x = 0) {
        let playerScreenPosition = this.getWidth() * ICON_SCREEN_POSITION;
        this.x = x - playerScreenPosition;
    }

    realign() {
        this.y = -canvas.height + FLOOR_HEIGHT;
    }
}