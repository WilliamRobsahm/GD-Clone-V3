import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { ctx, GRID_SIZE } from "../../misc/global.js";
import { applyProperties } from "../../helpers/helper.js";
import ObjectModel from "./ObjectModel.js";
import RenderHelper from "../../helpers/RenderHelper.js";

export class DefaultBlock extends ObjectModel {
    constructor(game) {
        super(game, GRID_SIZE, GRID_SIZE, "default_block");
    }

    renderModel(rect, baseChannel) {

        // Create gradient
        let gradient = RenderHelper.getVerticalGradient(ctx, rect.getY(), rect.getHeight(), ["rgb(0,0,0)", "rgba(0,0,0,0.2)"]);
        
        applyProperties(ctx, {fillStyle: gradient, strokeStyle: baseChannel.getColor(), lineWidth: 3});
        
        // Render block
        ctx.beginPath();
        ctx.rect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}