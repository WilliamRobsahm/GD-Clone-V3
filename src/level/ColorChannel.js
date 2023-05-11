import ColorHelper from "../helpers/ColorHelper.js";
import { clamp } from "../helpers/helper.js";

export default class ColorChannel {
    constructor(h, s, l, a, blending) {
        this.reset();
        this.setColor(h, s, l, a, blending);
        // for blending -> ctx.globalCompositeOperation = "lighter"; 
    }

    /**
     * Set channel color values. Leave blank to reset
     * @param {number?} h Hue (0-360)
     * @param {number?} s Saturation (0-100)
     * @param {number?} l Lightness (0-100)
     * @param {number?} a Alpha / Opacity (0-1)
     * @param {boolean} blending Use additive filter when drawing
     */
    setColor(h, s, l, a, blending) {
        if(h !== undefined) this.h = clamp(h, 0, 360);
        if(s !== undefined) this.s = clamp(s, 0, 100);
        if(l !== undefined) this.l = clamp(l, 0, 100);
        if(a !== undefined) this.a = a;
        if(blending !== undefined) this.blending = blending;
    }

    /**
     * Set color values from hsl object.
     * @param {object} hsl 
     */
    setHsl(hsl) {
        if(!ColorHelper.validHSL(hsl)) return;
        this.h = hsl.h;
        this.s = hsl.s;
        this.l = hsl.l;
    }

    reset() {
        this.h = 0;
        this.s = 0;
        this.l = 100;
        this.alpha = 1;
        this.blending = false;
    }

    getColor() {
        let hsl = this.getValues();
        return ColorHelper.HSL(hsl);
    }

    getValues() { return {h: this.h, s: this.s, l: this.l, a: this.alpha, blending: this.blending} }
    getAlpha() { return this.alpha }
    isBlending() { return this.blending }
}