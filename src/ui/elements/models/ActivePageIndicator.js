import { ctx } from "../../../misc/global.js";

const DOT_SIZE = 8;
const DOT_SPACING = 40;

/**
 * 
 */
export class ActivePageIndicatorModel {
    constructor(itemCount, anchorPoint = "CENTER") {
        this.itemCount = itemCount ?? 0;
        this.anchorPoint = anchorPoint;
        this.activeItem = 0;
    }

    /**
     * Since the model is one-dimensional and the width is dynamic, only the X and Y positions are relevant.
     */
    render(rect) {
        const FULL_WIDTH = DOT_SPACING * (this.itemCount - 1);
        
        let x;
        switch(this.anchorPoint) {
            case "CENTER":
                x = rect.getCenterX() - (FULL_WIDTH / 2);
                break;
            case "LEFT":
                x = rect.getX();
                break;
            case "RIGHT":
                x = rect.getX2() - FULL_WIDTH;
                break;
        }

        for(let i = 0; i < this.itemCount; i++) {

            ctx.fillStyle = (i === this.activeItem) ? "rgb(200,200,200)" : "rgb(80,80,80)";
            ctx.beginPath();
            ctx.arc(x, rect.getY(), DOT_SIZE / 2, 0, 2 * Math.PI);
            ctx.fill();
            x += DOT_SPACING;
        }
    }
}
