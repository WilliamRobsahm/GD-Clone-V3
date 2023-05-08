import ModelManager from "./ModelManager.js";
import { Object } from "./object.js";

export default class ObjectBuilder {
    constructor(game) {
        this.game = game;
        this.models = new ModelManager(game);
    }

    createObject(name, gridX, gridY, shiftX, shiftY, rotation) {
        let object = new Object(name, gridX, gridY, shiftX, shiftY, rotation, this.game);
        switch(name) {
            case "default_block":
                object.setModel(this.models.getModel("default_block"));
                object.createHitbox("SOLID");
                break;
            case "default_spike":
                object.setModel(this.models.getModel("default_spike"));
                object.createHitbox("HAZARD", 16, 32, 24, 16);
                break;
        }

        return object.model ? object : null 
    }
}