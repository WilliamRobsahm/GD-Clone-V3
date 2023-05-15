import UIElement from "./uiElement.js";

export default class uiText extends UIElement {
    constructor(page, parent, props) {
        super(page, parent, props);
        this.centerX = props.centerX ?? true;
        this.centerY = props.centerY ?? true;
        this.selfAlignX = props.selfAlignX ?? "CENTER";
        this.selfAlignY = props.selfAlignY ?? "CENTER";
        this.textAlignX = props.textAlignX ?? "CENTER";
        this.textAlignY = props.textAlignY ?? "CENTER";
    }
}