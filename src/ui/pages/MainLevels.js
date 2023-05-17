import { colors } from "../../helpers/ColorHelper.js";
import { applyProperties } from "../../helpers/helper.js";
import { ButtonArrowModel } from "../elements/buttonmodels/ButtonArrow.js";
import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";
import UIProgressBar from "../elements/uiProgressBar.js";
import UIText from "../elements/uiText.js";
import { fadeOverlay } from "../FadeOverlay.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";



export class MainLevels extends PageBase {
    constructor(menu, levelManager) {
        super(menu, "MAIN_LEVELS");
        this.levelManager = levelManager;
    }

    init() {
        this.activePage = 0;
        this.mainContent.clearChildren();
        this.buttons = {};
        this.pages = [];

        // ==========================
        //      DEFAULT ELEMENTS
        // ==========================

        this.backButton = new UIButton(this, this.mainContent, {
            onClick: () => { this.menu.loadPage("MAIN") },
            classList: ["btnBack"]
        });

        this.arrowLeft = new UIButton(this, this.mainContent, {
            width: "80px",
            height: "120px",
            centerX: true, centerY: true,
            scaleOnHover: true,
            offsetX: "-520px",
            model: new ButtonArrowModel("LEFT", true),
            onClick: () => { this.switchPages(-1) },
        });

        this.arrowRight = new UIButton(this, this.mainContent, {
            width: "80px",
            height: "120px",
            centerX: true, centerY: true,
            scaleOnHover: true,
            offsetX: "520px",
            model: new ButtonArrowModel("RIGHT", true),
            onClick: () => { this.switchPages(1) },
        });

        // =============================
        //      LEVEL PAGE ELEMENTS
        // =============================

        let progressTextProps = {
            textAlignY: "TOP",
            centerY: false,
            offsetY: "24px",
            font: "24px Arco",
            textOutlineSize: 3,
        }

        let progressBarProps = {
            width: "100%",
            height: "40px",
            offsetY: "8px",
            text: true,
            font: "20px Arco",
            textOutlineSize: 3,
            backgroundColor: colors.black,
        }

        this.levelInfo = this.levelManager.mainLevelInfo;

        this.levelInfo.forEach(lvl => {
            const pageElements = {};

            pageElements.container = new UIButton(this, this.mainContent, {
                offsetY: "20%",
                width: "900px",
                height: "600px",
                centerX: true,
                childAlign: "COLUMN",
                visible: false,
                onClick: () => { this.loadLevel(lvl.id) },
            });

            pageElements.levelBox = new UIElement(this, pageElements.container, {
                width: "100%", height: "240px",
                cornerRadius: "16px",
                text: lvl.title,
                font: "48px Arco",
                textOutlineSize: 3,
            });

            let props = this.getMergedProps({ text: "Normal Mode" }, progressTextProps);
            pageElements.normalModeText = new UIText(this, pageElements.container, props);

            props = this.getMergedProps({ progressPercentage: 10, barColor: { h: 120, s: 80, l: 45 } }, progressBarProps);
            pageElements.normalModeBar = new UIProgressBar(this, pageElements.container, props);

            props = this.getMergedProps({ text: "Practice Mode" }, progressTextProps);
            pageElements.practiceModeText = new UIText(this, pageElements.container, props);

            props = this.getMergedProps({ progressPercentage: 10, barColor: { h: 200, s: 100, l: 50 } }, progressBarProps);
            pageElements.practiceModeBar = new UIProgressBar(this, pageElements.container, props);

            this.pages.push(pageElements);
        });

        // ==========================
        //      COMING SOON PAGE
        // ==========================
        
        const lastPageElements = {
            text: new UIText(this, this.mainContent, {
                text: "More coming soon!",
                visible: false,
                font: "52px Arco",
                textOutlineSize: 3,
            })
        }

        this.pages.push(lastPageElements);
        this.switchPages(0);
    }

    getActivePage() {
        return this.pages[this.activePage];
    }
    
    /**
     * Scroll left or right on the main levels page, and load the new page.
     * @param {number} pageScroll Either 1 (right) or -1 (left) 
     */
    switchPages(pageScroll) {

        // Hide all elements on currently active page
        this.setPageVisibility(false);

        // Go to new page
        this.activePage += pageScroll ?? 0;
        if(this.activePage < 0) this.activePage += this.pages.length;
        if(this.activePage >= this.pages.length) this.activePage -= this.pages.length ?? 1;

        // Load elements on new page
        this.setPageVisibility(true);
    }

    loadLevel(levelId) {
        this.levelManager.loadMainLevelData(levelId, (data, info) => {
            fadeOverlay.beginFadeOut(() => {
                this.menu.game.loadLevel(data, info)
            });
        });
    }

    /**
     * Set visibility on all elements on the currently active page to 'v'
     * @param {boolean} v Element visibility on page
     */
    setPageVisibility(v) {
        let page = this.getActivePage();
        if(this.onLastPage()) page.text.visible = v;
        else page.container.visible = v;
    }

    /**
     * Return true if currently active page is the "coming soon" page
     */
    onLastPage() {
        return (this.activePage == this.pages.length - 1)
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.backButton.backgroundColor = col;
        if(!this.onLastPage()) {
            this.getActivePage().levelBox.backgroundColor = col;
            this.getActivePage().normalModeBar.backgroundColor = col;
            this.getActivePage().practiceModeBar.backgroundColor = col;
        }

        this.mainContent.recursiveRender();
    }
}