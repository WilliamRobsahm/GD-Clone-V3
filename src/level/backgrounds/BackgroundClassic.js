import { RGBM } from "../../misc/colors.js";
import { ctx } from "../../misc/global.js";
import ParallaxBase from "../ParallaxBase.js";

export default class BackgroundClassic extends ParallaxBase {
    constructor(width, height) {
        super(width, height);
    }

    renderInit(x, y, channels) {
        let color = channels.bg.getValues();

        this.mainGradient = ctx.createLinearGradient(0, y, 0, y + this.height);
        this.mainGradient.addColorStop(0, RGBM(color, 0));
        this.mainGradient.addColorStop(1, RGBM(color, 1));

        this.squareGradient = ctx.createLinearGradient(0, y + 100, 0, y + this.height);
        this.squareGradient.addColorStop(0, RGBM(color, 0));
        this.squareGradient.addColorStop(1, RGBM(color, 0.8));

        this.outlineGradient = ctx.createLinearGradient(0, y, 0, y + this.height);
        this.outlineGradient.addColorStop(0, RGBM(color, 0));
        this.outlineGradient.addColorStop(1, RGBM(color, 0.6));
    }

    renderSegment(x, y, segmentNo) {
        x = this.getSegmentX(x, segmentNo);

        // Draw solid background color
        ctx.fillStyle = this.mainGradient;
        ctx.fillRect(x, y, this.width, this.height);

        let squareList = [
            [0.2, 1.0, 19.5], [0.2, 22.0, 5.7], [7.8, 18.9, 8.8], [0.2, 29.7, 16.2], [0.2, 47.9, 16.0], [0.1, 77.0, 22.7], [0, 65.5, 9.6], [12.6, 65.5, 9.6], 
            [19.2, -7.3, 22.0], [19.2, 16.5, 21.8], [18.6, 40.8, 22.7], [24.9, 65.4, 16.3], [24.9, 83.4, 16.3], 
            [43.5, -9.4, 29.7], [43.5, 22.4, 29.7], [43.4, 53.8, 21.9], [43.4, 77.6, 22.0], 
            [76.0, 4.2, 21.9], [75.6, 28.4, 13.9], [91.8, 28.3, 6.2], [91.8, 36.2, 6.2], [67.4, 54.0, 5.9], [67.4, 61.5, 5.9], [75.3, 44.0, 23.0], [67.6, 68.9, 30.8], 
        ]

        // Draw all squares
        squareList.forEach(sq => {
            let outlineOffset = 4;
            let xPos = x + this.width * sq[0] / 100;
            let yPos = y + this.height * sq[1] / 100;
            let size = this.width * sq[2] / 100;

            ctx.fillStyle = this.outlineGradient;
            ctx.fillRect(xPos, yPos, size + outlineOffset, size + outlineOffset);

            ctx.fillStyle = this.squareGradient;
            ctx.fillRect(xPos, yPos, size, size);
        })
    }
}