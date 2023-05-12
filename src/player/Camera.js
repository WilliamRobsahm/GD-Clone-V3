import { canvas, FLOOR_HEIGHT } from "../misc/global.js";
import Rect from "../misc/Rect.js";

const ICON_SCREEN_POSITION = 0.24;

export default class Camera extends Rect {
    constructor() {
        super();
    }

    reset() {
        this.updateX();
        this.realign();
    }

    getWidth() { return canvas.width }
    getHeight() { return canvas.height }

    // Update the camera to follow the player horizontally
    updateX(x = 0) {
        this.width = canvas.width;
        this.height = canvas.height;
        
        let playerScreenPosition = this.w * ICON_SCREEN_POSITION;
        this.x = x - playerScreenPosition;
    }

    realign() {
        this.width = canvas.width;
        this.height = canvas.height;
        this.y = -canvas.height + FLOOR_HEIGHT;
    }
}