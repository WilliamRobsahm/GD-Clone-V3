import Hitbox from "./hitbox.js";

export default class Collision {
    constructor() {}
    
    /**
     * Check if two rectangular objects intersect
     * @param {Hitbox} hitbox1 First hitbox (Presumably the player)
     * @param {Hitbox} hitbox2 Second hitbox (Presumably a hazard object, such as a spike)
     * @returns {boolean}
     */
    static overlapRect(hitbox1, hitbox2) {
        try {
            return hitbox1.getX() < hitbox2.getX2() &&
            hitbox1.getX2() > hitbox2.getX() &&
            hitbox1.getY() < hitbox2.getY2() &&
            hitbox1.getY2() > hitbox2.getY();
        } catch {
            return false;
        }
    }

    /**
     * Check if a point intersects with a rectangular object. For example, if a mouse click is on a button.
     * @param {any} point A point on the canvas, such as mouse coordinates. Can be any type but requires getX() and getY() functions
     * @param {any} rect Any object with a position, height and width
     * @returns {boolean}
     */
    static pointOnRect(point, rect) {
        try {
            return point.getX() >= rect.getX() &&
            point.getX() <= rect.getX2() &&
            point.getY() >= rect.getY() &&
            point.getY() <= rect.getY2();
        } catch {
            return false;
        }
    }
}