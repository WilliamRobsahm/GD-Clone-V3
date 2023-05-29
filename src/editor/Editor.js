import { input } from "../game/InputHandler.js";
import RenderHelper from "../helpers/RenderHelper.js";
import { ctx, FLOOR_HEIGHT } from "../misc/global.js";
import Camera from "../player/Camera.js";

const GRID_BELOW_FLOOR = 3;

export default class Editor {
    constructor(game) {
        this.game = game;
        this.camera = new Camera();
        this.camera.x = -200;
        this.camera.y = -(this.camera.getHeight() - 220);

        this.level = this.game.level;
        this.level.setFloorPosition(0);

        this.levelData;
        this.levelInfo;

        this.maxZoom = 3;
        this.minZoom = 0.2;
        this.zoom = 1;
    }

    loadLevel(levelData, levelInfo, builder) {
        this.level.loadLevel(levelData, levelInfo, builder);
        this.level.setFloorPosition(0);
    }

    update() {
        this.level.background.x = this.camera.getX();
        this.level.background.y = this.camera.getY2() - this.level.background.getHeight();
    }

    handleInput() {
        if(input.click) {
            console.log(this.getMouseGridX(), this.getMouseGridY());
        }
    }

    getMouseGridX() {
        return Math.floor((input.getMouseX() + this.camera.getX()) / 64);
    }

    getMouseGridY() {
        let cy = this.camera.getY();
        let my = input.getMouseY();
        
        return Math.floor(-(cy + my) / 64);
    }

    render() {
        this.level.background.render(this.level.colors);
        this.renderGrid();
    }

    renderGrid() {
        ctx.strokeStyle = "black";

        ctx.lineWidth = 1;

        let firstVerticalLine = Math.floor(this.camera.getX() / 64);
        let lastVerticalLine = Math.floor(this.camera.getX2() / 64);

        let y1 = this.camera.getY();
        let y2 = this.camera.getY2();
        let maxY = this.level.floorY + GRID_BELOW_FLOOR * 64
        if(y2 > maxY) y2 = maxY;
        
        // Render vertical grid lines
        for(let i = firstVerticalLine; i <= lastVerticalLine; i++) {
            if(i < 0) continue;
            ctx.beginPath();
            ctx.moveTo(i * 64, y1);
            ctx.lineTo(i * 64, y2);
            ctx.stroke();
            ctx.closePath();
        }
        let firstHorizontalLine = Math.floor((-this.camera.getY2() + this.level.floorY) / 64);
        let lastHorizontalLine = Math.floor((-this.camera.getY() + this.level.floorY) / 64);

        let x1 = this.camera.getX();
        let x2 = this.camera.getX2();
        if(x1 < 0) x1 = 0;

        // Render horizontal grid lines
        for(let i = firstHorizontalLine; i <= lastHorizontalLine; i++) {
            if(i < -GRID_BELOW_FLOOR) continue;
            ctx.beginPath();
            let y = this.level.floorY - i * 64;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            ctx.closePath();
        }

        // White Lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x2, 0);
        ctx.stroke();
        ctx.closePath();

        if(y2 > 0) y2 = 0;
        ctx.beginPath();
        ctx.moveTo(0, y1);
        ctx.lineTo(0, y2);
        ctx.stroke();
        ctx.closePath();
    }
}

