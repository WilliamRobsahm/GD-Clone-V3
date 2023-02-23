import { ctx } from "../misc/global.js";


// Used for background and floor
export default class Background {
    constructor(level, multiplier) {
        this.level = level;
        this.multiplier = multiplier;

        this.width = 2000;
        this.height = 1200;
        this.x = -this.width;
        this.y = -this.height;
    }

    update(camera, distance) {
        console.log(distance);
        this.x += distance * this.multiplier;
        if(this.x + this.width < camera.getX()) {
            this.x += this.width;
        }
    }

    render() {
        ctx.fillStyle = "rgb(24,24,24)";

        // Draw background twice
        for(let i = 0; i <= 1; i++) {
            ctx.fillRect((this.width * i) + this.x + 50, this.y + 50, this.width - 100, this.height - 100);
        }
    }
}