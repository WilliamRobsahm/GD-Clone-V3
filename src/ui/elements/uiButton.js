import UIElement from "./uiElement.js";

export default class UIButton extends UIElement {
    constructor(page, parent, props = {}) {
        super(page, parent, props);
        
        this.hoverable = true;
        this.clickable = true;

        this.hovering = false;
        this.clicking = false;

        this.scaleOnHover = props.scaleOnHover ?? false;
        this.hoverScaleMax = 1.1;
        this.hoverScaleDelta = 0.03;

        this.onClick = () => {};

        if(props.onClick && typeof props.onClick == "function") {
            this.onClick = props.onClick;
        }
    }

}