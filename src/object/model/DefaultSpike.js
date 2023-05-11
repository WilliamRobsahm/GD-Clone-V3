import { ctx } from "../../misc/global.js";
import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { applyProperties } from "../../helpers/helper.js";
import ObjectModel from "./ObjectModel.js";

export class DefaultSpike extends ObjectModel {
    constructor(game) {
        super(game, 64, 64, "default_spike");
    }

    renderModel(object, channels) {

        // Create gradient
        let gradient = ctx.createLinearGradient(0, object.getY() + 24, 0, object.getY() + 64);
        gradient.addColorStop(0, ColorHelper.HSL(colors.black));
        gradient.addColorStop(1, ColorHelper.HSL(colors.black, 0.2));

        applyProperties(ctx, {fillStyle: gradient, strokeStyle: channels.getColor("obj"), lineWidth: 3});

        // Render spike
        ctx.beginPath();
        ctx.moveTo(object.getX(), object.getY() + 64);
        ctx.lineTo(object.getX() + 32, object.getY());
        ctx.lineTo(object.getX() + 64, object.getY() + 64);
        ctx.lineTo(object.getX(), object.getY() + 64);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}