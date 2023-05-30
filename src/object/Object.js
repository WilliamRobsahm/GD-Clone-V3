import ObjectHitbox from "../collision/ObjectHitbox.js";
import Rect from "../misc/Rect.js";

export class Object extends Rect {
    constructor(name, gridX, gridY, shiftX, shiftY, rotation, game) {
        super();
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

    isHazard() {
        return (this.hitbox && this.hitbox.type == "HAZARD");
    }

    isSolid() {
        return (this.hitbox && this.hitbox.type == "SOLID");
    }

    render(channels) {
        this.model.render(this, channels);
    }
}

