import { colors } from "../../helpers/ColorHelper.js";
import { ButtonArrowModel } from "../elements/buttonmodels/ButtonArrow.js";
import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";
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

        this.addButton("BACK", this.mainContent, {}, () => {
            this.menu.loadPage("MAIN");
        });
        this.buttons.BACK.applyClass("btnBack");
        
        this.addButton("LEVEL_CONTAINER", this.mainContent, {
            offsetY: "20%",
            width: "900px",
            height: "600px",
            centerX: true,
        }, () => {});

        this.levelBox = new UIElement(this, this.buttons.LEVEL_CONTAINER, {
            width: "100%", height: "240px",
            centerX: true,
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            cornerRadius: "16px",
        });

        this.addButton("ARROW_LEFT", this.mainContent, {
            width: "80px",
            height: "120px",
            centerX: true, centerY: true,
            scaleOnHover: true,
            offsetX: "-520px",
            model: new ButtonArrowModel("LEFT", true),
        }, () => {
            this.switchPages(-1);
        });

        this.addButton("ARROW_RIGHT", this.mainContent, {
            width: "80px",
            height: "120px",
            centerX: true, centerY: true,
            scaleOnHover: true,
            offsetX: "520px",
            model: new ButtonArrowModel("RIGHT", true),
        }, () => {
            this.switchPages(1);
        });


        // =============================
        //      LEVEL PAGE ELEMENTS
        // =============================

        this.levelInfo = this.levelManager.mainLevelInfo;

        this.levelInfo.forEach(lvl => {
            const pageElements = {};

            pageElements.title = new UIText(this, this.levelBox, {
                text: lvl.title,
                visible: false,
                font: "48px Arco",
                textOutlineSize: 3,
            })

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
        this.setPageVisibility(true);
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
        console.log(this.activePage);

        // Load elements on new page
        this.setPageVisibility(true);
        
        // Set level container onclick
        if(!this.onLastPage()) {
            this.buttons.LEVEL_CONTAINER.onClick = () => {
                let id = this.levelInfo[this.activePage].id;
                this.loadLevel(id);
            }
        }
    }

    loadLevel(levelId) {
        this.levelManager.loadMainLevelData(levelId, (data, info) => {
            fadeOverlay.beginFadeOut(() => {
                this.menu.exit();
                this.menu.game.loadLevel(data, info)
            });
        });
    }

    /**
     * Set visibility on all elements on the currently active page to 'v'
     * @param {boolean} v Element visibility on page
     */
    setPageVisibility(v) {
        for(const elem in this.getActivePage()) {
            this.getActivePage()[elem].visible = v;
        }
    }

    /**
     * Return true if currently active page is the "coming soon" page
     */
    onLastPage() {
        return (this.activePage == this.pages.length - 1)
    }

    update() {
        this.mainContent.recursiveUpdate();
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.buttons.BACK.backgroundColor = col;
        this.levelBox.backgroundColor = col;

        this.buttons.LEVEL_CONTAINER.visible = !this.onLastPage();

        this.mainContent.recursiveRender();
    }
}