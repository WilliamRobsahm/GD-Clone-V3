import PlayerCamera from "./PlayerCamera.js";
import { CubeGamemode } from "./gamemodes/CubeGamemode.js";
import { GamemodeEnum } from "./gamemodes/PlayerGamemodes.js";
import { ctx } from "../misc/global.js";


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

        this.size = this.game.defaultSize;

        this.setGamemode("CUBE");
        this.setSpeed("NORMAL");
    }

    getX() { return this.x }
    getY() { return this.y }

    getDX() { return this.dx }
    getDY() { return this.dy }

    getHeight() { return this.size }
    getWidth() { return this.size }
        

    setGamemode(gamemode) {
        let index = GamemodeEnum[gamemode];
        if(index === undefined) {
            console.log(`ERROR: "${gamemode}" is an invalid gamemode`);
            return;
        }

        this.gamemode = this.gamemodeList[index];
        this.gamemode.enter();
    }

    
    setSpeed(speed) {
        let blocksPerSecond = this.speeds[speed];
        if(blocksPerSecond === undefined) {
            console.log(`ERROR: "${speed}" is an invalid speed`);
            return;
        }

        this.dx = (this.speeds[speed] * this.game.defaultSize) / this.game.FPS;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.camera.updateX();
    }

    render() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }
}