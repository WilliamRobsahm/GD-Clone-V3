import RenderHelper from "../helpers/RenderHelper.js";
import { ctx } from "../misc/global.js";


const FADE_DELTA = 0.15;

class FadeOverlay {
    #fading;
    #onFadeFinish;
    #opacity;
    constructor() {
        this.#fading = false;
        this.#onFadeFinish = null;
        this.#opacity = 1;
    }

    update(d) {
        switch(this.#fading) {
            case "IN":
                this.#opacity -= FADE_DELTA / 2 * d;
                if(this.#opacity <= 0) {
                    this.#opacity = 0;
                    this.#fading = false;
                }
                break;

            case "OUT":
                this.#opacity += FADE_DELTA * d;
                if(this.#opacity >= 1) {
                    this.#opacity = 1;
                    this.#fading = false;
                    if(this.#onFadeFinish) {
                        this.#onFadeFinish();
                        this.#onFadeFinish = null;
                    }
                }
                break;
        }
    }

    beginFadeOut(onFinish) {
        this.#fading = "OUT";
        if(onFinish) {
            this.#onFadeFinish = onFinish;
        }
    }
    
    beginFadeIn() {
        this.#fading = "IN";
    }

    render(camera) {
        ctx.fillStyle = `rgba(0,0,0,${this.#opacity})`
        RenderHelper.fillRect(camera, ctx);
    }
}

export const fadeOverlay = new FadeOverlay();