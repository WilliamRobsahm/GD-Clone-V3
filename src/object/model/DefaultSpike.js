import { ctx, GRID_SIZE } from "../../misc/global.js";
import { applyProperties } from "../../helpers/helper.js";
import ObjectModel from "./ObjectModel.js";
import RenderHelper from "../../helpers/RenderHelper.js";

export class DefaultSpike extends ObjectModel {
    constructor(game) {
        super(game, GRID_SIZE, GRID_SIZE, "default_spike");
    }

    renderModel(rect, baseChannel, detailChannel, scale) {

        // Create gradient
        let offsetFromTop = rect.getHeight() * 0.35 * scale;
        let gradientHeight = rect.getHeight() - offsetFromTop;
        let gradient = RenderHelper.getVerticalGradient(ctx, rect.getY() + offsetFromTop, gradientHeight, ["rgb(0,0,0)", "rgba(0,0,0,0.2)"]);

        applyProperties(ctx, {fillStyle: gradient, strokeStyle: baseChannel.getColor(), lineWidth: 3});

        // Render spike
        ctx.beginPath();
        ctx.moveTo(rect.getX(), rect.getY2());
        ctx.lineTo(rect.getCenterX(), rect.getY());
        ctx.lineTo(rect.getX2(), rect.getY2());
        ctx.lineTo(rect.getX(), rect.getY2());
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}