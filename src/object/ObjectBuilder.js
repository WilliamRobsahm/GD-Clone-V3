import ModelManager from "./ModelManager.js";
import { Object } from "./object.js";

export default class ObjectBuilder {
    constructor(game) {
        this.game = game;
        this.models = new ModelManager(game);
    }

    createObject(name, gridX, gridY, shiftX, shiftY, rotation) {
        let object = new Object(name, gridX, gridY, shiftX, shiftY, rotation, this.game);
        let modelName = "";
        switch(name) {
            case "default_block":
                modelName = "default_block"; break;
                
            case "default_spike":
                modelName = "default_spike"; break;
        }
        object.setModel(this.models.getModel(modelName));

        return object.model ? object : null 
    }
}