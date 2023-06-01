import { input } from "../../game/InputHandler.js";
import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { applyProperties } from "../../helpers/helper.js";
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

    onPageExit() {
        
    }

    addButton(buttonId, parent, params = {}, onClick = () => {}) {
        params.id = buttonId;
        let btn = new UIButton(this, parent, params);
        btn.onClick = onClick;
        this.buttons[buttonId] = btn;
    }

    update(d) {
        this.mainContent.recursiveUpdate();
    }

    handleInput() {
        this.hoveredElement = this.findHoveredElement();
        if(this.hoveredElement === null) return;

        document.body.style.cursor = "pointer";
        if(input.click) {
            input.click = false;
            if(this.hoveredElement.onClick) {
                this.hoveredElement.onClick();
            }
        }
    }

    findHoveredElement() {
        return this.mainContent.getHoveredElement(this.camera);
    }

    getMergedProps(props1, props2) {
        applyProperties(props1, props2);
        return props1;
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