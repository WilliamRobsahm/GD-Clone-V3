import { GRID_SIZE } from "../misc/global.js";
import { objectBuilder } from "../object/ObjectBuilder.js";
import Chunk from "./Chunk.js";
import { colorChannels } from "./ColorChannelManager.js";
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
        this.initialSpeed;
        this.initialGamemode;
        this.objects = [];
        
        this.floorY = 0; // Determines at what Y position the background and floor are rendered

        this.background = new ParallaxElement(this, "background", BG_MOVEMENT_MULTIPLIER);
        this.floor = new ParallaxElement(this, "floor");
        
        this.objects = [];

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

    getInitialGamemode() {
        switch(this.initialGamemode) {
            case 0: return "CUBE";
        }
    }

    getInitialSpeed() {
        switch(this.initialSpeed) {
            case 0: return "SLOW";
            case 1: return "NORMAL";
            case 2: return "FAST";
            case 3: return "FASTER";
        }
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

    getChunkRenderingRange(camera) {
        const chunks = [];
        for(let i = 0; i < this.chunks.length; i++) {
            if(this.chunks[i].inRenderingRange(camera)) chunks.push(i);
        }
        return {
            c1: chunks[0],
            c2: chunks[chunks.length - 1],
        }
    }

    getChunkCollisionRange(player) {
        const chunks = [];
        for(let i = 0; i < this.chunks.length; i++) {
            if(this.chunks[i].inCollisionRange(player)) chunks.push(i);
        }
        return {
            c1: chunks[0],
            c2: chunks[chunks.length - 1],
        }
    }

    isValidRange(range) {
        if(range.hasOwnProperty("c1") && range.hasOwnProperty("c2")) return true;
        console.warn("Invalid range");
        return false;
    }

    getObjectsInChunkRange(range) {
        if(!this.isValidRange(range)) return [];
        return this.objects.filter(obj => (obj.chunk >= range.c1 && obj.chunk <= range.c2));
    }

    setFloorPosition(y) {
        this.floorY = y;
        this.background.floorY = y;
        this.floor.floorY = y;
    }

    /**
     * 
     * @param {object} levelData Contains level content. Objects, color channels, etc.
     * @param {LevelInfo} levelInfo Contains name, difficulty, etc.
     */
    loadLevel(levelData, levelInfo) {
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

        colorChannels.loadValues(levelData.channels);

        let objectData = levelData.objects ?? [];
        this.loadObjects(objectData);

        this.levelLength = this.findLength();
        this.setupChunks();
        console.log(this.chunks);
    }

    loadObjects(objectData) {
        for(let i = 0; i < objectData.length; i++) {
            let data = objectData[i];
            let object = objectBuilder.createObject(data.name, 
                (data.gx ?? 0), (data.gy ?? 0),
                (data.sx ?? 0), (data.sy ?? 0),
                (data.r ?? 0),
            );
            if(object) {
                this.objects.push(object);
            }
        }
    }

    updateObjectChunk(index) {
        let object = this.getObject(index);
        let chunkIndex = this.getChunkIndex(object.getGridX());
        object.setChunk(chunkIndex);

        // If object is out of chunk range, new chunks are added.
        if(chunkIndex >= this.chunks.length) {
            while(this.chunks.length <= chunkIndex) {
                this.addChunk();
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

    getChunkIndex(x) {
        return Math.floor(x / CHUNK_SIZE);
    }

    addChunk() {
        let gridX = this.chunks.length > 0 ? this.chunks[this.chunks.length - 1].gridX + CHUNK_SIZE : 0;
        this.chunks.push(new Chunk(gridX, CHUNK_SIZE));
    }

    /**
     * Create 'chunks' and assign objects to them.
     * A chunk is a collection of objects sharing a similar X position. 
     * Collision and rendering conditions are checked on each individual chunk instead of object, for performance reasons.
     */
    setupChunks() {
        // Loop through all objects, and add them to the appropriate chunk
        for(let i = 0; i < this.objects.length; i++) {
            this.updateObjectChunk(i);
        }
    }

    reset() {
        this.background.resetPosition();
        this.floor.resetPosition();
    }

    // Has to be reworked once object layers are added
    renderObjects(camera) {
        let range = this.getChunkRenderingRange(camera);
        let objects = this.getObjectsInChunkRange(range);
        
        objects.forEach(obj => {
            obj.render();
        });
    }
}