import Background from "./Background.js";


export default class Level {
    constructor(game) {
        this.game = game;
        this.background = new Background(this, 0.5);
        this.objects;
    }
}