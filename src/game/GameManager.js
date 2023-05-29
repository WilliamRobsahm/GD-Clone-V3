import Level from "../level/Level.js";
import { LevelManager } from "../level/LevelManager.js";
import MenuManager from "../ui/MenuManager.js";
import FPSCounter from "../misc/FPSCounter.js";
import { canvas, ctx } from "../misc/global.js";
import ObjectBuilder from "../object/ObjectBuilder.js";
import Player from "../player/Player.js";
import config from "./config.js";
import GameRenderer from "./GameRenderer.js";
import { input } from "./InputHandler.js";
import { fadeOverlay } from "../ui/FadeOverlay.js";
import API from "../APIClient.js";
import Editor from "../editor/Editor.js";

export class GameManager {
    // Declare game constants
    constructor() {
        this.defaultSize = 64;
        this.gameState = "MENU";
    }

    // Set up other objects. This can't be done in constructor since other stuff has to be done beforehand, such as setting canvas size.
    initialize() {
        this.renderer = new GameRenderer(this);
        this.objectBuilder = new ObjectBuilder(this);
        this.player = new Player(this);
        this.FPSCounter = new FPSCounter(this);

        this.levelManager = new LevelManager(this);
        this.level = new Level(this);

        this.editor = new Editor(this);

        this.menu = new MenuManager(this);
        this.menu.enter();

        this.levelManager.loadMainLevelInfo();
    }

    update(deltaTime) {
        this.FPSCounter.increment();
        if(deltaTime > 200) return;

        // All physics are designed for 60 FPS, but 'physicsMultiplier' determines how much of that will be done each frame.
        // On 60 fps, 'physicsMultiplier' will be around 1 (with slight fluxuation). On higher hz, it will be lower.
        // This also means that performance issues won't slow down the game.
        let physicsMultiplier = deltaTime / (1000 / 60);

        fadeOverlay.update(physicsMultiplier);

        if(this.gameState == "MENU") {
            document.body.style.cursor = "default";
            this.menu.update(physicsMultiplier);
            this.menu.handleInput(input);
        } 
        
        else if(this.gameState == "IN_GAME") {
            document.body.style.cursor = "none";

            this.player.update(physicsMultiplier, input, this.level);
        
            let dx = this.player.getDX() * physicsMultiplier;
            this.level.background.update(this.player.camera.getX(), this.player.camera.getDX());
            this.level.floor.update(this.player.camera.getX(), this.player.camera.getDX());
        }

        else if(this.gameState == "EDITOR") {
            document.body.style.cursor = "default";
            this.editor.update();
            this.editor.handleInput();
        }
    }

    loadMainLevel(levelId) {
        API.getMainLevelContent(levelId, (data, info) => {
            this.enterLevel(data, info);
        });
    }

    loadCustomLevel(levelId) {
        API.getCustomLevelContent(levelId, (data, info) => {
            this.enterLevel(data, info);
        });
    }

    enterLevel(levelData, levelInfo) {
        fadeOverlay.beginFadeOut(() => {
            this.gameState = "IN_GAME";
            this.menu.exit();
            this.level.setFloorPosition(0);
            this.level.loadLevel(levelData, levelInfo, this.objectBuilder);
            this.player.respawn(this.level);
            fadeOverlay.beginFadeIn();
        });
    }

    enterLevelEditor(levelId) {
        API.getCustomLevelContent(levelId, (data, info) => {
            fadeOverlay.beginFadeOut(() => {
                this.gameState = "EDITOR";
                this.menu.exit();
                fadeOverlay.beginFadeIn();
                this.editor.loadLevel(data, info);
            });
        });
    }

    render() {
        
        const camera = this.gameState == "MENU" ? this.menu.getCamera() : 
                       this.gameState == "IN_GAME" ? this.player.camera : 
                       this.gameState == "EDITOR" ? this.editor.camera : null;
                       
        if(!camera) return;

        // Prep canvas
        ctx.save();
        GameRenderer.translate(ctx, camera);
        GameRenderer.clear(ctx, camera);

        // Render menu
        if(this.gameState == "MENU") {
            this.menu.render();
            fadeOverlay.render(camera);
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

            GameRenderer.renderAttemptsText(this.player);
            fadeOverlay.render(camera);
        }

        else if(this.gameState == "EDITOR") {
            this.editor.render();
            fadeOverlay.render(this.editor.UI.camera);
        }

        ctx.restore();
    }
}