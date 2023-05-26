import API from "../../APIClient.js";
import GameRenderer from "../../game/GameRenderer.js";
import { canvas, ctx } from "../../misc/global.js";
import { MainMenuButtonModel } from "../elements/buttonmodels/MainMenuButton.js";
import UIButton from "../elements/uiButton.js";
import UIText from "../elements/uiText.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

const BG_DX = 2;

export class MainMenu extends PageBase {
    constructor(menu) {
        super(menu, "MAIN");
        this.level;

        // Create buttons

        this.iconMenuButton = new UIButton(this, this.mainContent, {
            position: "ABSOLUTE",
            width: "180px",
            height: "180px",
            offsetX: "-300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            scaleOnHover: true,
            model: new MainMenuButtonModel(null),
            onClick: () => {
                this.menu.loadPage("CUSTOMIZE_ICON");
            }
        });

        this.mainLevelsButton = new UIButton(this, this.mainContent, {
            position: "ABSOLUTE",
            width: "240px",
            height: "240px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            scaleOnHover: true,
            model: new MainMenuButtonModel(null),
            onClick: () => {
                this.menu.loadPage("MAIN_LEVELS");
            }
        })

        this.editorButton = new UIButton(this, this.mainContent, {
            position: "ABSOLUTE",
            width: "180px",
            height: "180px",
            offsetX: "300px",
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            centerX: true, centerY: true,
            scaleOnHover: true,
            model: new MainMenuButtonModel(null),
            onClick: () => {
                API.getCreatedLevelsInfo((data) => {
                    this.menu.pageList.CREATED_LEVELS_LIST.levelData = data;
                    this.menu.loadPage("CREATED_LEVELS_LIST");
                });
            }
        });

        this.titleText = new UIText(this, this.mainContent, {
            text: "Zheometry Jash",
            centerY: false,
            textAlignY: "TOP",
            textOffsetY: "40px",
            font: "96px Arco",
            textOutlineSize: 3,
        });
        
        this.subTitleText = new UIText(this, this.mainContent, {
            text: "A somewhat scuffed GD clone. By Salad",
            centerY: false,
            textAlignY: "TOP",
            textOffsetY: "136px",
            font: "32px Arco",
            textOutlineSize: 3,
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