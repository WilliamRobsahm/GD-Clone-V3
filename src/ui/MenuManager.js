import { fadeOverlay } from './FadeOverlay.js';
import * as pages from './Pages.js';

export const COLOR_CYCLE_SPEED = 0.5; // Hue shift per frame
export const BG_SATURATION = 50;
export const BG_LIGHTNESS = 50;

export default class MenuManager {
    constructor(game) {
        this.game = game;
        this.backgroundHue = 0;

        this.isActive = false;
        this.pageList = {
            MAIN: new pages.MainMenu(this),
            MAIN_LEVELS: new pages.MainLevels(this, this.game.levelManager),
            CUSTOMIZE_ICON: new pages.CustomizeIcon(this),
            CUSTOM_LEVELS_LIST: new pages.CustomLevelsList(this),
            CUSTOM_LEVEL_PAGE: new pages.CustomLevelPage(this),
        }
        this.pageList.MAIN.level = this.game.level;

        this.activePage = null;
    }

    getActivePageName() {
        return this.activePage ? this.activePage.name : null;
    }

    getCamera() {
        return this.activePage ? this.activePage.camera : null;
    }

    loadPage(pageName) {
        if(!this.pageList.hasOwnProperty(pageName)) return;

        if(this.activePage)
            this.activePage.onPageExit();

        // Fade out, switch page, and fade back in.
        fadeOverlay.beginFadeOut(() => {
            this.activePage = this.pageList[pageName];
            this.activePage.init();
            this.activePage.update();
            fadeOverlay.beginFadeIn();
        });
    }

    update(d) {
        // Hue shift
        this.backgroundHue += COLOR_CYCLE_SPEED;
        if(this.backgroundHue >= 360) this.backgroundHue = 0;

        if(this.activePage) this.activePage.update(d);
    }

    handleInput(input) {
        if(!this.isActive || !this.activePage) return;
        this.activePage.handleInput(input);
    }

    enter(startPage) {
        this.isActive = true;
        this.loadPage(startPage ?? "MAIN");
    }

    exit() {
        this.isActive = false;
        this.activePage = null;
    }

    render() {
        if(!this.isActive || !this.activePage) return;
        this.activePage.render();
    }
}