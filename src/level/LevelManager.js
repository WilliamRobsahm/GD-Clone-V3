import Level from "./level.js"
import LevelInfo from "./LevelInfo.js";

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

        this.mainLevelInfo = [];
        this.mainLevelsLoaded = false;
        this.getMainLevelInfo((data) => {
            this.mainLevelInfo = data;
            this.mainLevelsLoaded = true;
            console.log(data);
        });
    }

    getMainLevelInfo(onLoad) {
        var xml = new XMLHttpRequest();
        var url = "api/getMainLevels.php";
        xml.open("get", url, true);

        xml.onreadystatechange = function() {
            if(xml.readyState == 4 && xml.status == 200) {
                let jsonData;
                try { jsonData = JSON.parse(this.responseText) } 
                catch { console.error("Invalid JSON: " + this.responseText) }
                
                const levelInfoList = [];
                jsonData.forEach(leveldata => {
                    let info;
                    try { info = JSON.parse(leveldata) } 
                    catch { console.error("Invalid JSON: " + leveldata) }
                    levelInfoList.push(new LevelInfo(info));
                });

                onLoad(levelInfoList);
            }
        };
        xml.send();
    }

    getLevel(levelID) {
        return this.levels[levelID]
    }
}