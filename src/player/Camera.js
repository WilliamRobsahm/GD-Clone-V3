import { canvas, FLOOR_HEIGHT } from "../misc/global.js";

const ICON_SCREEN_POSITION = 0.24;

export default class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = canvas.width;
        this.h = canvas.height;
    }

    getX() { return Math.floor(this.x) }

    getY() { return Math.floor(this.y) }

    getX2() { return this.getX() + this.getWidth() }

    getY2() { return this.getY() + this.getHeight() }

    getWidth() { return canvas.width }

    getHeight() { return canvas.height }

    reset() {
        this.updateX();
        this.realign();
    }

    // Update the camera to follow the player horizontally
    updateX(x = 0) {
        this.w = canvas.width;
        this.h = canvas.height;
        
        let playerScreenPosition = this.w * ICON_SCREEN_POSITION;
        this.x = x - playerScreenPosition;
    }

    realign() {
        this.w = canvas.width;
        this.h = canvas.height;
        this.y = -canvas.height + FLOOR_HEIGHT;
    }
}