import Hitbox from "./hitbox.js";

export default class ObjectHitbox extends Hitbox {
    constructor(object, hitboxType, width, height, offsetX, offsetY) {
        super(hitboxType, width, height, 0)
        this.object = object;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    getX() {
        return this.object.getX() + this.offsetX;
    }

    getY() {
        return this.object.getY() + this.offsetY;
    }
}