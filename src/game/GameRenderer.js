import { ctx } from "../misc/global.js";
import { setAttributes } from "../misc/util.js";
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
        ctx.clearRect(camera.getX(), camera.getY(), canvas.width, canvas.height);
    }

    renderFPS(fps, camera) {
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.font = "16px Arial"
        ctx.fillText(`${fps} FPS`, camera.getRightX() - 20, camera.getY() + 30);
    }

    render() {
        
    }

    renderBackground(background, channels) {
        background.render(channels);
    }

    renderFloor(floor, camera, floorHeight, channels) {
        floor.render(channels);

        // Floor line
        setAttributes(ctx, {strokeStyle: channels.line.getColor(), lineWidth: 3});
        ctx.beginPath();
        ctx.moveTo(camera.getX(), 1.5);
        ctx.lineTo(camera.getX() + camera.getWidth(), 1.5);
        ctx.stroke();
        ctx.closePath();
    }

    renderLevelObjects(level, camera) {
        level.renderObjects(camera);
    }

    renderHitboxes(level, player, camera) {
        player.renderHitbox();
        level.renderHitboxes(camera);
    }

    renderObject(object) {
        object.render();
    }
}
