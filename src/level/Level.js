import ObjectBuilder from "../object/ObjectBuilder.js";
import Chunk from "./Chunk.js";
import ColorChannel from "./ColorChannel.js";
import ColorChannelManager from "./ColorChannelManager.js";
import ParallaxElement from "./ParallaxElement.js";

const BG_MOVEMENT_MULTIPLIER = 0.5;
const CHUNK_SIZE = 4;

/**
 * Represents the currently loaded level
 */
export default class Level {
    constructor(game) {
        this.game = game;
        this.title;
        this.background;
        this.floor;
        this.initialSpeed;
        this.initialGamemode;
        this.colorChannels;
        this.objects = [];

        this.background = new ParallaxElement(this, "background", BG_MOVEMENT_MULTIPLIER);
        this.floor = new ParallaxElement(this, "floor");
        
        this.objects = [];

        this.colors = new ColorChannelManager();

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

    /**
     * 
     * @param {object} levelData Contains level content. Objects, color channels, etc.
     * @param {LevelInfo} levelInfo Contains name, difficulty, etc.
     * @param {ObjectBuilder} builder Object builder
     */
    loadLevel(levelData, levelInfo, builder) {
        console.log(levelData);
        console.log(levelInfo);
        this.id = levelInfo.id;
        this.title = levelInfo.title;
        this.difficulty = levelInfo.difficulty;
        this.songId = levelInfo.songId;

        this.initialSpeed = levelData.speed ?? 1;
        this.initialGamemode = levelData.gamemode ?? 0;

        this.pulseBpm = levelData.pulseBPM ?? null;
        this.pulseOffset = levelData.pulseOffset ?? 0;

        this.background.setVariant(levelData.background ?? 0);
        this.floor.setVariant(levelData.background ?? 0);

        this.colors.loadValues(levelData.channels);
        this.loadObjects(levelData.objects, builder);

        this.levelLength = this.findLength();
        this.setupChunks(CHUNK_SIZE);
        console.log(this.chunks);
    }

    loadObjects(objectData, builder) {
        for(let i = 0; i < objectData.length; i++) {
            let data = objectData[i];
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
        for(let x = 0; x <= this.getLength(); x += chunkSize) {
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
            chunk.renderObjects(this.colors);
        });
    }

    renderHitboxes(camera) {
        let chunkList = this.getChunksInRenderingRange(camera);
        chunkList.forEach(chunk => {
            chunk.renderHitboxes();     
        })
    }
}