import Hitbox from "./Hitbox.js";

export class Object {
    constructor(name, gX, gY, sX, sY, rotation, game) {
        this.game = game;
        this.name = name;
        this.gridX = gX;
        this.gridY = gY;
        this.shiftX = sX;
        this.shiftY = sY;
        this.rotation = rotation;
    }

    getX() { return this.gridX * 64 + this.shiftX }
    getY() { return -this.gridY * 64 + this.shiftY - 64 }

    getGridX() { return this.gridX }
    getGridY() { return this.gridY }

    getCenterX() { return this.getX() + this.getWidth() / 2 }
    getCenterY() { return this.getY() + this.getHeight() / 2 }

    getWidth() { return this.model.width }
    getHeight() { return this.model.height }

    getRotation() { return this.rotation }

    setModel(model) {
        this.model = model;
    }

    setHitbox(hitbox) {
        this.hitbox = new Hitbox(hitbox.type, hitbox.width, hitbox.height, hitbox.offsetX, hitbox.offsetY)
    }

    render(channels) {
        this.model.render(this, channels);
    }
}

