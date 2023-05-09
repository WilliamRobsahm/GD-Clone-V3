import { RGB, RGBA } from "../misc/colors.js";


export default class ColorChannel {
    constructor(r, g, b, blending, opacity) {
        this.setColor(r, g, b, blending, opacity);
        // for blending -> ctx.globalCompositeOperation = "lighter"; 
    }

    /**
     * Set channel color values. Leave blank to reset
     * @param {*} r Red (0-255)
     * @param {*} g Green (0-255)
     * @param {*} b Blue (0-255)
     * @param {boolean} blending Use additive filter when drawing
     * @param {*} opacity Color transparency
     */
    setColor(r, g, b, blending, opacity) {
        this.r = r ?? 255;
        this.g = g ?? 255;
        this.b = b ?? 255;
        this.blending = blending ?? false;
        this.alpha = opacity ?? 1;
    }

    getColor() {
        let color = this.getValues();
        if(this.alpha == 1) {
            return RGB(color);
        } else {
            return RGBA(color, this.alpha);
        }
    }

    getValues() { return {r: this.r, g: this.g, b: this.b, a: this.alpha, blending: this.blending} }
    getAlpha() { return this.alpha }
    isBlending() { return this.blending }
}