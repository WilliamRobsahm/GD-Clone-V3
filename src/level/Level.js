import { ctx } from "../misc/global.js";
import Chunk from "./Chunk.js";
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
        this.levelLength = 0;
        this.chunks = [];
    }

    getLength() {
        return this.levelLength;
    }

    getObject(index) {
        if(isNaN(index) || index < 0 || index > this.objects.length) {
            return null;
        }
        return this.objects[index];
    }

    /**
     * Return an array of all chunks that are within rendering range
     * @returns {Chunk[]}
     */
    getChunksInRenderingRange(camera) {
        const renderableChunks = [];
        for(let i = 0; i < this.chunks.length; i++) {
            if(this.chunks[i].inRenderingRange(camera)) {
                renderableChunks.push(this.chunks[i]);
            }
        }
        return renderableChunks;
    }

    /**
     * Return an array of all chunks that are within collision range
     * @returns {Chunk[]}
     */
    getChunksInCollisionRange(player) {
        const collidibleChunks = [];
        for(let i = 0; i < this.chunks.length; i++) {
            if(this.chunks[i].inCollisionRange(player)) {
                collidibleChunks.push(this.chunks[i]);
            }
        }
        return collidibleChunks;
    }

    loadLevel(builder) {
        this.loadObjects(builder);
        this.levelLength = this.findLength();
        this.setupChunks(this.game.chunkSize);
        console.log(this.chunks);
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

    /**
     * Calculate the highest 'gridX' value among the level objects and return it
     * @returns {number}
     */
    findLength() {
        let levelLength = 0;
        for(let i = 0; i < this.objects.length; i++) {
            if(this.objects[i].getGridX() > levelLength) {
                levelLength = this.objects[i].getGridX();
            }
        }
        console.log("Level length: " + levelLength);
        return levelLength;
    }

    /**
     * Create 'chunks' and assign objects to them.
     * A chunk is a collection of objects sharing a similar X position. 
     * Collision and rendering conditions are checked on each individual chunk instead of object, for performance reasons.
     * 
     * @param {number} chunkSize The width of each chunk in tiles
     */
    setupChunks(chunkSize) {

        // Create chunks
        for(let x = 0; x < this.getLength(); x += chunkSize) {
            this.chunks.push(new Chunk(this, x, chunkSize));
        }

        // Loop through all objects, and add them to the appropriate chunk
        for(let i = 0; i < this.objects.length; i++) {
            let chunkIndex = Math.floor(this.getObject(i).getGridX() / 4);
            this.chunks[chunkIndex].add(i);
            this.getObject(i).setChunk(chunkIndex);
        }
    }

    reset() {
        this.background.resetPosition();
        this.floor.resetPosition();
    }

    // Has to be reworked once object layers are added
    renderObjects(camera) {
        let chunkList = this.getChunksInRenderingRange(camera);
        chunkList.forEach(chunk => {
            chunk.renderObjects(this.colorChannels);
        });
    }

    renderHitboxes(camera) {
        let chunkList = this.getChunksInRenderingRange(camera);
        chunkList.forEach(chunk => {
            chunk.renderHitboxes();     
        })
    }
}