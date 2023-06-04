import { isValidListIndex, navigateThroughItems } from "../helpers/helper.js";
import UIHelper from "../helpers/uiHelper.js";
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
        UIHelper.swapVisibility(this.getPage(indexes.previous).container, this.getPage(indexes.new).container);
    }

    getPage(index) {
        return this.pages.getItem(index);
    }
    
    getActivePage() {
        return this.pages.getActiveItem();
    }
}