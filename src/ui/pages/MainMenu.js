import GameRenderer from "../../game/GameRenderer.js";
import { canvas, ctx } from "../../misc/global.js";
import PageBase from "./PageBase.js";

const COLOR_CYCLE_SPEED = 0.5; // Hue shift per frame
const BG_SATURATION = 50;
const BG_LIGHTNESS = 50;
const BG_DX = 5;

export class MainMenu extends PageBase {
    constructor(menu) {
        super(menu, "MAIN");
        this.backgroundHue = 0;
        this.level;

        // Create buttons

        this.addButton("TO_ICON_MENU", this.camera, {
            width: "200px",
            height: "200px",
            offsetX: -300,
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true
        }, () => {
            this.menu.loadPage("CUSTOMIZE_ICON");
        });
        
        this.addButton("TO_MAIN_LEVELS", this.camera, {
            width: "300px",
            height: "300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true
        }, () => {
            this.menu.loadPage("MAIN_LEVELS");
        });

        this.addButton("TO_EDITOR", this.camera, {
            width: "200px",
            height: "200px",
            offsetX: 300,
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true
        }, () => {
            this.menu.loadPage("EDITOR_MENU");
        });
    }

    init() {

        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;

        // Reset floor and background
        this.level.floorY = canvas.height - 200;
        this.level.background.resetPosition();
        this.level.floor.resetPosition();

        // Prepare buttons
        
    }

    update(d) {
        // Hue shift
        this.backgroundHue += COLOR_CYCLE_SPEED;
        if(this.backgroundHue >= 360) this.backgroundHue = 0;

        this.camera.x += BG_DX;
        this.level.background.update(this.camera.getX(), BG_DX);
        this.level.floor.update(this.camera.getX(), BG_DX);

        let cx = this.camera.getCenterX();
        let cy = this.camera.getCenterY();

        this.buttons.TO_ICON_MENU.update();
        this.buttons.TO_MAIN_LEVELS.update();
        this.buttons.TO_EDITOR.update();
    }

    render() {
        this.level.colors.getChannel("bg").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS);
        this.level.colors.getChannel("g").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS - 10);

        GameRenderer.renderGameBackground(this.level.background, this.level.colors);
        GameRenderer.renderGameFloor(this.level.floor, this.camera, this.level.colors, ctx);

        this.buttons.TO_ICON_MENU.render();
        this.buttons.TO_MAIN_LEVELS.render();
        this.buttons.TO_EDITOR.render();
    }
}