import Camera from '../player/Camera.js';
import * as pages from './Pages.js';

export default class MenuManager {
    constructor(game) {
        this.game = game;
        this.camera = new Camera();

        this.isActive = false;
        this.pageList = {
            MAIN: new pages.MainMenu(),
            MAIN_LEVELS: new pages.MainLevels(),
            CUSTOMIZE_ICON: new pages.CustomizeIcon(),
        }
        this.pageList.MAIN.level = this.game.level;
        this.pageList.MAIN.camera = this.camera;

        this.activePage = null;
    }

    getActivePageName() {
        return this.activePage ? this.activePage.name : null;
    }

    loadPage(pageName) {
        if(!this.pageList.hasOwnProperty(pageName)) return;
        this.activePage = this.pageList[pageName];
        this.activePage.init();
    }

    update(d) {
        this.activePage.update(d);
    }

    handleInput(input) {
        if(!this.isActive || !this.activePage) return;
        this.activePage.handleInput();
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