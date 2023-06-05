import RenderHelper from "../../../helpers/RenderHelper.js";
import { applyProperties, rotateCanvas } from "../../../helpers/helper.js";
import { ctx } from "../../../misc/global.js";

export class EditButtonModel {
    constructor(type) {
        this.type = type;
    }

    render(rect) {
        
        applyProperties(ctx, { fillStyle: "rgb(100,190,15)", lineWidth: 5, strokeStyle: "white"});
        RenderHelper.fillRoundedRect(rect, 10, ctx, "OUTER");

        applyProperties(ctx, { lineWidth: 3, strokeStyle: "black"});
        RenderHelper.fillRoundedRect(rect, 10, ctx, "OUTER");

        switch(this.type) {
            case "moveUp":
                this.renderIcon(rect, "doubleArrow", 0); break;
            case "moveRight":
                this.renderIcon(rect, "doubleArrow", 1); break;
            case "moveDown":
                this.renderIcon(rect, "doubleArrow", 2); break;
            case "moveLeft":
                this.renderIcon(rect, "doubleArrow", 3); break;
        }
    }

    renderIcon(rect, iconType, rotation) {
        rotateCanvas(ctx, rect.getCenterX(), rect.getCenterY(), rotation * 90);
        const size = rect.getWidth();

        applyProperties(ctx, { fillStyle: "white", strokeStyle: "black", lineWidth: 5, });

        ctx.beginPath();
        switch(iconType) {
            case "doubleArrow":
                ctx.moveTo(rect.getCenterX(), rect.getCenterY() - size * 0.2);
                ctx.lineTo(rect.getCenterX() - size * 0.2, rect.getCenterY());
                ctx.lineTo(rect.getCenterX() + size * 0.2, rect.getCenterY());
                ctx.closePath();
                ctx.moveTo(rect.getCenterX(), rect.getCenterY());
                ctx.lineTo(rect.getCenterX() - size * 0.2, rect.getCenterY() + size * 0.2);
                ctx.lineTo(rect.getCenterX() + size * 0.2, rect.getCenterY() + size * 0.2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                break;
        }

        
        

        rotateCanvas(ctx, rect.getCenterX(), rect.getCenterY(), -rotation * 90);        
    }
}