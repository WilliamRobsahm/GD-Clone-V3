import { colors, RGB, RGBA } from "../misc/colors.js";
import { ctx } from "../misc/global.js";

const HITBOX_OPACITY = 0.5;
const HITBOX_LINE_WIDTH = 3;

export default class Hitbox {
    constructor(hitboxType, width, height, rotation, offsetX, offsetY) {
        this.type = hitboxType;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.color;
        switch(this.type) {
            case "PLAYER_OUTER":
            case "HAZARD": this.color = colors.hazardHitbox; break;
            case "PLAYER_INNER":
            case "SOLID": this.color = colors.solidHitbox; break;
            case "SPECIAL": this.color = colors.specialHitbox; break;
            default: this.color = colors.black;
        }
    }

    getX() { return null } // Left X
    getX2() { 
        return this.getX() + this.getWidth();
    } 

    getY() { return null }
    getY2() { 
        return this.getY() + this.getHeight();
    }

    getCenterX() { 
        return this.getX() + (this.getWidth() / 2);
    } 
    getCenterY() { 
        return this.getY() + (this.getHeight() / 2);
    } 

    getWidth() { return this.width }
    getHeight() { return this.height }

    render() {

        ctx.fillStyle = RGBA(this.color, HITBOX_OPACITY);
        ctx.strokeStyle = RGB(this.color);

        ctx.lineWidth = HITBOX_LINE_WIDTH;
        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}