import API from "../../APIClient.js";
import { colors } from "../../helpers/ColorHelper.js";
import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";
import UITextInput from "../elements/uiTextInput.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";


export class CreatedLevelPage extends PageBase {
    constructor(menu) {
        super(menu, "CREATED_LEVEL_PAGE");

        this.backButton = new UIButton(this, this.mainContent, {
            onClick: () => { this.menu.loadPage("CREATED_LEVELS_LIST") },
            classList: ["btnBack"]
        });

        this.levelInfoContainer = new UIElement(this, this.mainContent, {
            centerX: true, centerY: true,
            width: "60%",
            height: "70%",
            childAlign: "COLUMN",
        });

        this.levelTitleInput = new UITextInput(this, this.levelInfoContainer, {
            width: "100%",
            height: "120px",
            cornerRadius: "28px",
            font: "40px Arco",
            placeholder: "Level Name",
            maxInputLength: 32,
            // Save title changes
            onInputChanged: (value) => {
                this.levelInfo.title = value.trim();
                API.saveLevelInfo(this.levelInfo);
            }
        });

        this.levelDescriptionInput = new UITextInput(this, this.levelInfoContainer, {
            width: "100%",
            height: "180px",
            offsetY: "24px",
            cornerRadius: "28px",
            font: "20px Trebuchet MS",
            placeholder: "Description [optional]",
            // Save description changes
            onInputChanged: (value) => {
                this.levelInfo.description = value.trim();
                API.saveLevelInfo(this.levelInfo);
            }
        });

        this.buttonContainer = new UIElement(this, this.levelInfoContainer, {
            width: "100%",
            height: "240px",
            offsetY: "20px",
        });

        this.editLevelButton = new UIButton(this, this.buttonContainer, {
            width: "200px",
            height: "200px",
            cornerRadius: "100px",
            offsetX: "36px",
            centerY: true,
            floatX: "LEFT",
            text: "Edit",
            font: "32px Arco",
        });

        this.playLevelButton = new UIButton(this, this.buttonContainer, {
            width: "200px",
            height: "200px",
            cornerRadius: "100px",
            centerX: true, centerY: true,
            text: "Play",
            font: "32px Arco",
        });

        this.unusedButton = new UIButton(this, this.buttonContainer, {
            width: "200px",
            height: "200px",
            cornerRadius: "100px",
            offsetX: "-36px",
            centerY: true,
            floatX: "RIGHT",
        });

        this.levelInfo = null;
    }

    /**
     * Update text and button actions based on level info
     */
    init() {
        if(!this.levelInfo) return;
        this.levelTitleInput.text = this.levelInfo.title;
        this.levelDescriptionInput.text = this.levelInfo.description;

        this.playLevelButton.onClick = () => {
            this.onPageExit();
            this.menu.game.loadCreatedLevel(this.levelInfo.id);
        }

        this.editLevelButton.onClick = () => {
            this.onPageExit();
            this.menu.game.enterLevelEditor(this.levelInfo.id);
        }
    }

    onPageExit() {
        this.mainContent.defocusAllInputs();
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let darkBg = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 3 };
        this.backButton.backgroundColor = darkBg;
        this.levelTitleInput.backgroundColor = darkBg;
        this.levelDescriptionInput.backgroundColor = darkBg;
        this.editLevelButton.backgroundColor = darkBg;
        this.playLevelButton.backgroundColor = darkBg;
        this.unusedButton.backgroundColor = darkBg;

        this.mainContent.recursiveRender();
    }
}