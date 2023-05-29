import { InputHandler } from "../../game/InputHandler.js";
import ColorHelper, { colors } from "../../helpers/ColorHelper.js";
import RenderHelper from "../../helpers/RenderHelper.js";
import { ctx } from "../../misc/global.js";
import Rect from "../../misc/Rect.js";
import Camera from "../../player/Camera.js";
import { PropertyClasses } from "./propertyClasses.js";

export default class UIElement extends Rect {
    constructor(page, parent, props = {}) {
        super();
        this.page = page;

        // =================
        //      General
        // =================

        this.id = null;
        this.index;
        this.children = [];

        this.parent = null;
        this.setParent(parent);
        
        this.width; this.height; // ..px, ..%, or STRETCH
        this.widthPx = 0; this.heightPx = 0; // The height/width attributes are converted to a numeric value each frame
        
        // ===============================
        //      Alignment / Placement
        // ===============================

        // Relatively positioned elements place themselves in relation to other child elements. (Next to each other, or in a list)
        // Absolute elements only take float, offset, and centering into account, and won't stretch their parent.
        this.position = "RELATIVE"; // "RELATIVE" or "ABSOLUTE"

        // Determines how the element aligns itself based on its position.
        // EXAMPLE: selfAlignX is "RIGHT", X position is 500, and width is 100. the left side of the element will be at x 400 and the right side at x 500.
        this.selfAlignX = "LEFT"; // "LEFT", "CENTER", or "RIGHT"
        this.selfAlignY = "TOP"; // "TOP", "CENTER", or "BOTTOM" :3

        // Whether or not this element centers itself in the parent.
        // NOTE: This does not properly work with multiple elements! 
        // If you want multiple elements centered, you have to manually assign offsets to them, or put them in a container which is centered.
        this.centerX = false; // true or false
        this.centerY = false; // true or false
        // (See, CSS? It ain't that hard!)

        // Float determines which sides of the parent element this element tries to place itself on.
        this.floatX = "LEFT"; // "LEFT" or "RIGHT". 
        this.floatY = "TOP"; // "TOP" or "BOTTOM".

        // Offset is added flatly to the position after it's calculated. Think CSS margin.
        this.offsetX; // ..px, or ..%
        this.offsetY; // ..px, or ..%

        // Determines which direction the relatively positioned children puts itself in. Think CSS flow-direction.
        this.childAlign = "ROW", // ROW or COLUMN

        // Determines what happens when child elements exceed the size of this element.
        this.overflow = "STRETCH", // STRETCH, HIDDEN, WRAP or SCROLL

        // A hard-coded spacing between relative children.
        this.childSpacing = null; // ..px, or ..%

        // ==============
        //      TEXT
        // ==============

        // The text displayed inside this element.
        this.text = null; // Any string

        this.textAttributes = {};

        // Determines how the text inside this element aligns itself.
        this.textAlignX = "CENTER"; // LEFT, CENTER, or RIGHT.
        this.textAlignY = "CENTER"; // TOP, CENTER, or BOTTOM.

        this.textOffsetX = 0; 
        this.textOffsetY = 0;
        this.textOutlineSize = 0;
        this.textOutlineColor = colors.black; // HSL object

        // =================
        //      Styling
        // =================

        this.model = null; // A separate renderable object, used when the element is more complex than a rectangle and outline.

        // Determines whether or not this object is rendered. 'false' also stops all children from being rendered.
        this.visible = true; // true or false. 

        this.backgroundColor = colors.transparent; // HSL object

        this.outlineColor = colors.black;
        this.outlineWidth = 0;
        this.outlineType = false; // "DEFAULT", "INNER", or "OUTER"

        this.cornerRadius = null;

        // =====================
        //      Interaction
        // =====================

        this.hoverable = false;
        this.clickable = false;
        this.scaleOnHover = false;
        this.onClick = null; // Function

        this.scale = 1;
        this.hoverScaleMax;
        this.hoverScaleDelta;

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
        applyProp("childAlign");
        applyProp("overflow");
        applyProp("childSpacing");
        applyProp("cornerRadius");
        applyProp("visible");

        this.setOutline(props.outlineColor, props.outlineWidth, props.outlineType);
        this.setText(props.text, props.textColor, props.textOutlineSize, props.textOutlineColor)
        this.setCentering(props.centerX, props.centerY);
        this.setOffset(props.offsetX, props.offsetY);
        this.setFloat(props.floatX, props.floatY);
        this.setSize(props.width, props.height);
        this.setFont(props.font);
        this.applyClassList(props.classList);
    }

    applyClassList(classList) {
        if(typeof classList != "object") return;
        classList.forEach(className => {
            this.applyClass(className);
        }) 
    }

