import { ctx } from "../misc/global.js";
import PlayerCamera from "../player/PlayerCamera.js";

export default class GameRenderer {
    constructor(game) {
        this.game = game;
    }

    /**
     * Clears the canvas
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     */
    clear(canvas, ctx, camera) {
        ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height);
    }

    renderFPS(fps, camera) {
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.font = "16px Arial"
        ctx.fillText(`${fps} FPS`, camera.getRightX() - 20, camera.getY() + 30);
    }

    render() {
        
    }

    renderFloor(camera, floorHeight) {
        ctx.fillStyle = "white";
        ctx.fillRect(camera.getX(), 0, camera.getWidth(), floorHeight); 
    }

    renderObject(object) {
        object.render();
    }
}
