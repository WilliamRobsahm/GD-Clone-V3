import { canvas } from "../misc/global.js";

export default class PlayerCamera {
    constructor(player) {
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.w = canvas.width;
        this.h = canvas.height;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getRightX() {
        return this.x + canvas.width;
    }

    getBottomY() {
        return this.y + canvas.height;
    }

    getWidth() {
        return canvas.width;
    }

    getHeight() {
        return canvas.height;
    }
}