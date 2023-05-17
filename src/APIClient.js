import LevelInfo from "./level/LevelInfo.js";

const API_PATH = "api/methods/";

export default class API {

    /**
     * Get the basic level data for all main levels (name, difficulty, etc.)
     * Only for displaying in the menu. It does not access the level's content.
     * @param {Function} onLoad Function which runs when the levels have loaded. Receives level info as arg
     */
    static getMainLevelsInfo(onLoad) {
        XMLGet("get_main_levels_info.php", (response) => {
            const levelInfoList = [];
            response.forEach(leveldata => {
                let info;
                try { info = JSON.parse(leveldata) } 
                catch { console.error("Invalid JSON: " + leveldata) }
                levelInfoList.push(new LevelInfo(info));
            });
            onLoad(levelInfoList);
        });
    }

    /**
     * Get complete level info and content from level ID
     * @param {number} levelId
     * @param {Function} onLoad Function which runs when content has loaded. Receives level info as arg
     */
    static getMainLevelContent(levelId, onLoad) {
        XMLGet(`get_main_level_from_id.php?id=${levelId}`, (response) => {
            onLoad(response.data, response.info);
        });
    }

    static getCreatedLevelsInfo(onLoad) {
        XMLGet("get_created_levels_info.php", (response) => {
            response = response.map(leveldata => {
                return tryToParse(leveldata);
            });
            onLoad(response);
        })
    }
}

function XMLGet(method, onLoad) {
    const xml = new XMLHttpRequest();
    const url = API_PATH + method;
    xml.open("get", url, true);

    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            let response = tryToParse(this.responseText, true);
            onLoad(response);
        }
    };


    xml.send();
}

function tryToParse(json, errorOnFail = false) {
    try { 
        return JSON.parse(json);
    }
    catch {
        if(errorOnFail) {
            console.error(`Failed to parse JSON: \n${json}`);
        } else {
            return json;
        }
    }
}