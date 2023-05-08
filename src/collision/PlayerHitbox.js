import Hitbox from "./hitbox.js";

export default class PlayerHitbox extends Hitbox {
    constructor(player, hitboxType, size) {
        super(hitboxType, size, size, 0);
        this.player = player;
        this.width = size;
        this.height = size;
    }

    getX() {
        return this.player.getX();
    }
}