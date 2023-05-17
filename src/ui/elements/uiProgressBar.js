import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import RenderHelper from "../../helpers/RenderHelper.js";
import { ctx } from "../../misc/global.js";
import UIElement from "./uiElement.js";

export default class UIProgressBar extends UIElement {
    constructor(page, parent, props = {}) {
        super(page, parent, props);
        
        this.progressPercentage = props.progressPercentage ?? 0;
        this.barColor = props.barColor ?? colors.white;
    }

    // Override
    setText(text, color, outlineSize, outlineColor) {
        super.setText(text, color, outlineSize, outlineColor);
        this.text = text ? this.progressPercentage + "%" : null;
    }

    // Override
    render() {
        ctx.fillStyle = ColorHelper.HSL(this.backgroundColor);

        ctx.save();
        RenderHelper.clipRoundedRectangle(this, this.getHeight() / 2, ctx);
        RenderHelper.fillRect(this, ctx);
        ctx.fillStyle = ColorHelper.HSL(this.barColor);
        ctx.fillRect(this.getX(), this.getY(), this.getWidth() * (this.progressPercentage / 100), this.getHeight());
        ctx.restore();
        ctx.stroke();

        this.renderText(this.text ? this.progressPercentage + "%" : "");
    }

}