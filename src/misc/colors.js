import { clamp } from "./util.js";

export const colors = {
    white: {r:255, g:255, b:255},
    black: {r:0, g:0, b:0},
    hazardHitbox: {r:255, g:63, b:63},
    solidHitbox: {r:63, g:63, b:255},
    specialHitbox: {r:63, g:255, b:63},
}

function validColorObject(clr) {
    return (clr && clr.hasOwnProperty("r") && clr.hasOwnProperty("g") && clr.hasOwnProperty("b"));
}

/**
 * Return an RGB string from an RGB object
 * @param {object} clr RGB object. Requires 'r', 'g', and 'b' attributes
 * @returns {string}
 */
export function RGB(clr) {
    return validColorObject(clr) ? `rgb(${clr.r},${clr.g},${clr.b})` : 'rgb(0,0,0)';
}

/**
 * Return an RGB string from an RGB object, but with all values multiplied by the 'multiplier' value
 * @param {object} clr RGB object. Requires 'r', 'g', and 'b' attributes
 * @param {number} multiplier All color values are multiplied by this
 * @returns {string}
 */
export function RGBM(clr, multiplier) {
    if(!validColorObject(clr)) { return 'rgb(0,0,0)' }
    let r = clamp(clr.r * multiplier, 0, 255);
    let g = clamp(clr.g * multiplier, 0, 255);
    let b = clamp(clr.b * multiplier, 0, 255);
    return `rgb(${r},${g},${b})`;
}

/**
 * Return an RGA string from an RGB object and an alpha value
 * @param {object} clr RGB object. Requires 'r', 'g', and 'b' attributes
 * @param {number} alpha Alpha value, between 0 and 1
 * @returns {string}
 */
export function RGBA(clr, alpha) {
    return `rgb(${clr.r},${clr.g},${clr.b},${alpha})`;
}