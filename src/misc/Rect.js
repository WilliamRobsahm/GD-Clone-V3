
export default class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getX() { return this.x ?? 0 }
    getX2() { return this.getX() + this.getWidth() }
    getCenterX() { return this.getX() + this.getWidth() / 2 }

    getY() { return this.y ?? 0 }
    getY2() { return this.getY() + this.getHeight() }
    getCenterY() { return this.getY() + this.getHeight() / 2 }

    getWidth() { return this.width ?? 0 }
    getHeight() { return this.height ?? 0 }
}