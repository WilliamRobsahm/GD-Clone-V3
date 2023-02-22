import { PlayerGamemode } from "./PlayerGamemodes.js";

export class CubeGamemode extends PlayerGamemode {
    constructor(player) {
        super(player, "CUBE");
    }

    enter() {
        this.player.gravity = 1;
    }

    updateGravity(d) {
        if(this.player.grounded) {
            return;
        }

        this.player.dy += this.player.gravity * d;
    }

    handleInput(input) {
        if(input.getJump() && this.player.grounded) {
            this.player.dy = -16;
        }
    }
}
