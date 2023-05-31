import ModelManager from "./ModelManager.js";
import { Object } from "./object.js";

export class ObjectBuilder {
    constructor() {
        this.models = null;
    }

    initialize(game) {
        this.models = new ModelManager(game);
    }

    createObject(name, gridX = 0, gridY = 0, shiftX = 0, shiftY = 0, rotation = 0) {
        if(!this.models) console.error("ObjectBuilder must be initialized");

        let object = new Object(name, gridX, gridY, shiftX, shiftY, rotation, this.game);

        switch(name) {
            case "default_block":
                object.setModel(this.models.getModel("default_block"));
                object.createHitbox("SOLID");
                object.baseChannelName = "obj";
                break;
            case "default_spike":
                object.setModel(this.models.getModel("default_spike"));
                object.createHitbox("HAZARD", 16, 32, 24, 16);
                object.baseChannelName = "obj"
                break;
        }

        if(!object.model) {
            console.warn(`"${name}" is an invalid object type`);
            return null;
        } else {
            return object;
        }
    }
}

export const objectBuilder = new ObjectBuilder();