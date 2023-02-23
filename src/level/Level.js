import ColorChannel from "./ColorChannel.js";
import ParallaxElement from "./ParallaxElement.js";

export default class Level {
    constructor(game, properties, objectData) {
        this.game = game;
        this.name = properties.name ? properties.name : ""
        this.background = new ParallaxElement(this, "background", 0.5, 3, 0);
        this.floor = new ParallaxElement(this, "floor", 0, 5, 0);
        this.objectData = objectData;
        this.objects = [];
        this.colorChannels = {
            bg: new ColorChannel(60, 90, 255, false),
            g: new ColorChannel(40, 70, 180, false),
            line: new ColorChannel(255, 255, 255, false),
            obj: new ColorChannel(255, 255, 255, false),
        }
    }

    loadObjects(builder) {
        for(let i = 0; i < this.objectData.length; i++) {
            let data = this.objectData[i];
            let object = builder.createObject(data.name, 
                (data.gx ? data.gx : 0),
                (data.gy ? data.gy : 0),
                (data.sx ? data.sx : 0),
                (data.sy ? data.sy : 0),
                (data.r ? data.r : 0),
            );
            if(object) {
                this.objects.push(object);
            }
        }
    }
}