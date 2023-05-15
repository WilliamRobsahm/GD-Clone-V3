import InputHandler from "../../game/InputHandler.js";
import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import RenderHelper from "../../helpers/RenderHelper.js";
import { ctx } from "../../misc/global.js";
import Rect from "../../misc/Rect.js";
import Camera from "../../player/Camera.js";
import { PropertyClasses } from "./propertyClasses.js";

export default class UIElement extends Rect {
    constructor(page, parent, props) {
        super();
        this.page = page;

        // General
        this.id = null;

        this.parent = null;
        this.children = [];

        this.setParent(parent);
        
        // Size
        this.width; this.height; // ..px, ..%, or STRETCH
        this.widthPx = 0; this.heightPx = 0;
        
        // Alignment / Placement
        this.position = "RELATIVE"; // RELATIVE or ABSOLUTE
        this.selfAlignX = "LEFT"; // LEFT, CENTER, or RIGHT
        this.selfAlignY = "TOP"; // TOP, CENTER, or BOTTOM :3
        this.centerX = false;
        this.centerY = false;
        this.floatX = "LEFT"; // LEFT or RIGHT
        this.floatY = "TOP"; // TOP or BOTTOM :3
        this.offsetX;
        this.offsetY;

        // Text
        this.text = null;
        this.textAttributes = {};
        this.textAlignX = "CENTER"; // LEFT, CENTER, or RIGHT
        this.textAlignY = "CENTER"; // TOP, CENTER, or BOTTOM :3
        this.textOffsetX = 0; 
        this.textOffsetY = 0;

        // Styling
        this.model = null;
        this.visible = true;
        this.backgroundColor = colors.transparent;
        this.cornerRadius = null;

        // Interaction
        this.hoverable = false;
        this.clickable = false;
        this.onClick = null;

        this.applyProperties(props);
    }

    applyProperties(props) {

        const applyProp = (propName) => {
            if(props[propName] !== undefined) this[propName] = props[propName];
        }
        
        applyProp("id");
        applyProp("model");
        applyProp("position");
        applyProp("selfAlignX");
        applyProp("selfAlignY");
        applyProp("backgroundColor");
        applyProp("textOffsetX");
        applyProp("textOffsetY");
        applyProp("textAlignX");
        applyProp("textAlignY");
        applyProp("cornerRadius");
        applyProp("text");
        applyProp("visible");

        this.setCentering(props.centerX, props.centerY);
        this.setOffset(props.offsetX, props.offsetY);
        this.setFloat(props.floatX, props.floatY);
        this.setSize(props.width, props.height);
        this.setFont(props.font);
    }

    applyClass(className) {
        let propClass = PropertyClasses[className];
        if(propClass !== undefined) {
            const properties = PropertyClasses[className];
            this.applyProperties(properties);
        }
    }

    setOffset(offsetX, offsetY) {
        if(offsetX) this.offsetX = offsetX;
        if(offsetY) this.offsetY = offsetY;
    }
    setFloat(floatX, floatY) {
        if(floatX) this.floatX = floatX;
        if(floatY) this.floatY = floatY;
    }

    setCentering(centerX, centerY) {
        if(centerX) this.centerX = centerX;
        if(centerY) this.centerY = centerY;
    }

    setSize(width, height) {
        this.width = width ?? "";
        this.height = height ?? "";
        this.updateSize();
    }

    setFont(font) {
        if(font) this.textAttributes.font = font;
    }

    setParent(parent) {
        if(!parent) return;

        if(parent.children)
            parent.children.push(this);

        this.parent = parent;
    }

    /**
     * Takes a number with a unit and return its equivalent pixel count.
     * Supported units: "px", "%"
     * @param {string} x Number w/ unit (ex. "100px", "20%")
     */
    sizeToPixels(size, parentSize) {
        if(!size) return 0;
        if(size.includes("px")) {
            return parseInt(size.replace("px", ""));
        } else if(size.includes("%")) {
            let percentage = parseInt(size.replace("%", ""));
            return parentSize * (percentage / 100);
        }
    }

    xFromAlignment(x, alignX = this.selfAlignX) {
        switch(alignX) {
            case "LEFT": return x;
            case "CENTER": return x - this.getWidth() / 2;
            case "RIGHT": return x - this.getWidth();
        }
    }

