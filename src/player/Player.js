import { CubeGamemode } from "./gamemodes/CubeGamemode.js";
import { GamemodeEnum } from "./gamemodes/PlayerGamemodes.js";
import { ctx } from "../misc/global.js";
import PlayerHitbox from "../collision/PlayerHitbox.js";
import Collision from "../collision/Collision.js";
import Level from "../level/Level.js";
import InputHandler from "../game/InputHandler.js";
import config from "../game/config.js";
import { rotateCanvas } from "../helpers/helper.js";
import Camera from "./Camera.js";

const RESPAWN_TIME_MS = 1000;
const PLAYER_SIZE = 64;
const PLAYER_INNER_SIZE = 24;

export default class Player {
    constructor(game) {
        this.game = game;
        this.camera = new Camera();

        this.gamemodeList = [
            new CubeGamemode(this),
        ]
        this.gamemode = null;

        this.isAlive = false;
        this.respawnTimer = 0;

        this.speeds = {
            SLOW: 8.4,
            NORMAL: 10.4,
            FAST: 12.9,
            FASTER: 15.6,
        }

        this.x = 0;
        this.y = 0 - PLAYER_SIZE;
        this.dx = 0;
        this.dy = 0;
        this.grounded = false;
        this.gravityMode = 1;
        this.gravity = 0;

        this.attempts = 0;

        this.rotationDeg = 0;

        this.size = PLAYER_SIZE;
        this.innerSize = PLAYER_INNER_SIZE;
        this.innerOffset = (this.size - this.innerSize) / 2

        this.outerHitbox = new PlayerHitbox(this, "PLAYER_OUTER", this.size, 0);
        this.innerHitbox = new PlayerHitbox(this, "PLAYER_INNER", this.innerSize, this.innerOffset);
    }

    getX() { return Math.floor(this.x) }
    getX2() { return this.getX() + this.getWidth() }

    getY() { return Math.floor(this.y) }
    getY2() { return this.getY() + this.getHeight() }

    getDX() { return this.dx }
    getDY() { return this.dy }

    getCenterX() { return this.getX() + this.getWidth() / 2 }
    getCenterY() { return this.getY() + this.getHeight() / 2 }

    getHeight() { return this.size }
    getWidth() { return this.size }

    getNextPosition() {
        return { 
            x: this.getX() + this.getDX(),
            x2: this.getX2() + this.getDX(),
            y: this.getY() + this.getDY(),
            y2: this.getY2() + this.getDY(),
        }
    }
        

    setGamemode(gamemode) {
        let index = GamemodeEnum[gamemode];
        if(index === undefined) {
            throw new Error(`"${gamemode}" is an invalid gamemode`);
        }

        this.gamemode = this.gamemodeList[index];
        this.gamemode.enter();
    }

    
    setSpeed(speed) {
        let blocksPerSecond = this.speeds[speed];
        if(blocksPerSecond === undefined) {
            throw new Error(`"${speed}" is an invalid speed`);
        }

        this.dx = (this.speeds[speed] * this.game.defaultSize / 60);
    }

    handleInput(input) {

        if(this.isAlive)
            this.gamemode.handleInput(input);

        // Show Hitboxes
        if(input.getSingleKeyPress(config.controls.toggleShowHitboxes)) {
            config.showHitboxes = !config.showHitboxes;
        }
            
        // Show FPS
        if(input.getSingleKeyPress(config.controls.toggleShowFPS)) {
            config.showFPS = !config.showFPS;
        }
    }

    /**
     * Main function for updating the player. Routes to different update functions, depending on conditions.
     * @param {number} d Delta / Physics Multiplier. ≈1 on 60 FPS
     * @param {InputHandler} input Input Handler object
     * @param {Level} level Active level
     */
    update(d, input, level) {
        this.handleInput(input);

        if(this.isAlive) {
            this.updatePhysics(d);
            this.move(d);
            this.updateCollision(level);
            this.camera.alignWithPlayerX(this.getX());
            this.gamemode.updateRotation(d);
        } else {
            this.updateRespawnTimer(d);
            if(this.canRespawn()) {
                this.respawn(level);
            }
        }
    }

    updatePhysics(d) {
        if(!this.isAlive) return;

        this.grounded = false;

        if(this.floorCollision(0,null)) {
            this.y = 0 - this.getHeight();
            this.dy = 0;
            this.grounded = true;
        };

        this.gamemode.updateGravity(d);
    }

    updateCollision(level) {
        if(!this.isAlive) return;

        const chunks = level.getChunksInCollisionRange(this);

        for(let i = 0; i < chunks.length; i++) {

            // Hazard objects
            const hazardObjects = chunks[i].getHazardObjects();
            for(let j = 0; j < hazardObjects.length; j++) {
                if(Collision.overlapRect(this.outerHitbox, hazardObjects[j].hitbox)) {
                    this.onDeath();
                    return;
                }
            }

            // Solid objects
            const solidObjects = chunks[i].getSolidObjects();
            for(let j = 0; j < solidObjects.length; j++) {
                let obj = solidObjects[j];

                // Check if player is standing on object
                if(Collision.objectFloorCollision(this, obj.hitbox)) {
                    this.grounded = true;
                    this.dy = 0;
                    this.y = (this.gravityMode == 1 ? obj.getY() : solidObjects[j].getY2()) - this.getHeight();
                }

                // Collision with inner hitbox
                if(Collision.overlapRect(this.innerHitbox, obj.hitbox)) {
                    this.onDeath();
                    return;
                }
            }
        }
    }

    move(d) {
        this.x += this.dx * d;
        this.y += this.dy * d;
    }

    onDeath() {
        this.isAlive = false;
        this.respawnTimer = 0;
        this.dx = 0;
        this.dy = 0;
    }

    /**
     * Increases the respawn timer by the amount of milliseconds passed since the last frame.
     * @param {number} d Delta / Physics Multiplier
     */
    updateRespawnTimer(d) {
        this.respawnTimer += 1000 / 60 * d;
    }

    canRespawn() {
        return this.respawnTimer > RESPAWN_TIME_MS;
    }

    /**
     * Set the object position and speed to the level's initial values.
     * @param {Level} level The active level
     */
    respawn(level) {
        this.isAlive = true;
        this.x = 0;
        this.y = 0 - this.game.defaultSize;
        this.rotationDeg = 0;
        this.camera.reset();
        this.setGamemode("CUBE");
        level.reset();
        
        this.attempts += 1;
        if(this.attempts === 1) {
            this.camera.minX = this.getX2();
            setTimeout(() => {
                this.setSpeed("NORMAL");
            }, 1000);
        } else {
            this.camera.minX = 0;
            this.setSpeed("NORMAL");
        }
    }

    floorCollision(lowerFloorY, upperFloorY) {
        if(this.getY() + this.getHeight() + this.dy >= lowerFloorY) {
            return true;
        }

        return false;
    }

    rotate(deg) {
        this.rotationDeg += deg;
        this.rotationDeg = this.rotationDeg % 360;
    }

    render() {
        if(!this.isAlive) return;

        rotateCanvas(ctx, this.getCenterX(), this.getCenterY(), this.rotationDeg);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.fill();
        ctx.stroke();
        rotateCanvas(ctx, this.getCenterX(), this.getCenterY(), -this.rotationDeg);
    }

    renderHitbox() {
        this.outerHitbox.render();
        this.innerHitbox.render();
    }
}