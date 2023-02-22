
export default class InputHandler {

    constructor(game) {
        this.game = game;

        this.click = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.scroll = 0;
        this.keys = [];

        window.addEventListener("keydown", event => {
            let key = event.key.toUpperCase();
            if(this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
        });

        window.addEventListener("keyup", event => {
            let key = event.key.toUpperCase();
            if(this.keys.includes(key)) {
                this.keys.splice(this.keys.indexOf(key),1);
            }
        });

        document.addEventListener('mousedown', event => {
            event.preventDefault();

            if(event.button == 0) {
                this.click = true;
            }
        });

        document.addEventListener('mouseup', event => {
            this.click = false;
        });

        document.addEventListener('mousemove', event => {
            let rect = canvas.getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;
        });

        document.addEventListener('wheel', event => {
            this.scroll = event.deltaY;
        });
    }

    getJump() {
        if(this.keys.includes(" ") || 
            this.keys.includes("w") || 
            this.keys.includes("W") || 
            this.keys.includes("arrowUp")) {
            return true;
        }
        return this.click;
    }

    getClick() { return this.click }

    getMouseX() { return this.mouseX }

    getMouseY() { return this.mouseY }

    removeKey(key) {
        this.keys.splice(this.keys.indexOf(key),1);
    }
}

// Prevent right click menu from opening
canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }