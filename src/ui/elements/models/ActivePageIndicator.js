import ScrollableItemList from "../../../misc/ScrollableItemList.js";
import { ctx } from "../../../misc/global.js";

const DOT_SIZE = 8;
const DOT_SPACING = 40;

/**
 * 
 */
export class ActivePageIndicatorModel {
    /**
     * 
     * @param {ScrollableItemList} itemList 
     * @param {string} anchorPoint "LEFT", "CENTER", or "RIGHT"
     */
    constructor(itemList = null, anchorPoint = "CENTER") {
        this.anchorPoint = anchorPoint;
        this.itemList = itemList;
    }

    /**
     * Since the model is one-dimensional and the width is dynamic, only the X and Y positions are relevant.
     */
    render(rect) {
        if(!this.itemList) return;
        const ITEM_COUNT = this.itemList.getCount();
        const ACTIVE_ITEM = this.itemList.activeItem;
        const FULL_WIDTH = DOT_SPACING * (ITEM_COUNT - 1);

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

        for(let i = 0; i < ITEM_COUNT; i++) {
            ctx.fillStyle = (i === ACTIVE_ITEM) ? "rgb(200,200,200)" : "rgb(80,80,80)";
            ctx.beginPath();
            ctx.arc(x, rect.getY(), DOT_SIZE / 2, 0, 2 * Math.PI);
            ctx.fill();
            x += DOT_SPACING;
        }
    }
}
