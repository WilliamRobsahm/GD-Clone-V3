import PlayerCamera from "./PlayerCamera.js";


export default class Player {
    constructor(game) {
        this.game = game;
        this.camera = new PlayerCamera(this)
    }
}