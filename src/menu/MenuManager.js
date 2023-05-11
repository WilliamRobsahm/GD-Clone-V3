import Level from '../level/Level.js';
import * as pages from './Pages.js';

export default class MenuManager {
    constructor(game) {
        this.game = game;

        this.isActive = false;
        this.pageList = {
            MAIN: new pages.MainMenu(),
            MAIN_LEVELS: new pages.MainLevels(),
            CUSTOMIZE_ICON: new pages.CustomizeIcon(),
        }
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

        if(this.getActivePageName() == "MAIN") {
            this.activePage.render(this.game.level);
        } else {
            this.activePage.render();
        }
    }
}