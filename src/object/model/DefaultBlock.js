import { colors, RGBA } from "../../misc/colors.js";
import { ctx } from "../../misc/global.js";
import { setAttributes } from "../../misc/util.js";
import ObjectModel from "./ObjectModel.js";

export class DefaultBlock extends ObjectModel {
    constructor(game) {
        super(game, 64, 64, "default_block");
    }

    renderModel(object, channels) {

        // Create gradient
        let gradient = ctx.createLinearGradient(0, object.getY(), 0, object.getY() + 64);
        gradient.addColorStop(0, RGBA(colors.black, 1));
        gradient.addColorStop(1, RGBA(colors.black, 0.2));

        setAttributes(ctx, {fillStyle: gradient, strokeStyle: channels.obj.getColor(), lineWidth: 3});
        
        // Render block
        ctx.beginPath();
        ctx.rect(object.getX(), object.getY(), this.width, this.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}