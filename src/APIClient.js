import LevelInfo from "./level/LevelInfo.js";
import { tryToParse, recursiveParse } from "./helpers/helper.js";


const API_PATH = "api/methods/";

export default class API {

    /**
     * Get the basic level data for all main levels (name, difficulty, etc.)
     * Only for displaying in the menu. It does not access the level's content.
     * @param {Function} onLoad Function which runs when the levels have loaded. Receives level info as arg
     */
    static getMainLevelsInfo(onLoad) {
        xmlGet("get_main_levels_info", null, (response) => {
            const levelInfoList = [];
            response.forEach(info => {
                levelInfoList.push(new LevelInfo(info));
            });
            onLoad(levelInfoList);
        });
    }

    /**
     * Get complete level info and content from level ID (Main levels only)
     * @param {number} id ID of level.
     * @param {Function} onLoad Function which runs when content has loaded. Receives level info as arg
     */
    static getMainLevelContent(id, onLoad) {
        xmlGet(`get_main_level_from_id`, {id: id}, (response) => {
            onLoad(response.data, response.info);
        });
    }

    static getCreatedLevelsInfo(onLoad) {
        xmlGet("get_created_levels_info", null, (response) => {
            const levelInfoList = [];
            response.forEach(leveldata => {
                let info = tryToParse(leveldata, true);
                levelInfoList.push(new LevelInfo(info));
            });
            onLoad(levelInfoList);
        })
    }

    static logError(message) {
        console.error("API ERROR: " + message);
    }
}

/**
 * Helper function for doing an XML GET-request.
 * @param {string} method Name of method (without ".php")
 * @param {object} data Object containing the data included in the url.
 * @param {Function} onLoad Function
 */
function xmlGet(method, data, onLoad) {
    const xml = new XMLHttpRequest();
    const url = formatRequestURL(method, data);    

    xml.open("get", url, true);

    xml.onreadystatechange = function() {
        if(xmlReady(xml)) {
            const response = recursiveParse(this.responseText);

            if(response.status == "OK") {
                onLoad(response.data);
            } else {
                API.logError(response.message);
            }
        }
    };

    xml.send();
}

function xmlReady(xml) {
    return (xml.readyState == 4 && xml.status == 200);
}

/**
 * Format a request url with data.
 * Ex: method = "example" & data = {foo: "bar", fizz: "buzz"} 
 * returns => example.php?foo=bar&fizz=buzz
 * @param {string} methodName Name of method (not including ".php");
 * @param {object?} data Method data
 * @returns {string}
 */
function formatRequestURL(methodName, data) {
    let url = API_PATH + methodName + ".php";

    if(!data || typeof data !== "object") {
        return url;
    }

    let urlData = [];
    for(const key in data) {
        urlData.push(`${key}=${data[key]}`);
    }

    return url + "?" + urlData.join("&");
}