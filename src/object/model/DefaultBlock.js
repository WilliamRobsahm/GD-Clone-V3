import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { ctx } from "../../misc/global.js";
import { applyProperties } from "../../helpers/helper.js";
import ObjectModel from "./ObjectModel.js";

export class DefaultBlock extends ObjectModel {
    constructor(game) {
        super(game, 64, 64, "default_block");
    }

    renderModel(object, channels) {

        // Create gradient
        let gradient = ctx.createLinearGradient(0, object.getY(), 0, object.getY() + 64);
        gradient.addColorStop(0, ColorHelper.HSL(colors.black));
        gradient.addColorStop(1, ColorHelper.HSL(colors.black, 0.2));
        applyProperties(ctx, {fillStyle: gradient, strokeStyle: channels.getColor("obj"), lineWidth: 3});
        
        // Render block
        ctx.beginPath();
        ctx.rect(object.getX(), object.getY(), this.width, this.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}