    applyClass(className) {
        let propClass = PropertyClasses[className];
        if(propClass !== undefined) {
            const properties = PropertyClasses[className];
            this.applyProperties(properties);
        }
    }

    setOffset(offsetX, offsetY) {
        if(offsetX !== undefined) this.offsetX = offsetX;
        if(offsetY !== undefined) this.offsetY = offsetY;
    }
    setFloat(floatX, floatY) {
        if(floatX !== undefined) this.floatX = floatX;
        if(floatY !== undefined) this.floatY = floatY;
    }

    setCentering(centerX, centerY) {
        if(centerX !== undefined) this.centerX = centerX;
        if(centerY !== undefined) this.centerY = centerY;
    }

    setSize(width, height) {
        this.width = width ?? "";
        this.height = height ?? "";
        this.updateSize();
    }

    setFont(font) {
        if(font) this.textAttributes.font = font;
    }

    setText(text, color, outlineSize, outlineColor) {
        if(text) this.text = text;
        if(color) this.textAttributes.fillStyle = color;
        if(outlineSize) this.textOutlineSize = outlineSize;
        if(outlineColor) this.textAttributes.strokeStyle = outlineColor;
    }

    setOutline(color, width, type) {
        if(color) this.outlineColor = color;
        if(width) {
            this.outlineWidth = width;
            this.outlineType = type ?? "DEFAULT";
        }
    }

    setParent(parent) {
        if(!parent) return;

        // 'Camera' can be a parent, and it does not have a children array.
        if(parent.children) {
            this.index = parent.children.length;
            parent.children.push(this);
        }

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
        if(!y) y = 0;
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
        switch(this.floatY) {
            case "TOP": return this.parent.getY();
            case "BOTTOM": return this.parent.getY2() - this.getHeight();
        }
    }

    textX() {
        ctx.textAlign = this.textAlignX.toLowerCase();
        switch(this.textAlignX) {
            case "LEFT":
                return this.getX() + this.sizeToPixels(this.textOffsetX, this.parent.getWidth()); 
            case "CENTER":
                return this.getCenterX(); 
            case "RIGHT":
                return this.getX2() - this.sizeToPixels(this.textOffsetX, this.parent.getWidth()); 
        }
    }

    textY() {
        switch(this.textAlignY) {
            case "TOP":
                ctx.textBaseline = "top";
                return this.getY() + this.sizeToPixels(this.textOffsetY, this.parent.getHeight()); 
            case "CENTER":
                ctx.textBaseline = "middle";
                return this.getCenterY(); 
            case "BOTTOM":
                ctx.textBaseline = "alphabetic";
                return this.getY2() - this.sizeToPixels(this.textOffsetY, this.parent.getHeight()); 
        }
    }

    /**
     * Measure the text in the component
     * @returns {number} Width of text in pixels
     */
    getTextWidth() {
        ctx.font = this.textAttributes.font;
        return ctx.measureText(this.text).width ?? 0;
    }

    /**
     * Measure the text in the component
     * @returns {number} Height of text in pixels
     */
    getTextHeight() {
        ctx.font = this.textAttributes.font;
        let metrics = ctx.measureText(this.text);
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }

    getHeight() { return this.heightPx }
    getWidth() { return this.widthPx }

    getOffsetX() { return this.sizeToPixels(this.offsetX, this.parent.getWidth()) }
    getOffsetY() { return this.sizeToPixels(this.offsetY, this.parent.getHeight()) }

    /**
     * Return true if element is currently being hovered
     * @param {InputHandler} input Input handler
     * @param {Camera} camera Currently active Camera object
     */
    isHovering(input, camera) {
        if(!this.hoverable || !this.visible) return false;
        let hovering = input.mouseOn(this, camera);

        if(this.scaleOnHover) {
            if(hovering && this.scale < this.hoverScaleMax) {
                this.scale += this.hoverScaleDelta;
            } else if (!hovering && this.scale > 1) {
                this.scale -= this.hoverScaleDelta;
            }
        }
        return hovering;
    }

    /** 
     * If this element, or one of its children is being hovered, return it.
     */
    getHoveredElement(input, camera) {
        let hoveredElement = null;
        this.children.forEach(child => {
            let h = child.getHoveredElement(input, camera);
            if(h !== null) hoveredElement = h;
        });
        if(hoveredElement  === null) {
            if(this.isHovering(input, camera)) {
                hoveredElement = this;
            }
        }

        return hoveredElement;
    }

    updateSize() {
        this.widthPx = this.sizeToPixels(this.width, this.parent?.getWidth() ?? 0);
        this.heightPx = this.sizeToPixels(this.height, this.parent?.getHeight() ?? 0);

        if(this.scaleOnHover) {
            this.widthPx *= this.scale;
            this.heightPx *= this.scale;
        }
    }

