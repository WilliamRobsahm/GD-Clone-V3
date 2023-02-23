import { DefaultBlock } from "./model/DefaultBlock.js";
import { DefaultSpike } from "./model/DefaultSpike.js";

export default class ModelManager {
    constructor(game) {
        this.game = game;

        this.models = [
            new DefaultBlock(game),
            new DefaultSpike(game),
        ]

        // Set up enum
        this.modelEnum = {}
        for(let i = 0; i < this.models.length; i++) {
            this.modelEnum[this.models[i].getName()] = i;
        }
    }

    getModel(modelName) {
        let index = this.modelEnum[modelName];
        if(index === undefined) {
            console.log(`Error: "${modelName}" is an invalid model name!`);
            return;
        }

        return this.models[index];
    }
}