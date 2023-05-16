import { ctx } from "../../misc/global.js";
import { applyProperties } from "../../helpers/helper.js";
import ObjectModel from "./ObjectModel.js";
import RenderHelper from "../../helpers/RenderHelper.js";

export class DefaultSpike extends ObjectModel {
    constructor(game) {
        super(game, 64, 64, "default_spike");
    }

    renderModel(object, channels) {

        // Create gradient
        let gradient = RenderHelper.getVerticalGradient(ctx, object.getY() + 24, 40, ["rgb(0,0,0)", "rgba(0,0,0,0.2)"]);

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