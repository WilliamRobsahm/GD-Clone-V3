import { applyProperties } from "../../../helpers/helper.js";
import RenderHelper from "../../../helpers/RenderHelper.js";
import { ctx } from "../../../misc/global.js";


const GREEN_THICKNESS = 0.35;
const OUTLINE_SIZE = 5;
const BLUE_OFFSET = 0.08;
const BLUE_SIZE = (1 - GREEN_THICKNESS - (BLUE_OFFSET * 2)) / 2;
const SHADOW_HEIGHT = 0.04;

export class MainMenuButtonModel {
    constructor(icon) {
        this.icon = icon; // "CUBE", "PLAY", "EDITOR"
    }

    render(rect) {
        
        let x = rect.getX();
        let x2 = rect.getX2();
        let y = rect.getY();
        let y2 = rect.getY2();

        let w = rect.getWidth();
        let h = rect.getHeight();

        // GREEN RECTANGLES

        const GREEN_OFFSET = (w - w * GREEN_THICKNESS) / 2;

        ctx.beginPath();
        ctx.rect(x + GREEN_OFFSET, y, w * GREEN_THICKNESS, h);
        ctx.rect(x, y + GREEN_OFFSET, w, h * GREEN_THICKNESS);
        ctx.rect(x + w * BLUE_OFFSET, y + h * BLUE_OFFSET, w * (1 - BLUE_OFFSET * 2), h * (1 - BLUE_OFFSET * 2));
        ctx.closePath();

        applyProperties(ctx, {fillStyle: "black", strokeStyle: "white", lineWidth: OUTLINE_SIZE * 4, lineJoin: "round"});
        RenderHelper.setShadowProperties(ctx, 0.4, 1, 12, 12);
        ctx.stroke();
        RenderHelper.setShadowProperties(ctx);
        applyProperties(ctx, {strokeStyle: "black", lineWidth: OUTLINE_SIZE * 2});
        ctx.fill();
        ctx.stroke();
        

        // Green, top half
        ctx.beginPath();
        ctx.rect(x + GREEN_OFFSET, y, w * GREEN_THICKNESS, h / 2);
        ctx.rect(x, y + GREEN_OFFSET, w, h * GREEN_THICKNESS / 2 - OUTLINE_SIZE / 2 + 1);
        ctx.closePath();

        ctx.fillStyle = RenderHelper.getHorizontalGradient(ctx, x, w, ["#C9FF61", "#69CD14"]);
        ctx.fill();

        // Green, bottom half
        ctx.beginPath();
        ctx.rect(x + GREEN_OFFSET, y + h / 2, w * GREEN_THICKNESS, h / 2);
        ctx.rect(x, y + h / 2 - OUTLINE_SIZE / 2, w, h * GREEN_THICKNESS / 2 + OUTLINE_SIZE / 2);
        ctx.closePath();

        ctx.fillStyle = RenderHelper.getHorizontalGradient(ctx, x, w, ["#95FB3F", "#45A00D"]);
        ctx.fill();

        // Blue
        let offset = w * BLUE_OFFSET;
        let bw = w * BLUE_SIZE - OUTLINE_SIZE;
        let bh = h * BLUE_SIZE - OUTLINE_SIZE;
        let bx = x + offset;
        let by = y + offset;
        let bx2 = x2 - offset - bw;
        let by2 = y2 - offset - bh;

        ctx.beginPath();
        ctx.rect(bx, by, bw, bh);
        ctx.rect(bx, by2, bw, bh);
        ctx.rect(bx2, by, bw, bh);
        ctx.rect(bx2, by2, bw, bh);
        ctx.closePath();
        ctx.fillStyle = RenderHelper.getHorizontalGradient(ctx, x, w, ["#30FBFA", "#0CA9B0"]);
        ctx.fill();

        // Shadows
        ctx.beginPath();

        // Green
        ctx.rect(x, y2 - GREEN_OFFSET - h * SHADOW_HEIGHT, GREEN_OFFSET, h * SHADOW_HEIGHT);
        ctx.rect(x2 - GREEN_OFFSET, y2 - GREEN_OFFSET - h * SHADOW_HEIGHT, GREEN_OFFSET, h * SHADOW_HEIGHT);
        ctx.rect(x + GREEN_OFFSET, y2 - h * SHADOW_HEIGHT, w * GREEN_THICKNESS, h * SHADOW_HEIGHT);

        // Blue
        by += bh - h * SHADOW_HEIGHT;
        by2 += bh - h * SHADOW_HEIGHT;
        ctx.rect(bx, by, bw, h * SHADOW_HEIGHT);
        ctx.rect(bx, by2, bw, h * SHADOW_HEIGHT);
        ctx.rect(bx2, by, bw, h * SHADOW_HEIGHT);
        ctx.rect(bx2, by2, bw, h * SHADOW_HEIGHT);
        ctx.closePath();

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();


    }
}