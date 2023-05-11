import GameRenderer from "../../game/GameRenderer.js";
import { canvas, ctx } from "../../misc/global.js";
import Camera from "../../player/Camera.js";
import PageBase from "./PageBase.js";

const COLOR_CYCLE_SPEED = 0.5; // Hue shift per frame
const BG_SATURATION = 50;
const BG_LIGHTNESS = 50;
const BG_DX = 5;

export class MainMenu extends PageBase {
    constructor() {
        super("MAIN");
        this.backgroundHue = 0;
        this.camera;
        this.level;
    }

    init() {
        this.camera.x = 0;
        this.camera.y = 0;
        this.level.floorY = canvas.height - 200;
        this.level.background.resetPosition();
        this.level.floor.resetPosition();
    }

    handleInput() {
        
    }

    update(d) {
        // Hue shift
        this.backgroundHue += COLOR_CYCLE_SPEED;
        if(this.backgroundHue >= 360) this.backgroundHue = 0;

        this.camera.x += BG_DX;
        this.level.background.update(this.camera.getX(), BG_DX);
        this.level.floor.update(this.camera.getX(), BG_DX);
    }

    render() {
        this.level.colors.getChannel("bg").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS);
        this.level.colors.getChannel("g").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS - 10);

        GameRenderer.renderGameBackground(this.level.background, this.level.colors);
        GameRenderer.renderGameFloor(this.level.floor, this.camera, this.level.colors, ctx)
    }
}