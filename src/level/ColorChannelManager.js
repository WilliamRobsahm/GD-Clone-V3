import { isValidListIndex } from "../misc/util.js";
import ColorChannel from "./ColorChannel.js";

const CHANNEL_COUNT = 100;

export default class ColorChannelManager {
    constructor() {
        this.main = {
            bg: new ColorChannel(),
            g: new ColorChannel(),
            obj: new ColorChannel(),
            line: new ColorChannel(),
        };

        this.numbered = [];
        for(let i = 0; i < CHANNEL_COUNT; i++) {
            this.numbered.push(new ColorChannel());
        }

        this.hidden = {
            black: new ColorChannel(0, 0, 0),
        };
    }

    getChannel(channelName) {
        if(isValidListIndex(this.numbered, channelName))
            return this.numbered[channelName];

        if(this.main.hasOwnProperty(channelName))
            return this.main[channelName];

        if(this.hidden.hasOwnProperty(channelName))
            return this.hidden[channelName];
        
        return null;
    }

    getColor(channelName) {
        const channel = this.getChannel(channelName);
        return channel ? channel.getColor() : {r: 0, g: 0, b: 0};
    }

    getValues(channelName) {
        const channel = this.getChannel(channelName);
        return channel ? channel.getValues() : {r: 0, g: 0, b: 0};
    }

    reset() {
        for(const channel in this.main) 
            this.main[channel].setColor();

        this.numbered.forEach(channel => {
            channel.setColor();
        })
    }
    
    /**
     * Used when a level is being loaded
     * @param {object} colorData 
     */
    loadValues(colorData) {
        this.reset();
        for(const channel in colorData) {
            let clr = colorData[channel];
            this.getChannel(channel)?.setColor(clr.r, clr.g, clr.b, clr.blending, clr.a);
        }
    }
}