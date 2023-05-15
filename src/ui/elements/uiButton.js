import UIElement from "./uiElement.js";

export default class UIButton extends UIElement {
    constructor(page, parent, properties) {
        super(page, parent, properties);
        
        this.hoverable = true;
        this.clickable = true;

        this.hovering = false;
        this.clicking = false;

        this.scaleOnHover = properties.scaleOnHover ?? false;
        this.hoverScaleMax = 1.1;
        this.hoverScaleDelta = 0.03;

        this.onClick = () => {};
    }

}