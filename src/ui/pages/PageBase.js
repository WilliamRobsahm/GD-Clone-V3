import Camera from "../../player/Camera.js";
import uiButton from "../elements/uiButton.js";

export default class PageBase {
    constructor(menu, name) {
        this.menu = menu;
        this.name = name;
        this.buttons = {}
        this.camera = new Camera();

        this.hoveredID = null;
    }

    init() {
        console.log("loading page " + this.name);
    }

    addButton(buttonId, parent, params = {}, onClick = () => {}) {
        params.id = buttonId;
        let btn = new uiButton(this, params);
        btn.parent = parent;
        btn.onClick = onClick;
        this.buttons[buttonId] = btn;
    }

    update(d) {
        
    }

    handleInput(input) {
        this.hoveredID = this.findHoveredElement(input);

        if(this.hoveredID !== null) {
            document.body.style.cursor = "pointer";
            if(input.click) {
                this.buttons[this.hoveredID].onClick();
            }
        }
    }

    findHoveredElement(input) {
        for(const b in this.buttons) {
            if(this.buttons[b].isHovering(input, this.camera)) {
                return this.buttons[b].id;
            }
        }
        return null;
    }

    render() {
        
    }
}