    update() {
        this.updateSize();
        this.x = this.getUpdatedX();
        this.y = this.getUpdatedY();
    }

    getUpdatedX() {
        let x = 0;
        let offset = this.sizeToPixels(this.offsetX, this.parent.getWidth());

        if(!this.parent) return 0;

        if(this.centerX) {
            x = this.xFromAlignment(this.parent.getCenterX(), "CENTER");
            return x + offset;
        }

        x = this.xFromParent();

        if(this.position == "ABSOLUTE" || this.parent.childAlign == "COLUMN") {
            return x + offset;
        }

        if(this.position == "RELATIVE" && this.parent.childAlign == "ROW") {
            return x + this.getRelativeX() + offset;
        }

        return x + offset;
    }

    getUpdatedY() {
        let y = 0;
        let offset = this.getOffsetY();
        if(this.floatY == "BOTTOM") offset *= -1;

        if(!this.parent) return 0;

        if(this.centerY) {
            y = this.yFromAlignment(this.parent.getCenterY(), "CENTER");
            return y + offset;
        }

        y = this.yFromParent();

        if(this.position == "ABSOLUTE" || this.parent.childAlign == "ROW") {
            return y + offset;
        }

        if(this.position == "RELATIVE" && this.parent.childAlign == "COLUMN") {
            if(this.floatY == "TOP") {
                return y + this.getRelativeY() + offset;
            } else {
                return y - this.getRelativeY() + offset;
            }
            
        }

        return y + offset;
    }

    // Get all siblings that exist 'before' this element. i.e. all siblings that matter when it comes to getting the relative position.
    getPreviousSiblings() {
        const siblings = [];
        for(let i = 0; i < this.parent.children?.length; i++) {
            if(this.parent.children[i].index === this.index) break;
            siblings.push(this.parent.children[i]);
        }
        return siblings;
    }

    /**
     * Get sum for all previous sibling elements sharing the same float value.
     * @param {string} axis X or Y
     * @param {number} index This element's index. Leave blank to get sum of all elements.
     * @returns {number}
     */
    getRelativePosition(axis, index) {
        axis = axis.toUpperCase();
        if(axis !== "X" && axis !== "Y") return 0;
        if(index) index = this.parent.children.length

        let parentSize = axis == "X" ? this.parent.getWidth() : this.parent.getHeight();
        let spacing = this.sizeToPixels(this.parent.childSpacing, parentSize);
        let position = spacing;

        const siblingList = this.getPreviousSiblings();
        siblingList.forEach(sibling => {
            if(sibling.position != "RELATIVE" || !sibling.visible) return;

            
            if(axis == "X" && sibling.floatX == this.floatX) {
                position += sibling.getWidth() + sibling.getOffsetX() + spacing;
            } else if(axis == "Y" && sibling.floatY == this.floatY) {
                position += sibling.getHeight() + sibling.getOffsetY() + spacing;
            }
        });

        return position;
    }

    getRelativeX() {
        return this.getRelativePosition("X", this.index);
    }

    getRelativeY() {
        return this.getRelativePosition("Y", this.index);
    }

    getCornerRadius() {
        if(!this.cornerRadius) return 0;
        return this.sizeToPixels(this.cornerRadius, this.getWidth());
    }

    applyTextStyle() {
        ctx.fillStyle = ColorHelper.HSL(this.textAttributes.fillStyle ?? colors.white);
        ctx.font = this.textAttributes.font ?? "20px Verdana";
        ctx.strokeStyle = ColorHelper.HSL(this.textAttributes.strokeStyle);
        ctx.lineWidth = this.textOutlineSize * 2;
    }

    render() {
        ctx.fillStyle = ColorHelper.HSL(this.backgroundColor);
        
       
        if(this.outlineColor) {
            ctx.strokeStyle = ColorHelper.HSL(this.outlineColor);
            ctx.lineWidth = this.outlineWidth;
        }

        RenderHelper.fillRoundedRect(this, this.getCornerRadius(), ctx, this.outlineType);

        this.renderText(this.text);

        if(this.model) this.model.render(this);
    }

    renderText(text) {
        if(!text) return;
        this.applyTextStyle();

        let textX = this.textX();
        let textY = this.textY();

        if(this.textOutlineSize) {
            ctx.strokeText(text, textX, textY);
        }

        ctx.fillText(text, textX, textY);
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

    defocusAllInputs() {
        if(this.onDefocus) {
            this.onDefocus();
        }
        this.children.forEach(child => {
            child.defocusAllInputs();
        })
    }
}