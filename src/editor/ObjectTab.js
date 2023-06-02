import { navigateThroughItems } from "../helpers/helper.js";
import { objectBuilder } from "../object/ObjectBuilder.js";

export default class ObjectTab {
    constructor(name, iconObjectName = null) {
        this.name = name;
        this.iconObject = null;
        this.objectList = [];

        this.uiNavTab = null;
        this.pages = [];
        this.activePage = 0;

        if(iconObjectName) 
            this.setIcon(iconObjectName);
    }

    setIcon(objName) {
        let object = objectBuilder.createObject(objName);
        if(object === null) return;
        object.scale = 0.5;
        this.iconObject = object;
    }

    addObjects(objectNameList) {
        objectNameList.forEach(objName => {
            let object = objectBuilder.createObject(objName);
            if(object === null) return;
            this.objectList.push(object);
        });
    }

    navigatePages(d) {
        this.getActivePage().visible = false;
        this.activePage = navigateThroughItems(this.activePage, d, this.pages.length);
        this.getActivePage().visible = true;
    }
    
    getActivePage() {
        return this.pages[this.activePage].container;
    }

    getActivePageRows() {
        return this.pages[this.activePage].rows;
    }
}