import { GRID_SIZE } from "../misc/global.js";
import PlayerCamera from "../player/Camera.js";

export default class Chunk {
    constructor(gridX, size) {
        this.gridX = gridX;
        this.size = size;
    }

    // Return true if player is close enough to the chunk to check collision for all objects in it
    inCollisionRange(player) {
        let leeway = 32;
        return (this.gridX + this.size) * GRID_SIZE > player.getX() - leeway &&
        this.gridX * GRID_SIZE < player.getX() + player.getWidth() + leeway
    }

    /**
     * Return true if chunk is on screen and its objects should be rendered
     * @param {PlayerCamera} camera 
     */
    inRenderingRange(camera) {
        // Gives one extra tile of leeway on both ends, 
        // to prevent any larger objects (like saws) from popping in/out of existance.
        let leeway = GRID_SIZE;
        return (this.gridX + this.size) * GRID_SIZE > camera.getX() - leeway &&
            this.gridX * GRID_SIZE < camera.getX() + camera.getWidth() + leeway
    }
}