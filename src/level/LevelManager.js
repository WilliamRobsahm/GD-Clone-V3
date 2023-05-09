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
            ]
            )
        ]
    }

    getLevel(levelID) {
        return this.levels[levelID]
    }
}