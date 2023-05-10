import { PlayerGamemode } from "./PlayerGamemodes.js";

const CUBE_GRAVITY = 1.2;
const JUMP_HEIGHT = -18;
const ROTATION_DEGREES = 6;
const SNAP_DIRECTION_POINT = 20; 
const SNAP_ROTATION_DEGREES = 8;

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

    updateRotation(d) {
        // Mid-air rotation
        if(!this.player.grounded) {
            this.player.rotate(ROTATION_DEGREES * d);
            return;
        } 

        // Snap to multiple of 90 when grounded
        let unevenDegs = this.player.rotationDeg % 90;
        if(unevenDegs == 0) return;
        if(unevenDegs < 0) unevenDegs = 90 - unevenDegs;

        let snapDirectionPoint = this.player.gravityMode == 1 ? SNAP_DIRECTION_POINT : 90 - SNAP_DIRECTION_POINT;

        // Snap "forwards"
        if(unevenDegs > snapDirectionPoint) {
            this.player.rotate(SNAP_ROTATION_DEGREES);
            unevenDegs = this.player.rotationDeg % 90;
            if(unevenDegs < snapDirectionPoint) {
                this.player.rotate(-unevenDegs);
            }
        }

        // Snap "backwards"
        else {
            this.player.rotate(-SNAP_ROTATION_DEGREES);
            unevenDegs = this.player.rotationDeg % 90;
            if(unevenDegs < snapDirectionPoint || unevenDegs < 0) {
                this.player.rotate(unevenDegs);
            }
        }
    }

    handleInput(input) {
        if(input.getJump() && this.player.grounded) {
            this.player.dy = JUMP_HEIGHT * this.player.gravityMode;
        }
    }
}
