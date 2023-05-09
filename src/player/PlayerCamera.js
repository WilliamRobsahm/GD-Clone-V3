import { canvas } from "../misc/global.js";

export default class PlayerCamera {
    constructor(player) {
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.w = canvas.width;
        this.h = canvas.height;
    }

    getX() { return Math.floor(this.x) }

    getY() { return Math.floor(this.y) }

    getRightX() { return this.getX() + this.getWidth() }

    getBottomY() { return this.getY() + this.getHeight() }

    getWidth() { return canvas.width }

    getHeight() { return canvas.height }

    reset() {
        this.updateX();
        this.realign();
    }

    // Update the camera to follow the player horizontally
    updateX() {
        let playerScreenPosition = canvas.width * 0.24
        this.x = this.player.getX() - playerScreenPosition;
    }

    realign() {
        this.w = canvas.width;
        this.h = canvas.height;
        
        this.y = -canvas.height + this.player.game.floorHeight;
    }
}