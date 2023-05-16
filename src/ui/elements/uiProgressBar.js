import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import RenderHelper from "../../helpers/RenderHelper.js";
import { ctx } from "../../misc/global.js";
import UIElement from "./uiElement.js";

export default class UIProgressBar extends UIElement {
    constructor(page, parent, properties) {
        super(page, parent, properties);
        
        this.progressPercentage = properties.progressPercentage ?? 0;
        this.text = properties.text ? this.progressPercentage + "%" : null;
        this.barColor = properties.barColor ?? colors.white;
        this.onClick = () => {};
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
        this.renderText();
    }

}