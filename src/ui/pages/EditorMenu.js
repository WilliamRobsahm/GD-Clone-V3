import { BG_LIGHTNESS, BG_SATURATION } from "../MenuManager.js";
import PageBase from "./PageBase.js";

export class EditorMenu extends PageBase {
    constructor(menu) {
        super(menu, "EDITOR_MENU");



        this.addButton("BACK", this.mainContent, {}, () => {
            this.menu.loadPage("MAIN");
        });
        this.buttons.BACK.applyClass("btnBack");
    }

    update() {
        this.mainContent.recursiveUpdate();
    }

    render() {
        this.renderBackground({ h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS });

        let col = { h: this.menu.backgroundHue, s: BG_SATURATION, l: BG_LIGHTNESS / 4 };
        this.buttons.BACK.backgroundColor = col;
        
        this.mainContent.recursiveRender();
    }
}