import { clamp } from "./helper.js";

export const colors = {
    white: {h:0, s:0, l:100},
    black: {h:0, s:0, l:0},
    hazardHitbox: {h:0, s:100, l:60},
    specialHitbox: {h:120, s:100, l:60},
    solidHitbox: {h:240, s:100, l:60},
}

export default class ColorHelper {

    // =======================
    //      RGB Functions
    // =======================

    /**
     * Return true if the given object is a valid RGB object.
     * @param {object} rgb Object which we want to check. Should have 'r', 'g', and 'b' attributes
     * @returns {boolean}
     */
    static validRGB(rgb) {
        return (rgb && rgb.hasOwnProperty("r") && rgb.hasOwnProperty("g") && rgb.hasOwnProperty("b"));
    }

    /**
     * Return an RGB string from an RGB object, but with all values multiplied by the 'multiplier' value
     * @param {object} rgb RGB object. Requires 'r', 'g', and 'b' attributes
     * @param {number} multiplier All color values are multiplied by this
     * @param {number} alpha Alpha value (opacity), between 0 and 1
     * @returns {string}
     */
    static RGBM(rgb, multiplier, alpha = 1) {
        if(!this.validRGB(rgb)) { return 'rgb(0,0,0)' }
        let rgbm = {
            r: clamp(rgb.r * multiplier, 0, 255),
            g: clamp(rgb.g * multiplier, 0, 255),
            b: clamp(rgb.b * multiplier, 0, 255)
        }
        this.RGB(rgbm, alpha);
    }

    /**
     * Return an RGB/RGBA string from an RGB object, an optional alpha value, and an optional brightness multiplier.
     * @param {object} rgb RGB object. Requires 'r', 'g', and 'b' attributes
     * @param {number} alpha Optional alpha value, a.k.a. opacity (0-1)
     * @param {number} brightness Optional brightness multiplier. All RGB values are multiplied by this. (0-1) 
     * @returns {string}
     */
    static RGB(rgb, alpha = 1, brightness = 1) {
        if(!this.validRGB(rgb)) return 'rgb(0,0,0)';
        let r = rgb.r, g = rgb.g, b = rgb.b;

        // All the clamping and multiplication is unneccesary when brightness is 1, so we only do it when it's needed
        if(brightness !== 1) {
            r = clamp(r * brightness, 0, 255);
            g = clamp(g * brightness, 0, 255);
            b = clamp(b * brightness, 0, 255);
        }
        
        return this.alpha === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
    }

    // =======================
    //      HSL Functions
    // =======================

    /**
     * Return true if the given object is a valid HSL object.
     * @param {object} hsl Object which we want to check. Should have 'h', 's', and 'l' attributes
     * @returns {boolean}
     */
    static validHSL(hsl) {
        return (hsl && hsl.hasOwnProperty("h") && hsl.hasOwnProperty("s") && hsl.hasOwnProperty("l"));
    }

    /**
     * Return a color string from an HSL object.
     * @param {object} hsl HSL object. Requires 'h', 's', and 'l' attributes
     * @param {number} alpha Alpha value, between 0 and 1
     * @param {number} hueShift Added directly to hue value. (-180 to 180)
     * @param {number} brightness Rendering brightness. Has nothing to do with HSL Lightness.
     * @returns {string}
     */
    static HSL(hsl, alpha = 1, hueShift = 0, brightness = 1) {
        if(!this.validHSL(hsl)) return 'hsl(0,0%,0%)';

        let h = hsl.h + clamp(hueShift, -180, 180);
        let s = hsl.s;
        let l = hsl.l;
        if(h < 0) h += 360;

        if(brightness === 1) {
            if(alpha === 1) return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
            return `hsla(${hsl.h},${hsl.s}%,${hsl.l}%,${alpha})`;
        }

        // If brightness is set, we need to get the color in rgb format instead.
        let rgb = this.HSLtoRGB({ h: h, s: s, l: l });
        return this.RGB(rgb, alpha, brightness);
    }

    // ====================
    //      Converters
    // =====================

    /**
     * Convert an RGB object to an HSL object.
     * Source: https://css-tricks.com/converting-color-spaces-in-javascript/
     * @param {object} rgb 
     * @returns {object}
     */
    static RGBtoHSL(rgb) {
        // Make r, g, and b fractions of 1
        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;
        
        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta == 0)
            h = 0;
        // Red is max
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        
        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
            
        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h: h, s: s, l: l }
    }

    /**
     * Convert an HSL object to an RGB object.
     * Source: https://css-tricks.com/converting-color-spaces-in-javascript/
     * @param {object} hsl HSL object. Requires 'h', 's', and 'l' attributes
     * @returns {object}
     */
    static HSLtoRGB(hsl) {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;
        const rgb = {};
    
        if(hsl.s == 0) {
            rgb.r = l; rgb.g = l; rgb.b = l; // achromatic
        } 
        
        else {
            const hueToRGB = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            rgb.r = hueToRGB(p, q, h + 1/3);
            rgb.g = hueToRGB(p, q, h);
            rgb.b = hueToRGB(p, q, h - 1/3);
        }

        rgb.r = Math.min(Math.floor(rgb.r * 256), 255);
        rgb.g = Math.min(Math.floor(rgb.g * 256), 255);
        rgb.b = Math.min(Math.floor(rgb.b * 256), 255);
        return rgb;
    }
}





