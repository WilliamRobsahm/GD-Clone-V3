import Background from "./Background.js";
import ColorChannel from "./ColorChannel.js";

export default class Level {
    constructor(game, properties, objectData) {
        this.game = game;
        this.name = properties.name ? properties.name : ""
        this.background = new Background(this, 0.5);
        this.objectData = objectData;
        this.objects = [];
        this.colorChannels = {
            bg: new ColorChannel(100, 100, 200, false),
            g: new ColorChannel(80, 80, 160, false),
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