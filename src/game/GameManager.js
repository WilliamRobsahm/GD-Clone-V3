import Level from "../level/level.js";
import { LevelManager } from "../level/LevelManager.js";
import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import ObjectBuilder from "../object/ObjectBuilder.js";
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
        this.objectBuilder = new ObjectBuilder(this);
        this.player = new Player(this);
        this.levelManager = new LevelManager(this);
        this.level = this.levelManager.getLevel(0);
        this.level.loadObjects(this.objectBuilder);
        this.FPSCounter = new FPSCounter(this);
    }

    update(deltaTime) {
        this.FPSCounter.increment();

        // All physics are designed for 60 FPS, but 'physicsMultiplier' determines how much of that will be done each frame.
        // On 60 fps, 'physicsMultiplier' will be around 1 (with slight fluxuation). On higher hz, it will be lower.
        // This also means that performance issues won't slow down the game.
        let physicsMultiplier = 1000 / deltaTime / 60;
        this.player.update(this.input, physicsMultiplier);
        this.level.background.update(this.player.camera, this.player.getDX());
    }

    render(camera) {

        // Set canvas position
        ctx.save();
        ctx.translate(-camera.getX(),-camera.getY());

        // Clear canvas
        this.renderer.clear(canvas, ctx, camera);

        this.level.background.render(this.level.colorChannels);

        this.renderer.renderObject(this.player);
        this.renderer.renderObjects(this.level.objects, this.level.colorChannels);
        this.renderer.renderFloor(camera, this.floorHeight, this.level.colorChannels);

        // Render FPS Counter
        this.renderer.renderFPS(this.FPSCounter.getFPS(), camera);

        
        ctx.restore();
    }
}