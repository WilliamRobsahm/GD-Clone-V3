import { input } from "../game/InputHandler.js";
import { getDifference } from "../helpers/helper.js";
import RenderHelper from "../helpers/RenderHelper.js";
import { ctx, GRID_SIZE } from "../misc/global.js";
import { objectBuilder } from "../object/ObjectBuilder.js";
import Camera from "../player/Camera.js";
import EditorUI from "./EditorUI.js";
import { objectTabManager } from "./ObjectTabManager.js";

const GRID_BELOW_FLOOR = 0;
const ZOOM_DELTA = 0.05;
const CAMERA_MARGIN = 256;

export default class Editor {
    constructor(game) {
        this.game = game;
        this.camera = new Camera();
        this.camera.x = -200;
        this.camera.y = -(this.camera.getHeight() - 220);
        this.camera.minX = -CAMERA_MARGIN;
        this.camera.maxY = CAMERA_MARGIN;
        this.camera.minZoom = 0.2;
        this.camera.maxZoom = 3;

        this.mode;

        // Level
        this.level = this.game.level;
        this.level.setFloorPosition(0);
        this.levelData;
        this.levelInfo;

        // Controls
        this.clickPos = false;
        this.previousMousePos = { x: input.getMouseX(), y: input.getMouseY() }
        this.dragging = false;

        // Togglable Modes
        this.swipeMode = false;
        this.rotateMode = false;
        this.freeMoveMode = false;
        this.snapMode = false;

        this.selectedObjectType = null;

        this.setupObjectTabs();

        this.UI = new EditorUI(this);
        this.UI.initialize();
    }

    loadLevel(levelData, levelInfo, builder) {
        this.level.loadLevel(levelData, levelInfo, builder);
        this.level.setFloorPosition(0);
        input.click = false;
    }

    setupObjectTabs() {
        objectTabManager.initialize();
    }

    getObjectTab(tabname) {
        return objectTabManager.getTab(tabname);
    }

    update() {
        this.camera.maxY = CAMERA_MARGIN + (this.UI.lowerContainer.getHeight() / this.camera.zoom);
        this.UI.update();
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
        this.UI.handleInput(input);

        const mousePos = { x: input.getMouseX(), y: input.getMouseY() }

        // Zoom
        if(input.scroll) {
            this.updateZoom(input.scroll > 0 ? -1 : 1);
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
                if(this.mode === "BUILD") {
                    this.placeObject(this.getMouseGridX(), this.getMouseGridY());
                }
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
        let z = ZOOM_DELTA * scroll;
        this.camera.updateZoom(z);
        this.updateBackgroundPosition();
    }

    getActiveObjectTab() {
        return objectTabManager.getActiveTab();
    }

    getMouseGridX() {
        let cx = this.camera.getX();
        let mx = input.getMouseX() / this.camera.zoom;
        return Math.floor((cx + mx) / GRID_SIZE);
    }

    getMouseGridY() {
        let cy = this.camera.getY();
        let my = input.getMouseY() / this.camera.zoom;
        return Math.floor(-(cy + my) / GRID_SIZE);
    }

    placeObject(gridX, gridY) {
        if(this.selectedObjectType === null) return;

        let object = objectBuilder.createObject(this.selectedObjectType, gridX, gridY);
        this.level.addObject(object);
    }

    render() {
        this.level.background.render(this.level.colors);
        this.renderGrid();
        this.renderObjects();
        ctx.restore();
        this.UI.render();
    }

    renderGrid() {
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        let firstVerticalLine = Math.floor(this.camera.getX() / GRID_SIZE);
        let lastVerticalLine = Math.floor(this.camera.getX2() / GRID_SIZE);
        let firstHorizontalLine = Math.floor((-this.camera.getY2() + this.level.floorY) / GRID_SIZE);
        let lastHorizontalLine = Math.floor((-this.camera.getY() + this.level.floorY) / GRID_SIZE);

        let maxY = this.level.floorY + GRID_BELOW_FLOOR * GRID_SIZE
        let y1 = this.camera.getY() + 0.5;
        let y2 = Math.min(this.camera.getY2(), maxY) + 0.5;
        let x1 = Math.max(this.camera.getX(), 0) + 0.5;
        let x2 = this.camera.getX2() + 0.5;
        
        // Render vertical grid lines
        for(let i = Math.max(firstVerticalLine, 0); i <= lastVerticalLine; i++) {
            RenderHelper.renderVerticalLine(ctx, i * GRID_SIZE + 0.5, y1, y2);
        }

        // Render horizontal grid lines
        for(let i = Math.max(firstHorizontalLine, -GRID_BELOW_FLOOR); i <= lastHorizontalLine; i++) {
            RenderHelper.renderHorizontalLine(ctx, x1, x2, this.level.floorY - i * GRID_SIZE + 0.5);
        }

        // Render white Lines
        ctx.strokeStyle = "white";
        RenderHelper.renderHorizontalLine(ctx, x1, x2, 0.5);
        RenderHelper.renderVerticalLine(ctx, 0.5, y1, Math.min(y2, 0.5));
    }

    renderObjects() {
        this.level.renderObjects(this.camera);
    }
}

