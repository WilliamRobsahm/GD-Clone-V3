import PlayerCamera from "./PlayerCamera.js";
import { CubeGamemode } from "./gamemodes/CubeGamemode.js";
import { GamemodeEnum } from "./gamemodes/PlayerGamemodes.js";
import { ctx } from "../misc/global.js";
import PlayerHitbox from "../collision/PlayerHitbox.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.camera = new PlayerCamera(this)

        this.gamemodeList = [
            new CubeGamemode(this),
        ]
        this.gamemode = null;

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

    update(input, d) {
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
        
    }

    floorCollision(lowerFloorY, upperFloorY) {
        if(this.getY() + this.getHeight() + this.dy >= lowerFloorY) {
            return true;
        }

        return false;
    }

    render() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.fill();
        ctx.stroke();
    }
}