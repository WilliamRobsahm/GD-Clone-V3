import { RGBM } from "../../misc/colors.js";
import { ctx } from "../../misc/global.js";

export default class FloorClassic {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    getWidth() { return this.width }
    getHeight() { return this.height }

    renderInit(x, y, channels) {
        let color = channels.g.getValues();

        this.mainGradient = ctx.createLinearGradient(0, y, 0, y + 300);
        this.mainGradient.addColorStop(0, RGBM(color, 1));
        this.mainGradient.addColorStop(1, RGBM(color, 0));

        this.squareGradient = ctx.createLinearGradient(0, y, 0, y + 300);
        this.squareGradient.addColorStop(0, RGBM(color, 0.8));
        this.squareGradient.addColorStop(1, RGBM(color, 0));

        this.outlineGradient = ctx.createLinearGradient(0, y, 0, y + 300);
        this.outlineGradient.addColorStop(0, RGBM(color, 0.6));
        this.outlineGradient.addColorStop(1, RGBM(color, 0));
    }

    render(x, y) {
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