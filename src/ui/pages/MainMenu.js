import GameRenderer from "../../game/GameRenderer.js";
import { colors } from "../../helpers/ColorHelper.js";
import { canvas, ctx } from "../../misc/global.js";
import UIText from "../elements/uiText.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

const BG_DX = 2;

export class MainMenu extends PageBase {
    constructor(menu) {
        super(menu, "MAIN");
        this.level;

        // Create buttons

        this.addButton("TO_ICON_MENU", this.mainContent, {
            width: "200px",
            height: "200px",
            offsetX: "-300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            backgroundColor: colors.black,
        }, () => {
            this.menu.loadPage("CUSTOMIZE_ICON");
        });
        
        this.addButton("TO_MAIN_LEVELS", this.mainContent, {
            width: "300px",
            height: "300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            backgroundColor: colors.black,
        }, () => {
            this.menu.loadPage("MAIN_LEVELS");
        });

        this.addButton("TO_EDITOR", this.mainContent, {
            width: "200px",
            height: "200px",
            offsetX: "300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            backgroundColor: colors.black,
        }, () => {
            this.menu.loadPage("EDITOR_MENU");
        });

        this.titleText = new UIText(this, this.mainContent, {
            text: "Zheometry Jash",
            centerY: false,
            textAlignY: "TOP",
            textOffsetY: "40px",
            font: "96px Arco",
        });
        this.subTitleText = new UIText(this, this.mainContent, {
            text: "A somewhat scuffed GD clone. By Salad",
            centerY: false,
            textAlignY: "TOP",
            textOffsetY: "136px",
            font: "32px Arco",
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
    }

    update(d) {
        this.level.floorY = canvas.height - 200;

        this.camera.x += BG_DX;
        this.level.background.update(this.camera.getX(), BG_DX);
        this.level.floor.update(this.camera.getX(), BG_DX);

        this.mainContent.recursiveUpdate();
    }

    renderBackground() {
        this.level.colors.getChannel("bg").setColor(this.menu.backgroundHue, BG_SATURATION, BG_LIGHTNESS);
        this.level.colors.getChannel("g").setColor(this.menu.backgroundHue, BG_SATURATION, BG_LIGHTNESS - 10);

        GameRenderer.renderGameBackground(this.level.background, this.level.colors);
        GameRenderer.renderGameFloor(this.level.floor, this.camera, this.level.colors, ctx);
    }

    render() {
        this.renderBackground();        

        this.mainContent.recursiveRender();
    }
}