import { isValidListIndex } from "../helpers/helper.js";
import ColorChannel from "./ColorChannel.js";

const CHANNEL_COUNT = 100;

export class ColorChannelManager {
    constructor() {
        this.main = {
            bg: new ColorChannel(),
            g: new ColorChannel(),
            obj: new ColorChannel(),
            line: new ColorChannel(null, null, null, null, true),
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
        return channel ? channel.getColor() : 'hsl(0,0%,0%)';
    }

    getValues(channelName) {
        const channel = this.getChannel(channelName);
        return channel ? channel.getValues() : {h: 0, s: 0, l: 0};
    }

    reset() {
        for(const channel in this.main) 
            this.main[channel].reset();

        this.numbered.forEach(channel => {
            channel.reset();
        })

        // Line is blending by default
        this.getChannel("line").blending = true;
    }
    
    /**
     * Used when a level is being loaded
     * @param {object} colorData 
     */
    loadValues(colorData) {
        this.reset();
        for(const channel in colorData) {
            let clr = colorData[channel];
            this.getChannel(channel)?.setColor(clr.h, clr.s, clr.l, clr.a, clr.blending);
        }
    }
}

export const colorChannels = new ColorChannelManager();