    yFromAlignment(y, alignY = this.selfAlignY) {
        switch(alignY) {
            case "TOP": return y; 
            case "CENTER": return y - this.getHeight() / 2; 
            case "BOTTOM": return y - this.getHeight();
        }
    }

    xFromParent() {
        switch(this.floatX) {
            case "LEFT": return this.parent.getX();
            case "RIGHT": return this.parent.getX2() - this.getWidth();
        }
    }

    yFromParent() {
        switch(this.floatT) {
            case "LEFT": return this.parent.getY();
            case "RIGHT": return this.parent.getY2() - this.getHeight();
        }
    }

    getHeight() { return this.heightPx }
    getWidth() { return this.widthPx }

    /**
     * Return true if element is currently being hovered
     * @param {InputHandler} input Input handler
     * @param {Camera} camera Currently active Camera object
     */
    isHovering(input, camera) {
        if(!this.hoverable) return false;
        return(input.mouseOn(this, camera));
    }

    updateSize() {
        this.widthPx = this.sizeToPixels(this.width, this.parent?.getWidth() ?? 0);
        this.heightPx = this.sizeToPixels(this.height, this.parent?.getHeight() ?? 0);
    }

    update() {
        this.updateSize();

        this.updateX();
        this.updateY();
    }

    updateX() {
        let x;

        if(this.centerX) {
            x = this.xFromAlignment(this.parent.getCenterX(), "CENTER");
        } else {
            if(this.floatX == "LEFT") x = this.parent.getX();
            else x = this.parent.getX2() - this.getWidth();
        }

        x += this.sizeToPixels(this.offsetX, this.parent.getWidth());
        this.x = x;
    }

    updateY() {
        let y;

        if(this.centerY) {
            y = this.yFromAlignment(this.parent.getCenterY(), "CENTER");
        } else {
            y = this.parent.getY();
        }

        y += this.sizeToPixels(this.offsetY, this.parent.getHeight());

        this.y = y;
    }

    render() {
        ctx.fillStyle = ColorHelper.HSL(this.backgroundColor);

        if(this.cornerRadius) {
            let r = this.sizeToPixels(this.cornerRadius, this.getWidth());
            RenderHelper.fillRoundedRect(this, r, ctx);
        } else {
            RenderHelper.fillRect(this, ctx);
        }

        if(this.text !== null) {
            ctx.fillStyle = ColorHelper.HSL(this.textAttributes.fillStyle ?? colors.white);
            ctx.font = this.textAttributes.font ?? "20px Verdana";
            let textX = 0, textY = 0;
            switch(this.textAlignX) {
                case "LEFT":
                    textX = this.getX() + this.sizeToPixels(this.textOffsetX, this.parent.getWidth()); 
                    ctx.textAlign = "left";
                    break;
                case "CENTER":
                    textX = this.getCenterX(); 
                    ctx.textAlign = "center";
                    break;
                case "RIGHT":
                    textX = this.getX2() - this.sizeToPixels(this.textOffsetX, this.parent.getWidth()); 
                    ctx.textAlign = "right";
                    break;
            }

            switch(this.textAlignY) {
                case "TOP":
                    textY = this.getY() + this.sizeToPixels(this.textOffsetY, this.parent.getHeight()); 
                    ctx.textBaseline = "top";
                    break;
                case "CENTER":
                    textY = this.getCenterY(); 
                    ctx.textBaseline = "middle";
                    break;
                case "BOTTOM":
                    textY = this.getY2() - this.sizeToPixels(this.textOffsetY, this.parent.getHeight()); 
                    ctx.textBaseline = "alphabetic";
                    break;
            }

            ctx.fillText(this.text, textX, textY);
        }

        if(this.model) this.model.render(this);
    }

    // Update this element and all its children
    recursiveUpdate() {
        this.update();
        this.children.forEach(child => {
            child.recursiveUpdate();
        });
    }

    // Render this element and all its (visible) children
    recursiveRender() {
        if(!this.visible) return;
        this.render();
        this.children.forEach(child => {
            child.recursiveRender();
        });
    }

    clearChildren() {
        this.children = [];
    }
}