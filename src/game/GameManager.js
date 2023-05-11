import Level from "../level/Level.js";
import { LevelManager } from "../level/LevelManager.js";
import MenuManager from "../menu/MenuManager.js";
import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx, FLOOR_HEIGHT } from "../misc/global.js";
import ObjectBuilder from "../object/ObjectBuilder.js";
import Player from "../player/Player.js";
import config from "./config.js";
import GameRenderer from "./GameRenderer.js";
import InputHandler from "./InputHandler.js";

export class GameManager {
    // Declare game constants
    constructor() {
        this.defaultSize = 64;
        this.gameState = "MENU";
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

        this.menu = new MenuManager(this);
        this.menu.enter();

        this.levelManager.getMainLevels((mainLevels) => {
            this.levelManager.mainLevelInfo = mainLevels;

            /*
            this.levelManager.loadMainLevelData(0, (leveldata, levelinfo) => {
                this.level.loadLevel(leveldata, levelinfo, this.objectBuilder);
                this.player.respawn(this.level);
            });
            */
        });
    }

    update(deltaTime) {
        this.FPSCounter.increment();
        if(deltaTime > 200) return;

        // All physics are designed for 60 FPS, but 'physicsMultiplier' determines how much of that will be done each frame.
        // On 60 fps, 'physicsMultiplier' will be around 1 (with slight fluxuation). On higher hz, it will be lower.
        // This also means that performance issues won't slow down the game.
        let physicsMultiplier = deltaTime / (1000 / 60);

        if(this.gameState == "MENU") {
            this.menu.update(this.level, physicsMultiplier);
            this.menu.handleInput(this.input);
        } 
        
        else if(this.gameState == "IN_GAME") {
            this.player.update(physicsMultiplier, this.input, this.level);
        
            let dx = this.player.getDX() * physicsMultiplier
            this.level.background.update(this.player.camera.getX(), dx);
            this.level.floor.update(this.player.camera.getX(), dx);
        }
    }

    render() {
        
        const camera = this.gameState == "MENU" ? this.menu.camera : 
                       this.gameState == "IN_GAME" ? this.player.camera : null;

        // Set canvas position
        ctx.save();
        ctx.translate(-camera.getX(),-camera.getY());

        // Clear canvas
        GameRenderer.clear(canvas, ctx, camera);

        // Render menu
        if(this.gameState == "MENU") {
            this.menu.render();
        } 
        
        // Render game
        else if(this.gameState == "IN_GAME") {
            

            GameRenderer.renderGameBackground(this.level.background, this.level.colors)
            GameRenderer.renderObject(this.player);
            GameRenderer.renderLevelObjects(this.level, camera);

            // Render Hitboxes
            if(config.showHitboxes)
                GameRenderer.renderHitboxes(this.level, this.player, camera);

            GameRenderer.renderGameFloor(this.level.floor, camera, this.level.colors, ctx);

            // Render FPS Counter
            if(config.showFPS)
                GameRenderer.renderFPS(this.FPSCounter.getFPS(), camera, ctx);
        }

        ctx.restore();
    }
}