import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

export class EditorMenu extends PageBase {
    constructor(menu) {
        super(menu, "EDITOR_MENU");

        this.backButton = new UIButton(this, this.mainContent, {
            onClick: () => { this.menu.loadPage("MAIN") },
            classList: ["btnBack"]
        });

        this.levelList = new UIElement(this, this.mainContent, {
            width: "500px", height: "500px",
            centerX: true,
            centerY: true,
            backgroundColor: { h: 0, s: 70, l: 40 },
            childAlign: "COLUMN",
            childSpacing: 10,
        });

        this.testElement1 = new UIElement(this, this.levelList, {
            width: "80%", height: "100px",
            centerX: true,
            backgroundColor: { h: 240, s: 70, l: 40 },
        });

        this.testElement2 = new UIElement(this, this.levelList, {
            width: "80%", height: "100px",
            centerX: true,
            backgroundColor: { h: 120, s: 70, l: 40 },
        });

        this.testElement3 = new UIElement(this, this.levelList, {
            width: "80%", height: "100px",
            centerX: true,
            backgroundColor: { h: 40, s: 80, l: 50 },
        });
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.backButton.backgroundColor = col;
        
        this.mainContent.recursiveRender();
    }
}