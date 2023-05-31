import { applyProperties } from "../../../helpers/helper.js";
import RenderHelper from "../../../helpers/RenderHelper.js";
import { ctx } from "../../../misc/global.js";

const RADIUS = 20;

export class IconTabModel {
    constructor(object) {
        this.object = object;
        this.enabled = false;
    }

    render(rect) {
        applyProperties(ctx, {
            lineJoin: "round",
            fillStyle: "rgb(40,40,40)",
            strokeStyle: "white",
            lineWidth: 2,
        })

        ctx.globalAlpha = this.enabled ? 1 : 0.5;

        ctx.save();
        ctx.beginPath();

        // TOP LEFT
        ctx.moveTo(rect.getX(), rect.getY2());
        ctx.lineTo(rect.getX(), rect.getY() + RADIUS);
        ctx.quadraticCurveTo(rect.getX(), rect.getY(), rect.getX() + RADIUS, rect.getY());
        ctx.lineTo(rect.getX2() - RADIUS, rect.getY());
        ctx.quadraticCurveTo(rect.getX2(), rect.getY(), rect.getX2(), rect.getY() + RADIUS);
        ctx.lineTo(rect.getX2(), rect.getY2());
        
        ctx.stroke();
        ctx.clip();

        ctx.fill();
        ctx.restore();
        ctx.stroke();

        if(this.object) {
            this.object.setX(rect.getCenterX() - this.object.getWidth() / 2);
            this.object.setY(rect.getCenterY() - this.object.getHeight() / 2);
            this.object.render();
        }

        ctx.globalAlpha = 1;
    }
}