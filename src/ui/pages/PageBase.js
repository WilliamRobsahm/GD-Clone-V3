import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { ctx } from "../../misc/global.js";
import Camera from "../../player/Camera.js";
import UIButton from "../elements/uiButton.js";
import UIElement from "../elements/uiElement.js";

export default class PageBase {
    constructor(menu, name) {
        this.menu = menu;
        this.name = name;
        this.buttons = {}
        this.camera = new Camera();

        this.mainContent = new UIElement(this, this.camera, {
            width: "100%",
            height: "100%",
            //backgroundColor: { h: 0, s: 0, l: 0, a: 0.6}
        })

        this.hoveredID = null;
    }

    init() {

    }

    addButton(buttonId, parent, params = {}, onClick = () => {}) {
        params.id = buttonId;
        let btn = new UIButton(this, parent, params);
        btn.onClick = onClick;
        this.buttons[buttonId] = btn;
    }

    update(d) {
        
    }

    handleInput(input) {
        this.hoveredID = this.findHoveredElement(input);

        if(this.hoveredID !== null) {
            document.body.style.cursor = "pointer";
            if(input.click) {
                input.click = false;
                this.buttons[this.hoveredID].onClick();
            }
        }
    }

    findHoveredElement(input) {
        for(const b in this.buttons) {
            if(this.buttons[b].isHovering(input, this.camera)) {
                return this.buttons[b].id;
            }
        }
        return null;
    }

    renderBackground(hsl) {
        let gradient = ctx.createLinearGradient(0, this.camera.getY(), 0, this.camera.getY2());
        gradient.addColorStop(0, ColorHelper.HSL(hsl, 1, 0, 0.4));
        gradient.addColorStop(1, ColorHelper.HSL(hsl));
        ctx.fillStyle = gradient;
        ctx.fillRect(this.camera.getX(), this.camera.getY(), this.camera.getWidth(), this.camera.getHeight());
    }

    render() {
        
    }
}