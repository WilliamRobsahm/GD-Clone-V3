import UIElement from "./uiElement.js";

export default class uiButton extends UIElement {
    constructor(page, properties) {
        super(page, properties);
        
        this.hoverable = true;
        this.clickable = true;

        this.hovering = false;
        this.clicking = false;

        this.onClick = () => {};
    }

}