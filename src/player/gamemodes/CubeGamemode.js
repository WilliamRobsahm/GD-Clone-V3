import { PlayerGamemode } from "./PlayerGamemodes.js";

const CUBE_GRAVITY = 1.2;
const JUMP_HEIGHT = -18;

export class CubeGamemode extends PlayerGamemode {
    constructor(player) {
        super(player, "CUBE");
    }

    enter() {
        this.player.gravity = CUBE_GRAVITY;
    }

    updateGravity(d) {
        if(this.player.grounded) return;

        this.player.dy += this.player.gravityMode * this.player.gravity * d;
    }

    handleInput(input) {
        if(input.getJump() && this.player.grounded) {
            this.player.dy = JUMP_HEIGHT * this.player.gravityMode;
        }
    }
}
