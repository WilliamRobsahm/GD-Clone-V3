import API from "../../APIClient.js";
import { colors } from "../../helpers/ColorHelper.js";
import { applyProperties, navigateThroughItems } from "../../helpers/helper.js";
import ScrollableItemList from "../../misc/ScrollableItemList.js";
import { ActivePageIndicatorModel } from "../elements/models/ActivePageIndicator.js";
import { ButtonArrowModel } from "../elements/models/ButtonArrow.js";
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
        this.mainContent.clearChildren();
        this.buttons = {};
        this.pages = new ScrollableItemList();

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

            this.pages.addItem(pageElements);
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

        this.pages.addItem(lastPageElements);

        // Page indicator (That line of dots where one is white)
        this.pageIndicator = new UIElement(this, this.mainContent, {
            position: "ABSOLUTE",
            centerX: true, centerY: true,
            offsetY: "300px",
            model: new ActivePageIndicatorModel(this.pages),
        });

        this.switchPages(0);
    }

    getPage(index) {
        return this.pages.getItem(index);
    }

    getActivePage() {
        return this.pages.getActiveItem();
    }
    
    /**
     * Scroll left or right on the main levels page, and load the new page.
     * @param {number} pageScroll Either 1 (right) or -1 (left) 
     */
    switchPages(pageScroll) {
        let indexes = this.pages.shift(pageScroll);
        this.setPageVisibility(indexes.previous, false);
        this.setPageVisibility(indexes.new, true);
    }

    loadLevel(levelId) {
        this.menu.game.loadMainLevel(levelId);
    }

    /**
     * Set visibility on all elements on the page to true/false
     * @param {number} pageIndex Index of page
     * @param {boolean} visibility Element visibility (true/false)
     */
    setPageVisibility(pageIndex, visibility) {
        let page = this.getPage(pageIndex);
        if(this.isLastPage(pageIndex)) page.text.visible = visibility;
        else page.container.visible = visibility;
    }

    /**
     * Return true if currently active page is the "coming soon" page
     */
    isLastPage(pageIndex) {
        return (pageIndex == this.pages.getCount() - 1)
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.backButton.backgroundColor = col;
        if(!this.isLastPage(this.pages.activeItem)) {
            this.getActivePage().levelBox.backgroundColor = col;
            this.getActivePage().normalModeBar.backgroundColor = col;
            this.getActivePage().practiceModeBar.backgroundColor = col;
        }

        this.mainContent.recursiveRender();
    }
}