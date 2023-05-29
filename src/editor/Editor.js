import { input } from "../game/InputHandler.js";
import { getDifference } from "../helpers/helper.js";
import RenderHelper from "../helpers/RenderHelper.js";
import { ctx, FLOOR_HEIGHT } from "../misc/global.js";
import Camera from "../player/Camera.js";

const GRID_BELOW_FLOOR = 3;
const ZOOM_DELTA = 0.05;

export default class Editor {
    constructor(game) {
        this.game = game;
        this.camera = new Camera();
        this.camera.x = -200;
        this.camera.y = -(this.camera.getHeight() - 220);
        this.camera.minX = -256;
        this.camera.maxY = 256;
        this.camera.minZoom = 0.2;
        this.camera.maxZoom = 3;

        // Level
        this.level = this.game.level;
        this.level.setFloorPosition(0);
        this.levelData;
        this.levelInfo;

        // Controls
        this.clickPos = false;
        this.previousMousePos = { x: input.getMouseX(), y: input.getMouseY() }
        this.dragging = false;
    }

    loadLevel(levelData, levelInfo, builder) {
        this.level.loadLevel(levelData, levelInfo, builder);
        this.level.setFloorPosition(0);
        input.click = false;
    }

    update() {
        this.updateBackgroundPosition();
    }

    updateBackgroundPosition() {
        this.level.background.x = this.camera.getX() * this.camera.zoom;
        this.level.background.y = this.camera.getY() * this.camera.zoom;
    }

    /**
     * Move camera based on difference between camera positions
     * @param {object} mouse1 Previous mouse position
     * @param {object} mouse2 New mouse position
     */
    cameraDrag(mouse1, mouse2) {
        let dx = mouse1.x - mouse2.x;
        let dy = mouse1.y - mouse2.y;
        this.camera.move(dx, dy);
        this.camera.forceLimits();
        this.updateBackgroundPosition();
    }

    handleInput() {
        const mousePos = { x: input.getMouseX(), y: input.getMouseY() }

        // Zoom
        if(input.scroll) {
            this.updateZoom(input.scroll);
            input.scroll = 0;
        }

        // Click
        if(input.click && !this.clickPos) {
            this.clickPos = mousePos;
        }

        // Release
        else if(!input.click && this.clickPos) {
            this.clickPos = false;
            if(this.dragging) {
                this.dragging = false;
            }
            else {
                console.log(this.getMouseGridX(), this.getMouseGridY());
            }
        }

        // Hold
        else if(input.click && this.clickPos) {
            let mouseDiff = {
                x: getDifference(mousePos.x, this.clickPos.x),
                y: getDifference(mousePos.y, this.clickPos.y),
            }
            // Begin drag
            if((mouseDiff.x > 5 || mouseDiff.y > 5) && !this.dragging) {
                this.dragging = true;
                this.cameraDrag(this.clickPos, mousePos);
            }
        }

        // Drag
        if(this.dragging) {
            this.cameraDrag(this.previousMousePos, mousePos);
        }

        this.previousMousePos = mousePos;
    }

    updateZoom(scroll) {
        this.camera.updateZoom(scroll < 0 ? ZOOM_DELTA : -ZOOM_DELTA);
        this.updateBackgroundPosition();
    }

    getMouseGridX() {
        let cx = this.camera.getX();
        let mx = input.getMouseX() / this.camera.zoom;
        return Math.floor((cx + mx) / 64);
    }

    getMouseGridY() {
        let cy = this.camera.getY();
        let my = input.getMouseY() / this.camera.zoom;
        return Math.floor(-(cy + my) / 64);
    }

    render() {
        this.level.background.render(this.level.colors);
        this.renderGrid();
    }

    renderGrid() {
        ctx.scale(this.camera.zoom, this.camera.zoom);
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
            ctx.moveTo(i * 64 + 0.5, y1 + 0.5);
            ctx.lineTo(i * 64 + 0.5, y2 + 0.5);
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
            ctx.moveTo(x1 + 0.5, y + 0.5);
            ctx.lineTo(x2 + 0.5, y + 0.5);
            ctx.stroke();
            ctx.closePath();
        }

        // White Lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, 0 + 0.5);
        ctx.lineTo(x2 + 0.5, 0 + 0.5);
        ctx.stroke();
        ctx.closePath();

        if(y2 > 0) y2 = 0;
        ctx.beginPath();
        ctx.moveTo(0 + 0.5, y1 + 0.5);
        ctx.lineTo(0 + 0.5, y2 + 0.5);
        ctx.stroke();
        ctx.closePath();
    }
}

