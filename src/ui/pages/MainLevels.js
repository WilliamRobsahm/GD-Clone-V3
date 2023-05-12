import PageBase from "./PageBase.js";

export class MainLevels extends PageBase {
    constructor(menu) {
        super(menu, "MAIN_LEVELS");

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