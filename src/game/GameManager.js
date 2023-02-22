import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import Player from "../player/Player.js";
import GameRenderer from "./GameRenderer.js";
import InputHandler from "./InputHandler.js";

export class GameManager {
    // Declare game constants
    constructor() {
        this.defaultSize = 64;
        this.floorHeight = 200;
    }

    // Set up other objects. This can't be done in constructor since other stuff has to be done beforehand, such as setting canvas size.
    initialize() {
        this.input = new InputHandler(this);
        this.renderer = new GameRenderer(this);
        this.player = new Player(this);
        this.FPSCounter = new FPSCounter(this);
    }

    update(deltaTime) {
        this.FPSCounter.increment();

        // All physics are designed for 60 FPS, but 'physicsMultiplier' determines how much of that will be done each frame.
        // On 60 fps, 'physicsMultiplier' will be about 1. On higher hz, it will be lower.
        let physicsMultiplier = 1000 / deltaTime / 60;
        this.player.update(this.input, physicsMultiplier);
    }

    render(camera) {

        // Set canvas position
        ctx.save();
        ctx.translate(-camera.getX(),-camera.getY());

        // Clear canvas
        this.renderer.clear(canvas, ctx, camera);

        this.renderer.renderObject(this.player);
        this.renderer.renderFloor(camera, this.floorHeight);

        // Render FPS Counter
        this.renderer.renderFPS(this.FPSCounter.getFPS(), camera);

        ctx.fillRect(1000, -500, 100, 100)
        ctx.restore();
    }
}