import { input } from "../game/InputHandler.js";
import { clamp } from "../helpers/helper.js";
import { canvas, FLOOR_HEIGHT } from "../misc/global.js";
import Rect from "../misc/Rect.js";

const ICON_SCREEN_POSITION = 0.24;

export default class Camera extends Rect {
    constructor() {
        super();
        this.minX = false;
        this.minY = false;
        this.maxY = false;
        this.previousX = 0;

        this.zoom = 1;
        this.maxZoom = 1;
        this.minZoom = 1;
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

    move(x = false, y = false) {
        if(x) this.x += x / this.zoom;
        if(y) this.y += y / this.zoom;
    }

    updateZoom(delta) {
        let prevZoom = this.zoom;

        this.zoom += delta;
        this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100; // Round to 2 digits
        this.zoom = clamp(this.zoom, this.minZoom, this.maxZoom);
        console.log(this.zoom);

        let mouseXPercent = input.getMouseX() / canvas.width;
        let mouseYPercent = input.getMouseY() / canvas.height;

        let zoomDiff = prevZoom / this.zoom;
        let xDiff = this.getWidth() - this.getWidth() * zoomDiff;
        let yDiff = this.getHeight() - this.getHeight() * zoomDiff;
        this.move(xDiff * mouseXPercent * this.zoom, yDiff * mouseYPercent * this.zoom);
        this.forceLimits();
    }

    /**
     * If camera position is outside the limits, it's moved to be within the limis.
     * (By default, camera position *can* be outside of limits, but getX()/getY() would only return values within the limits)
     */
    forceLimits() {
        if(this.minX !== false && this.x < this.minX / this.zoom) {
            this.x = this.minX / this.zoom;
        }

        // maxX is not implemented currently.

        if(this.minY !== false && this.y < this.minY / this.zoom) {
            this.y = this.minY / this.zoom;
        }

        if(this.maxY !== false && this.y + this.getHeight() > this.maxY) {
            this.y = this.maxY - this.getHeight();
        } 
    }

    getWidth() { 
        return canvas.width / this.zoom;
    }
    getHeight() { 
        return canvas.height / this.zoom;
    }

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