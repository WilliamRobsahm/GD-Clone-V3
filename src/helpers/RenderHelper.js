
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
}
