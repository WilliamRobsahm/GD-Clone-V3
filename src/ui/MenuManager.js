import Camera from '../player/Camera.js';
import * as pages from './Pages.js';

export default class MenuManager {
    constructor(game) {
        this.game = game;

        this.isActive = false;
        this.pageList = {
            MAIN: new pages.MainMenu(this),
            MAIN_LEVELS: new pages.MainLevels(this),
            CUSTOMIZE_ICON: new pages.CustomizeIcon(this),
            EDITOR_MENU: new pages.EditorMenu(this),
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
        this.activePage = this.pageList[pageName];
        this.activePage.init();
        this.activePage.update();
    }

    update(d) {
        this.activePage.update(d);
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