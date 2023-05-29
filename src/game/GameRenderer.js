import ColorHelper from "../helpers/ColorHelper.js";
import { applyProperties } from "../helpers/helper.js";
import RenderHelper from "../helpers/RenderHelper.js";
import { ctx } from "../misc/global.js";
import PlayerCamera from "../player/Camera.js";

export default class GameRenderer {
    constructor(game) {
        this.game = game;
    }

    /**
     * Clears the canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     */
    static clear(ctx, camera) {
        ctx.clearRect(
            camera.getX() * camera.zoom, 
            camera.getY() * camera.zoom, 
            camera.getWidth(), 
            camera.getHeight()
        );
    }

    static translate(ctx, camera) {
        ctx.translate(
            -camera.getX() * camera.zoom, 
            -camera.getY() * camera.zoom
        );
    }

    static renderFPS(fps, camera, ctx) {
        applyProperties(ctx, {
            fillStyle: "rgba(255,255,255,0.5)",
            strokeStyle: "rgba(0,0,0,0.5)",
            lineWidth: 5,
            textAlign: "right",
            font: "24px Arco",
        })
        let x = camera.getX2() - 20;
        let y = camera.getY() + 30;
        ctx.strokeText(`${fps} FPS`, x, y);
        ctx.fillText(`${fps} FPS`, x, y);
    }

    static renderGameBackground(background, channels) {
        background.render(channels);
    }

    static renderGameFloor(floor, camera, channels, ctx) {
        floor.render(channels);
        this.renderFloorLine(floor, camera, channels, ctx)
    }

    static renderFloorLine(floor, camera, channels, ctx) {
        const FLOOR_LINE_WIDTH = 3;
        const FLOOR_Y = floor.floorY + FLOOR_LINE_WIDTH / 2;
        const LINE_VALUES = channels.getValues("line");
        let lineColor;
        if(LINE_VALUES.blending) {
            lineColor = RenderHelper.getHorizontalGradient(
                ctx, camera.getX(), camera.getWidth(), ["rgba(0,0,0,0)", ColorHelper.HSL(LINE_VALUES), "rgba(0,0,0,0)"]
            );
        } else {
            lineColor = ColorHelper.HSL(LINE_VALUES);
        }

        applyProperties(ctx, {strokeStyle: lineColor, lineWidth: FLOOR_LINE_WIDTH});
        ctx.beginPath();
        ctx.moveTo(camera.getX(), FLOOR_Y);
        ctx.lineTo(camera.getX2(), FLOOR_Y);
        ctx.stroke();
        ctx.closePath();
    }

    static renderLevelObjects(level, camera) {
        level.renderObjects(camera);
    }

    static renderHitboxes(level, player, camera) {
        player.renderHitbox();
        level.renderHitboxes(camera);
    }

    static renderObject(object) {
        object.render();
    }

    static renderAttemptsText(player) {

        // Should also work with start positions and checkpoints later on.
        const tX = player.startX + 580;
        const tY = player.startY - 200;

        
        const attemptsText = "Attempt " + player.attempts;

        applyProperties(ctx, {
            font: "60px Arco",
            fillStyle: "rgba(255,255,255,0.5)",
            strokeStyle: "rgba(0,0,0,0.5)",
            lineWidth: 5,
        })

        ctx.strokeText(attemptsText, tX, tY);
        ctx.fillText(attemptsText, tX, tY);
    }
}
