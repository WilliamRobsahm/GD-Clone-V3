import ObjectHitbox from "../collision/ObjectHitbox.js";
import config from "../game/config.js";
import { colorChannels } from "../level/ColorChannelManager.js";
import { GRID_SIZE } from "../misc/global.js";
import Rect from "../misc/Rect.js";

export class Object extends Rect {
    constructor(name, gridX, gridY, shiftX, shiftY, rotation, game) {
        super();
        this.game = game;
        this.name = name;
        this.gridX = gridX;
        this.gridY = gridY;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.rotation = rotation;
        this.scale = 1;

        this.baseChannelName = null; 
        this.detailChannelName = null;

        this.chunk = null;
    }

    getX() { return this.gridX * GRID_SIZE + this.shiftX }
    getY() { return -this.gridY * GRID_SIZE + this.shiftY - GRID_SIZE }

    setX(x) {
        this.gridX = Math.floor(x / GRID_SIZE);
        this.shiftX = x % GRID_SIZE;
    }

    setY(y) {
        this.gridY = Math.floor(-y / GRID_SIZE);
        this.shiftY = y % GRID_SIZE;
    }

    getGridX() { return this.gridX }
    getGridY() { return this.gridY }

    getWidth() { return this.model.width * this.scale }
    getHeight() { return this.model.height * this.scale }

    getRotation() { return this.rotation }

    getHitbox() { return this.hitbox }

    setModel(model) {
        this.model = model;
    }

    createHitbox(hitboxType, width, height, offsetX, offsetY) {
        this.hitbox = new ObjectHitbox(this,
            hitboxType, 
            width ?? this.getWidth(), 
            height ?? this.getHeight(), 
            offsetX ?? 0, 
            offsetY ?? 0
        );
    }

    setChunk(index) {
        this.chunk = index;
    }

    isHazard() {
        return (this.hitbox && this.hitbox.type == "HAZARD");
    }

    isSolid() {
        return (this.hitbox && this.hitbox.type == "SOLID");
    }

    render(rect = null) {
        let baseChannel = colorChannels.getChannel(this.baseChannelName);
        let detailChannel = colorChannels.getChannel(this.detailChannelName);
        this.model.render(this, baseChannel, detailChannel, this.scale);

        if(config.showHitboxes && this.hitbox) {
            this.hitbox.render();
        }
    }
}

