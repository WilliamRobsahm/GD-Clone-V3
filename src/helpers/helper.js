
/**
 * Return a random number between the two points
 * @param {int} min Minimum value
 * @param {int} max Maximum value
 * @returns {int}
 */
export function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Takes a number. Forces the number to be within the given range, then returns it.
 * @param {int} number The number
 * @param {int} min Minimum value
 * @param {int} max Maximum value
 * @returns {int}
 */
export function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

/**
 * Apply all properties of the 'properties' object to the 'target' object
 * @param {object} target 
 * @param {object} properties 
 */
export function applyProperties(target, properties) {
    for(let a in properties) {
        target[a] = properties[a];
    }
}

/**
 * Rotates canvas by an amount of degrees, around a point. Used when rendering stuff at an angle. 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x Coordinate for canvas to rotate around.
 * @param {number} y Coordinate for canvas to rotate around.
 * @param {number} degrees Amount of degrees to rotate canvas
 */
export function rotateCanvas(ctx, x, y, degrees)
{
    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-x, -y);
}

/**
 * Return true if 'index' can be used as an index for the list without causing issues.
 * (i.e. it's a number between 0 and list length)
 * @param {Array} list 
 * @param {number} index 
 * @returns {boolean}
 */
export function isValidListIndex(list, index) {
    return (!isNaN(index) && index >= 0 && index < list.length)
}