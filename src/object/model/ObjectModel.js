import { ctx } from "../../misc/global.js";
import { rotateCanvas } from "../../misc/util.js";

export default class ObjectModel {
    constructor(game, width, height, name) {
        this.game = game;
        this.width = width;
        this.height = height;

        // names should be lowercase with underscores, ex. "test_block";
        this.name = name;
    }

    getName() { return this.name }
    getWidth() { return this.width } 
    getHeight() { return this.height }

    render(object, channels) {
        rotateCanvas(ctx, object.getCenterX(), object.getCenterX(), object.getRotation()*90);
        this.renderModel(object, channels);
        rotateCanvas(ctx, object.getCenterX(), object.getCenterY(), - object.getRotation()*90);
    }
}