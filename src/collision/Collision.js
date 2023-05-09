import Player from "../player/Player.js";
import Hitbox from "./hitbox.js";

const OBJECT_GROUNDING_MARGIN = 0.2;

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

    /**
     * Check if a player is "standing" on a solid object
     * @param {Player} player 
     * @param {Hitbox} objectHitbox 
     * @returns {boolean}
     */
    static objectFloorCollision(player, objectHitbox) {

        // Is player in the correct X position to even be *able* to interact with the object?
        const overlapX = (player.getX() <= objectHitbox.getX2() &&
            player.getX2() >= objectHitbox.getX());

        if(!overlapX) return false;

        let margin = objectHitbox.getHeight() * OBJECT_GROUNDING_MARGIN;

        // Normal gravity
        if(player.gravityMode == 1) {
            if(player.getDY() < 0) return false; 

            // If player is falling and overlapping with the top quarter of the object (within margin),
            // The player collides with the floor.
            if(player.getY2() >= objectHitbox.getY() && 
                player.getY2() <= objectHitbox.getY() + margin + player.getDY()) {
                    return true;
            }
        }

        // Reverse gravity
        else if(player.gravityMode == -1) {
            if(player.getDY() > 0) return false;

            // If player is falling up and overlapping with the bottom quarter of the object (within margin),
            // The player collides with the floor.
            if(player.getY() <= objectHitbox.getY2() && 
                player.getY() >= objectHitbox.getY2() - margin + player.getDY()) {
                    return true;
            }
        }
    }
}