import RenderHelper from "../../../helpers/RenderHelper.js";
import { applyProperties } from "../../../helpers/helper.js";
import { ctx } from "../../../misc/global.js";

export class ObjectTypeSelectorModel {
    constructor(object, scale) {
        this.object = object;
        this.object.scale = scale;
        this.selected = false;
    }

    render(rect) {
        ctx.fillStyle = this.selected ? "rgb(80,80,80)" : "rgb(120,120,120)";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(255,255,255)";
                
        RenderHelper.fillRoundedRect(rect, 10, ctx, "OUTER");

        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        RenderHelper.fillRoundedRect(rect, 10, ctx, "OUTER");
        
        if(this.object) {
            this.object.setX(rect.getCenterX() - this.object.getWidth() / 2);
            this.object.setY(rect.getCenterY() - this.object.getHeight() / 2);
            this.object.render();
        }
    }
}