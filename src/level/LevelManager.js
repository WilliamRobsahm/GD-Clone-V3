import Level from "./level.js"

export class LevelManager {
    constructor(game) {
        

        this.levels = [
            new Level(game, {
                name: "Alternate Reality",
                background: 0,
                floor: 0,
                initialSpeed: "NORMAL",
                initialGamemode: "CUBE",
            }, [
                {name:"default_spike",gx:10,gy:0},
                {name:"default_spike",gx:11,gy:0},
                {name:"default_block",gx:12,gy:0},
                {name:"default_block",gx:13,gy:0},
                {name:"default_block",gx:14,gy:0},
                {name:"default_block",gx:15,gy:0}, {name:"default_spike",gx:15,gy:1},

                {name:"default_block",gx:24,gy:0}, {name:"default_block",gx:24,gy:1}, {name:"default_block",gx:24,gy:3},

                {name:"default_block",gx:30,gy:0,sy:56},
                {name:"default_block",gx:31,gy:0,sy:48},
                {name:"default_block",gx:32,gy:0,sy:40},
                {name:"default_block",gx:33,gy:0,sy:32},
                {name:"default_block",gx:34,gy:0,sy:24},
                {name:"default_block",gx:35,gy:0,sy:16},
                {name:"default_block",gx:36,gy:0,sy:8},
                {name:"default_block",gx:37,gy:0,sy:0},

                {name:"default_spike",gx:45,gy:0},
                {name:"default_spike",gx:46,gy:0},
                {name:"default_spike",gx:47,gy:0},
            ]
            )
        ]
    }

    getLevel(levelID) {
        return this.levels[levelID]
    }
}