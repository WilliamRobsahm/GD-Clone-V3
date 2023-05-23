import { colors } from "../../helpers/ColorHelper.js";
import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";
import UIText from "../elements/uiText.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

export class CreatedLevels extends PageBase {
    constructor(menu) {
        super(menu, "EDITOR_MENU");

        this.levelData = [];

        this.backButton = new UIButton(this, this.mainContent, {
            onClick: () => { this.menu.loadPage("MAIN") },
            classList: ["btnBack"]
        });

        this.levelsContainer = new UIElement(this, this.mainContent, {
            width: "900px", height: "80%",
            centerX: true,
            centerY: true,
            backgroundColor: { h: 0, s: 70, l: 40 },
            childAlign: "COLUMN",
        });

        this.title = new UIElement(this, this.levelsContainer, {
            width: "100%", height: "10%",
            text: "My Levels",
            font: "40px Arco",
            centerY: false,
        });

        this.levelsList = new UIElement(this, this.levelsContainer, {
            width: "90%", height: "85%",
            backgroundColor: colors.black,
            centerX: true,
            childAlign: "COLUMN",
        });

        this.rows = [];
    }

    init() {
        this.levelsList.clearChildren();

        this.levelData.forEach(data => { 
            let row = {};
            row.main = new UIElement(this, this.levelsList, {
                width: "100%", height: "80px",
            });

            row.title = new UIText(this, row.main, {
                font: "32px Arco",
                text: data.title,
                centerX: false,
                offsetX: "20px",
            });

            row.length = new UIText(this, row.main, {
                font: "20px Arco",
                text: "Length: " + data.getLengthFromDuration(),
                centerX: false,
                offsetX: "40px",
            });

            this.rows.push(row);
        });
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let darkBg = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 3 };
        let darkerBg = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 6 };
        this.backButton.backgroundColor = darkBg;
        this.levelsContainer.backgroundColor = darkBg;
        this.rows.forEach(row => {
            row.main.backgroundColor = darkerBg;
        })
        
        this.mainContent.recursiveRender();
    }
}