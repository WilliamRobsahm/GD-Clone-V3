import { input } from "../../game/InputHandler.js";
import { ctx } from "../../misc/global.js";
import UIElement from "./uiElement.js";

export default class UITextInput extends UIElement {
    constructor(page, parent, props = {}) {
        super(page, parent, props);

        this.hoverable = true;
        this.clickable = true;

        this.hovering = false;
        this.clicking = false;

        this.isFocused = false;
        this.placeholder = props.placeholder ?? "Placeholder";
        this.text = props.text ?? "";
        this.legalChars = props.legalChars ?? " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        this.maxInputLength = props.maxInputLength ?? 256;

        this.valueOnFocus;

        this.onInputChanged = () => {};
        if(props.onInputChanged) {
            this.onInputChanged = props.onInputChanged;
        }

        this.onClick = () => {
            this.page.mainContent.defocusAllInputs();
            this.valueOnFocus = this.text;
            this.isFocused = true;
        };

        this.onDefocus = () => {
            this.isFocused = false;
            if(this.text !== this.valueOnFocus && this.valueOnFocus !== undefined) {
                this.valueOnFocus = this.text;
                this.onInputChanged(this.text);
            }
        }
    }

    update() {
        super.update();

        if(!this.isFocused) return;

        input.keys.forEach(keypress => {
            if(keypress === "BACKSPACE") {
                input.removeKey("BACKSPACE");
                // Remove last character
                if(!input.keys.includes("CONTROL")) {
                    this.text = this.text.slice(0, -1);
                    return;
                } 
                // Remove last word
                else {
                    let index = this.text.lastIndexOf(" ");
                    if(index === -1) {
                        this.text = "";
                    } else {
                        this.text = this.text.slice(0, this.text.lastIndexOf(" "));
                    }
                }
            }

            if(keypress.length > 1) return;
            // All keys are stored in the input as capital letters. We have to manually make them lowercase if shift isn't pressed.
            if(!input.keys.includes("SHIFT")) {
                keypress = keypress.toLowerCase();
            };

            this.handleInput(keypress);
        });
    }

    handleInput(key) {
        if(this.legalChars.includes(key)) {
            if(this.text.length >= this.maxInputLength) return;
            this.text += (key);
            input.removeKey(key);
        }
    }

    renderText(text) {
        if(text) {
            super.renderText(text);
            return;
        } 

        if(!this.isFocused) {
            ctx.globalAlpha = 0.5;
            super.renderText(this.placeholder);
            ctx.globalAlpha = 1;
        } 
    }

    renderPlaceholderText() {
        if(!this.placeholder) return;
        this.applyTextStyle();
    
        let textX = this.textX();
        let textY = this.textY();

        if(this.textOutlineSize) {
            ctx.strokeText(this.placeholder, textX, textY);
        }

        ctx.fillText(this.placeholder, textX, textY);
    }
}