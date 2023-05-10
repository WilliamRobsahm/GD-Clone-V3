import Level from "../level/Level.js";
import { LevelManager } from "../level/LevelManager.js";
import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import ObjectBuilder from "../object/ObjectBuilder.js";
import Player from "../player/Player.js";
import PlayerCamera from "../player/PlayerCamera.js";
import config from "./config.js";
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
        this.FPSCounter = new FPSCounter(this);

        this.levelManager = new LevelManager(this);
        this.level = new Level(this);

        this.levelManager.getMainLevels((mainLevels) => {
            this.levelManager.mainLevelInfo = mainLevels;

            this.levelManager.loadMainLevelData(0, (leveldata, levelinfo) => {
                this.level.loadLevel(leveldata, levelinfo, this.objectBuilder);
                this.player.respawn(this.level);
            });
        });
    }

    update(deltaTime) {
        this.FPSCounter.increment();
        if(deltaTime > 200) return;

        // All physics are designed for 60 FPS, but 'physicsMultiplier' determines how much of that will be done each frame.
        // On 60 fps, 'physicsMultiplier' will be around 1 (with slight fluxuation). On higher hz, it will be lower.
        // This also means that performance issues won't slow down the game.
        let physicsMultiplier = deltaTime / (1000 / 60);

        this.player.update(physicsMultiplier, this.input, this.level);
        
        let dx = this.player.getDX() * physicsMultiplier
        this.level.background.update(this.player.camera, dx);
        this.level.floor.update(this.player.camera, dx);
    }

    render(camera) {

        // Set canvas position
        ctx.save();
        ctx.translate(-camera.getX(),-camera.getY());

        // Clear canvas
        this.renderer.clear(canvas, ctx, camera);

        this.renderer.renderBackground(this.level.background, this.level.colors)

        this.renderer.renderObject(this.player);

        this.renderer.renderLevelObjects(this.level, camera);

        // Render Hitboxes
        if(config.showHitboxes)
            this.renderer.renderHitboxes(this.level, this.player, camera);

        this.renderer.renderFloor(this.level.floor, camera, this.floorHeight, this.level.colors);

        // Render FPS Counter
        if(config.showFPS)
            this.renderer.renderFPS(this.FPSCounter.getFPS(), camera);
        
        ctx.restore();
    }
}