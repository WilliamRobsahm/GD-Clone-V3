import { isValidListIndex, navigateThroughItems } from "../helpers/helper.js";
import ScrollableItemList from "../misc/ScrollableItemList.js";
import { objectBuilder } from "../object/ObjectBuilder.js";

export default class ObjectTab {
    constructor(name, iconObjectName = null) {
        this.name = name;
        this.iconObject = null;
        this.objectList = [];

        this.uiNavTab = null;
        this.pages = new ScrollableItemList();

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
        let indexes = this.pages.shift(d);
        this.getPage(indexes.previous).container.visible = false;
        this.getPage(indexes.new).container.visible = true;
    }

    getPage(index) {
        return this.pages.getItem(index);
    }
    
    getActivePage() {
        return this.pages.getActiveItem();
    }
}