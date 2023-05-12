import PageBase from "./PageBase.js";

export class CustomizeIcon extends PageBase {
    constructor(menu) {
        super(menu, "CUSTOMIZE_ICON");

        this.addButton("BACK", this.camera, {}, () => {
            this.menu.loadPage("MAIN");
        });
        this.buttons.BACK.applyClass("btnBack");
    }

    update() {
        this.buttons.BACK.update();
    }

    render() {
        this.buttons.BACK.render();
    }
}