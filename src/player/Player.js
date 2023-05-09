import PlayerCamera from "./PlayerCamera.js";
import { CubeGamemode } from "./gamemodes/CubeGamemode.js";
import { GamemodeEnum } from "./gamemodes/PlayerGamemodes.js";
import { ctx } from "../misc/global.js";
import PlayerHitbox from "../collision/PlayerHitbox.js";
import Collision from "../collision/Collision.js";
import Level from "../level/Level.js";
import InputHandler from "../game/InputHandler.js";

const RESPAWN_TIME_MS = 1000;

export default class Player {
    constructor(game) {
        this.game = game;
        this.camera = new PlayerCamera(this)

        this.gamemodeList = [
            new CubeGamemode(this),
        ]
        this.gamemode = null;

        this.isAlive = true;
        this.respawnTimer = 0;

        this.speeds = {
            SLOW: 8.4,
            NORMAL: 10.4,
            FAST: 12.9,
            FASTER: 15.6,
        }

        this.x = 0;
        this.y = 0 - this.game.defaultSize;
        this.dx = 0;
        this.dy = 0;
        this.grounded = false;
        this.gravity = 0;

        this.setGamemode("CUBE");
        this.setSpeed("NORMAL");

        this.size = this.game.defaultSize;
        this.innerSize = this.size / 2;
        this.innerOffset = (this.size - this.innerSize) / 2

        this.outerHitbox = new PlayerHitbox(this, "PLAYER_OUTER", this.size, 0);
        this.innerHitbox = new PlayerHitbox(this, "PLAYER_INNER", this.innerSize, this.innerOffset);
    }

    getX() { return Math.floor(this.x) }
    getY() { return Math.floor(this.y) }

    getDX() { return this.dx }
    getDY() { return this.dy }

    getHeight() { return this.size }
    getWidth() { return this.size }
        

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
            throw new Error(`"${speed}" is an invalid gamemode`);
        }

        this.dx = (this.speeds[speed] * this.game.defaultSize / 60);
    }

    handleInput(input) {
        this.gamemode.handleInput(input);
    }

    /**
     * Main function for updating the player. Routes to different update functions, depending on conditions.
     * @param {number} d Delta / Physics Multiplier. ≈1 on 60 FPS
     * @param {InputHandler} input Input Handler object
     * @param {Level} level Active level
     */
    update(d, input, level) {
        if(this.isAlive) {
            this.updatePhysics(input, d);
            this.updateCollision(level);
        } else {
            this.updateRespawnTimer(d);
            if(this.canRespawn()) {
                console.log("TODO respawn");
            }
        }
    }

    updatePhysics(input, d) {
        if(!this.isAlive) return;

        this.grounded = false;

        if(this.floorCollision(0,null)) {
            this.y = 0 - this.getHeight();
            this.dy = 0;
            this.grounded = true;
        };

        this.gamemode.updateGravity(d);
        this.gamemode.handleInput(input);

        this.x += this.dx * d;
        this.y += this.dy * d;

        this.camera.updateX();
    }

    updateCollision(level) {
        if(!this.isAlive) return;

        const chunks = level.getChunksInCollisionRange(this);

        for(let i = 0; i < chunks.length; i++) {
            const hazardObjects = chunks[i].getHazardObjects();
            for(let j = 0; j < hazardObjects.length; j++) {
                if(Collision.overlapRect(this.outerHitbox, hazardObjects[j].hitbox)) {
                    this.onDeath();
                }
            }
        }
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
        this.x = 0;
        this.y = 0 - this.game.defaultSize;

    }

    floorCollision(lowerFloorY, upperFloorY) {
        if(this.getY() + this.getHeight() + this.dy >= lowerFloorY) {
            return true;
        }

        return false;
    }

    render() {
        if(!this.isAlive) return;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.fill();
        ctx.stroke();
    }
}