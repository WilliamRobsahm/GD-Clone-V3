import UIElement from "../elements/uiElement.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";



export class MainLevels extends PageBase {
    constructor(menu) {
        super(menu, "MAIN_LEVELS");
        

        this.addButton("BACK", this.mainContent, {}, () => {
            this.menu.loadPage("MAIN");
        });
        this.buttons.BACK.applyClass("btnBack");

        this.addButton("")

        this.levelContainer = new UIElement(this, this.mainContent, {
            offsetY: "20%",
            width: "900px", height: "400px",
            centerX: true,
            selfAlignX: "CENTER", selfAlignY: "CENTER",
            cornerRadius: "16px",
        })
    }

    init() {

    }

    update() {
        this.mainContent.update();
        this.buttons.BACK.update();
        this.levelContainer.update();
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.buttons.BACK.backgroundColor = col;
        this.buttons.BACK.render();
        
        this.levelContainer.backgroundColor = col;
        this.levelContainer.render();
    }
}