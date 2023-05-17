import UIButton from "../elements/uiButton.js";
import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

export class CustomizeIcon extends PageBase {
    constructor(menu) {
        super(menu, "CUSTOMIZE_ICON");

        this.backButton = new UIButton(this, this.mainContent, {
            onClick: () => { this.menu.loadPage("MAIN") },
            classList: ["btnBack"]
        });
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.backButton.backgroundColor = col;
        
        this.mainContent.recursiveRender();
    }
}