import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import RenderHelper from "../../helpers/RenderHelper.js";
import { ctx } from "../../misc/global.js";
import ParallaxBase from "../ParallaxBase.js";

export default class FloorClassic extends ParallaxBase {
    constructor(width, height) {
        super(width, height);
    }

    renderInit(x, y, hsl) {
        this.mainGradient = RenderHelper.getVerticalGradient(ctx, y, 300, [ColorHelper.HSL(hsl), "#000000"]);
        this.squareGradient = RenderHelper.getVerticalGradient(ctx, y, 300, [ColorHelper.HSL(hsl, 1, 0, 0.8), "#000000"]);
        this.outlineGradient = RenderHelper.getVerticalGradient(ctx, y, 300, [ColorHelper.HSL(hsl, 1, 0, 0.6), "#000000"]);
    }

    renderSegment(x, y, segmentNo) {
        x = this.getSegmentX(x, segmentNo);
        
        // Draw solid ground color
        ctx.fillStyle = this.mainGradient;
        ctx.fillRect(x, y, this.width, this.height);

        // Draw squares
        let squareCount = 3;
        let size = this.width * 0.29;
        let gap = (this.width - (size * squareCount)) / squareCount;

        for(let i = 0; i < squareCount; i++) {
            let outlineOffset = 5;
            let xPos = Math.floor(x + (size + gap) * i);
            let yPos = Math.floor(y + gap / 2);
            ctx.fillStyle = this.outlineGradient;
            ctx.fillRect(xPos, yPos, size + outlineOffset, size + outlineOffset);

            ctx.fillStyle = this.squareGradient;
            ctx.fillRect(xPos, yPos, size, size);
        }
    }
}