import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import Player from "../player/Player.js";
import GameRenderer from "./GameRenderer.js";
import InputHandler from "./InputHandler.js";

export class GameManager {
    // Declare game constants
    constructor() {
        this.FPS = 120;
        this.defaultSize = 64;
        this.floorHeight = 200;
    }

    // Set up other objects. This can't be done in constructor since other stuff has to be done beforehand, such as setting canvas size.
    initialize() {
        this.input = new InputHandler(this);
        this.renderer = new GameRenderer(this);
        this.player = new Player(this);

        this.physicsFPS = new FPSCounter(this);
        this.renderFPS = new FPSCounter(this);
        
        let interval = 1000 / this.FPS
        this.physicsLoop = setInterval(() => this.update(), interval);
    }

    // Always runs at 120 FPS, regardless of screen refresh rate.
    update() {
        this.physicsFPS.increment();

        this.player.update();
    }

    render(camera) {
        this.renderFPS.increment();

        // Set canvas position
        ctx.save();
        ctx.translate(-camera.getX(),-camera.getY());

        // Clear canvas
        this.renderer.clear(canvas, ctx, camera);

        this.renderer.renderObject(this.player);
        this.renderer.renderFloor(camera, this.floorHeight);

        // Render FPS Counter
        this.renderer.FPS(this.physicsFPS.getFPS(), this.renderFPS.getFPS(), camera);

        ctx.fillRect(1000, -500, 100, 100)

        ctx.restore();
    }
}