import PageBase from "./PageBase.js";

const COLOR_CYCLE_SPEED = 2; // Hue shift per frame
const BG_SATURATION = 50;
const BG_LIGHTNESS = 50;

export class MainMenu extends PageBase {
    constructor() {
        super("MAIN");
        this.backgroundHue = 0;
    }

    handleInput() {
        this.backgroundHue += COLOR_CYCLE_SPEED;
        if(this.backgroundHue >= 360) this.backgroundHue = 0;
    }

    render(level) {
        level.colors.getChannel("bg").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS);
        level.colors.getChannel("g").setColor(this.backgroundHue, BG_SATURATION, BG_LIGHTNESS - 10);

        level.background.render();
        level.floor.render();
    }
}