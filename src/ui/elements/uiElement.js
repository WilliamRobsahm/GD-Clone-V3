import InputHandler from "../../game/InputHandler.js";
import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import { ctx } from "../../misc/global.js";
import Rect from "../../misc/Rect.js";
import Camera from "../../player/Camera.js";
import { PropertyClasses } from "./propertyClasses.js";

export default class UIElement extends Rect {
    constructor(page, props) {
        super();
        this.page = page;

        // General
        this.id = null;
        this.parent = null;
        this.model;

        // Size
        this.width; this.height;
        this.widthPx = 0; this.heightPx = 0;

        // Alignment / Placement
        this.position = "RELATIVE";
        this.selfAlignX = "LEFT";
        this.selfAlignY = "TOP";
        this.centerX = false;
        this.centerY = false;
        this.floatX = "LEFT";
        this.floatY = "TOP";
        this.offsetX = 0;
        this.offsetY = 0;

        // Styling
        this.backgroundColor = colors.black;

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
        applyProp("position");
        applyProp("selfAlignX");
        applyProp("selfAlignY");
        applyProp("backgroundColor");

        this.setCentering(props.centerX, props.centerY);
        this.setOffset(props.offsetX, props.offsetY);
        this.setFloat(props.floatX, props.floatY);
        this.setSize(props.width, props.height);
    }

    applyClass(className) {
        let propClass = PropertyClasses[className];
        if(propClass !== undefined) {
            const properties = PropertyClasses[className];
            console.log(properties);
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

    /**
     * Takes a number with a unit and return its equivalent pixel count.
     * Supported units: "px", "%"
     * @param {string} x Number w/ unit (ex. "100px", "20%")
     */
    sizeToPixels(size, parentSize) {
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

        x += this.offsetX;
        
        this.x = x;
    }

    updateY() {
        let y;

        if(this.centerY) {
            y = this.yFromAlignment(this.parent.getCenterY(), "CENTER");
        } else {
            y = this.parent.getY();
        }

        y += this.offsetY;

        this.y = y;
    }

    render() {
        if(this.model) this.model.render(this);
        ctx.fillStyle = ColorHelper.HSL(this.backgroundColor);
        ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }
}