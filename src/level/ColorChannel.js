import { RGB, RGBA } from "../misc/colors.js";


export default class ColorChannel {
    constructor(r, g, b, blending, opacity) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.blending = blending;
        this.alpha = opacity !== undefined ? opacity : 1;

        // for blending -> ctx.globalCompositeOperation = "lighter"; 
    }

    getColor() {
        let color = this.getValues();
        if(this.alpha == 1) {
            return RGB(color);
        } else {
            return RGBA(color, this.alpha);
        }
    }

    getValues() { return {r: this.r, g: this.g, b: this.b} }
    getAlpha() { return this.alpha }
    isBlending() { return this.blending }
}