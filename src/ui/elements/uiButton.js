import UIElement from "./uiElement.js";

export default class uiButton extends UIElement {
    constructor(page, parent, properties) {
        super(page, parent, properties);
        
        this.hoverable = true;
        this.clickable = true;

        this.hovering = false;
        this.clicking = false;

        this.onClick = () => {};
    }

}