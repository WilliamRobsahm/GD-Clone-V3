import Hitbox from "./hitbox.js";

export default class ObjectHitbox extends Hitbox {
    constructor(object, hitboxType, width, height, offsetX, offsetY) {
        super(hitboxType, width, height, 0, offsetX, offsetY)
        this.object = object;
    }

    getX() {
        return this.object.getX() + this.offsetX;
    }

    getY() {
        return this.object.getY() + this.offsetY;
    }
}