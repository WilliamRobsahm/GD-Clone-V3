import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import Player from "../player/Player.js";
import GameRenderer from "./GameRenderer.js";
import InputHandler from "./InputHandler.js";

const FPS = 120

export class GameManager {
    constructor() {
        
        
    }

    initialize() {
        this.input = new InputHandler(this);
        this.renderer = new GameRenderer(this);
        this.player = new Player(this);
        this.FPSCounter = new FPSCounter(this);
        
        let interval = 1000 / FPS
        this.physicsLoop = setInterval(() => this.update(), interval);
    }

    // Always runs at 120 FPS, regardless of screen refresh rate.
    update() {
        this.FPSCounter.incrementPhysics();
    }

    render() {
        this.FPSCounter.incrementRender();

        // Set canvas position
        ctx.save();
        ctx.translate(-this.player.camera.getX(),-this.player.camera.getY());

        // Clear canvas
        this.renderer.clear(canvas, ctx, this.player.camera);

        // Render FPS Counter
        this.renderer.FPS(this.FPSCounter.getPhysicsFPS(), this.FPSCounter.getRenderFPS(), this.player.camera);

        ctx.restore();
    }
}