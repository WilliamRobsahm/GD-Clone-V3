
/**
 * Return a random number between the two points
 * @param {int}     min     Minimum value
 * @param {int}     max     Maximum value
 * @returns {int}
 */
export function rng(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Takes a number. Forces the number to be within the given range, then returns it.
 * @param {int}     num     The number
 * @param {int}     min     Minimum value
 * @param {int}     max     Maximum value
 * @returns {int}
 */
export function clamp(num,min,max) {
    return Math.min(Math.max(num, min), max);
}


export function setAttributes(object,attributes) {
    for(let a in attributes) {
        object[a] = attributes[a];
    }
}

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