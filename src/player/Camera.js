import { canvas, FLOOR_HEIGHT } from "../misc/global.js";
import Rect from "../misc/Rect.js";

const ICON_SCREEN_POSITION = 0.24;

export default class Camera extends Rect {
    constructor() {
        super();
    }

    reset() {
        this.alignWithPlayerX();
        this.realign();
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