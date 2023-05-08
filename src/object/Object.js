import ObjectHitbox from "../collision/ObjectHitbox.js";

export class Object {
    constructor(name, gridX, gridY, shiftX, shiftY, rotation, game) {
        this.game = game;
        this.name = name;
        this.gridX = gridX;
        this.gridY = gridY;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.rotation = rotation;

        this.chunk = null;
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

    getHitbox() { return this.hitbox }

    setModel(model) {
        this.model = model;
    }

    createHitbox(hitboxType, width, height, offsetX, offsetY) {
        this.hitbox = new ObjectHitbox(this,
            hitboxType, 
            width ?? this.getWidth(), 
            height ?? this.getHeight(), 
            offsetX ?? 0, 
            offsetY ?? 0
        );
    }

    setChunk(index) {
        this.chunk = index;
    }

    render(channels) {
        this.model.render(this, channels);
    }
}

