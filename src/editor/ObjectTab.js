import { objectBuilder } from "../object/ObjectBuilder.js";

export default class ObjectTab {
    constructor(name, iconObjectName = null) {
        this.name = name;
        this.iconObject = null;
        this.objectList = [];

        if(iconObjectName) 
            this.setIcon(iconObjectName);
    }

    setIcon(objName) {
        let object = objectBuilder.createObject(objName);
        if(object === null) return;
        this.iconObject = object;
    }

    addObjects(objectNameList) {
        objectNameList.forEach(objName => {
            let object = objectBuilder.createObject(objName);
            if(object === null) return;
            this.objectList.push(object);
        });
    }
}