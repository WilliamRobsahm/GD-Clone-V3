import { applyProperties } from "../../../helpers/helper.js";
import RenderHelper from "../../../helpers/RenderHelper.js";
import { ctx } from "../../../misc/global.js";

const EDGE_OFFSET = 12;

export class ButtonArrowModel {
    constructor(direction, enabled) {
        this.direction = direction;
        this.enabled = true;
    }

    render(rect) {
        applyProperties(ctx, {
            lineJoin: "round",
            fillStyle: "white",
            strokeStyle: "black",
            lineWidth: 4,
        })
        
        ctx.beginPath();

        if(this.direction === "LEFT") {
            ctx.moveTo(rect.getX2() - EDGE_OFFSET * 2, rect.getY() + EDGE_OFFSET);
            ctx.lineTo(rect.getX() + EDGE_OFFSET, rect.getCenterY());
            ctx.lineTo(rect.getX2() - EDGE_OFFSET * 2, rect.getY2() - EDGE_OFFSET);
        } else {
            ctx.moveTo(rect.getX() + EDGE_OFFSET * 2, rect.getY() + EDGE_OFFSET);
            ctx.lineTo(rect.getX2() - EDGE_OFFSET, rect.getCenterY());
            ctx.lineTo(rect.getX() + EDGE_OFFSET * 2, rect.getY2() - EDGE_OFFSET);
        }
        
        ctx.closePath();
        RenderHelper.setShadowProperties(ctx, 0.3, 2, 0, 15);
        ctx.fill();
        RenderHelper.setShadowProperties(ctx);
        ctx.stroke();
    }
}