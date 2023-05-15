import ColorHelper, { colors } from "./ColorHelper.js";
import { applyProperties } from "./helper.js";

export default class RenderHelper {

    static clipRoundedRectangle(rect, radius, ctx) {
        ctx.beginPath();
        ctx.moveTo(rect.getX() + radius, rect.getY());
        ctx.lineTo(rect.getX2() - radius, rect.getY());
        ctx.quadraticCurveTo(rect.getX2(), rect.getY(), rect.getX2(), rect.getY() + radius);
        ctx.lineTo(rect.getX2(), rect.getY2() - radius);
        ctx.quadraticCurveTo(rect.getX2(), rect.getY2(), rect.getX2() - radius, rect.getY2());
        ctx.lineTo(rect.getX() + radius, rect.getY2());
        ctx.quadraticCurveTo(rect.getX(), rect.getY2(), rect.getX(), rect.getY2() - radius);
        ctx.lineTo(rect.getX(), rect.getY() + radius);
        ctx.quadraticCurveTo(rect.getX(), rect.getY(), rect.getX() + radius, rect.getY());
        ctx.closePath();
        ctx.clip();
    }

    static fillRect(rect, ctx) {
        ctx.fillRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
    }

    /**
     * 
     * @param {object} rect Rect object. Requires getX(), getY(), getWidth() and getHeight() functions
     * @param {number} cornerRadius 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string?} strokeStyle "DEFAULT"/"INNER"/"OUTER" - Leave empty for no stroke
     */
    static fillRoundedRect(rect, cornerRadius, ctx, strokeStyle = false) {
        ctx.save();
        this.clipRoundedRectangle(rect, cornerRadius, ctx);
        
        let lw = ctx.lineWidth;

        switch(strokeStyle) {
            case "DEFAULT":
                ctx.fill();
                ctx.restore();
                ctx.stroke();
                break;

            case "INNER":
                ctx.lineWidth = lw * 2;
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;

            case "OUTER":
                ctx.restore();
                ctx.lineWidth = lw * 2;
                ctx.stroke();
                ctx.fill();
                break;

            default:
                ctx.fill();
                ctx.restore();
                break;
        }
    }

    static setShadowProperties(ctx, opacity, blur, offsetX, offsetY) {
        applyProperties(ctx, {
            shadowColor: `rgba(0,0,0,${opacity ?? 0})`,
            shadowBlur: blur ?? 0,
            shadowOffsetX: offsetX ?? 0,
            shadowOffsetY: offsetY ?? 0
        });
    }

    /**
     * Apply shadow properties, run the rendering function, and then clear shadow properties.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} opacity
     * @param {number} blur
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {function} renderFunction 
     */
    static renderWithShadow(ctx, opacity, blur, offsetX, offsetY, renderFunction) {
        ctx.save();
        applyProperties(ctx, {
            shadowColor: `rgba(0,0,0,${opacity ?? 0})`,
            shadowBlur: blur ?? 0,
            shadowOffsetX: offsetX ?? 0,
            shadowOffsetY: offsetY ?? 0
        });
        renderFunction();
        ctx.restore();
    }

    static getHorizontalGradient(ctx, x, width, colorList) {
        let dist = 1 / (colorList.length - 1);

        const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
        for(let i = 0; i < colorList.length; i++) {
            gradient.addColorStop(0 + i * dist, colorList[i]);
        }

        return gradient;
    }

    static getVerticalGradient(ctx, y, height, colorList) { 
        let dist = 1 / (colorList.length - 1);

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        for(let i = 0; i < colorList.length; i++) {
            gradient.addColorStop(0 + i * dist, colorList[i]);
        }

        return gradient;
    }
}
