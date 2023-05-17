import API from "../APIClient.js";
import Level from "./level.js"
import LevelInfo from "./LevelInfo.js";

export class LevelManager {
    constructor(game) {
        this.game = game;
        this.mainLevelInfo = [];
    }

    loadMainLevelInfo() {
        API.getMainLevelsInfo((info) => {
            this.mainLevelInfo = info;
        });
    }
}