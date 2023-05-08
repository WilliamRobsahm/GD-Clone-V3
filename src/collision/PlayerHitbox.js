import Hitbox from "./hitbox.js";

export default class PlayerHitbox extends Hitbox {
    constructor(player, hitboxType, size, offset) {
        super(hitboxType, size, size, 0, offset, offset);
        this.player = player;
    }

    getX() {
        return this.player.getX();
    }

    getY() {
        return this.player.getY();
    }
}