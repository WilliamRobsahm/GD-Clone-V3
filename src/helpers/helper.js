
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
 * Leave min/max as false to not have a limit.
 * @param {int} number The number
 * @param {int} min Minimum value
 * @param {int} max Maximum value
 * @returns {int}
 */
export function clamp(number, min = false, max = false) {
    if(min !== false && number < min) return min;
    if(max !== false && number > max) return max;
    return number;
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

/**
 * Return true if the passed argument is an object
 * @param {any} arg 
 */
export function isObject(arg) {
    return(typeof arg === 'object' && !Array.isArray(arg) && arg !== null);
}

/**
 * Try to parse a JSON string, and return the result.
 * If parsing fails, return the passed string, or throw an error.
 * @param {string} json JSON string
 * @param {boolean} errorOnFail If true, throw an error if parsing fails.
 * @returns {string}
 */
export function tryToParse(json, errorOnFail = false) {
    // If we try to parse something that isn't a json string, such as an object, it's returned, even if errorOnFail is true.
    if(typeof json !== "string") return json;

    try { 
        return JSON.parse(json);
    }
    catch {
        if(errorOnFail) {
            console.error(`Failed to parse JSON: \n${json}`);
        } else {
            return json;
        }
    }
}

/**
 * Parse a JSON string. If the result is an array or object, parse all its contained values, too. And so on.
 * @param {string} json JSON string
 */
export function recursiveParse(json) {
    let result = tryToParse(json);

    // Parse object values
    if(isObject(result)) {
        for(const i in result) {
            result[i] = recursiveParse(result[i]);
        }
    } 
    
    // Parse array items
    else if(Array.isArray(result)) {
        for(let i = 0; i < result.length; i++) {
            result[i] = recursiveParse(result[i]);
        }
    }

    return result;
}

/**
 * Return the difference between the two numbers.
 * @param {number} n1 First number
 * @param {number} n2 Second number
 */
export function getDifference(n1, n2) {
    return (Math.max(n1, n2) - Math.min(n1, n2));
}