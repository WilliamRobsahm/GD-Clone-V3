import { ctx } from "../../misc/global.js";
import { rotateCanvas } from "../../helpers/helper.js";

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

    render(object, baseChannel = null, detailChannel = null, scale = 1) {
        rotateCanvas(ctx, object.getCenterX(), object.getCenterX(), object.getRotation()*90);
        this.renderModel(object, baseChannel, detailChannel, scale);
        rotateCanvas(ctx, object.getCenterX(), object.getCenterY(), - object.getRotation()*90);
    }

    renderModel(rect) {}
}