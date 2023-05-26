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
        xmlRequest("get_main_levels_info", "get", null, (response) => {
            const levelInfoList = [];
            response.data.forEach(info => {
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
        xmlRequest(`get_main_level_from_id`, "get", {id: id}, (response) => {
            let level = response.data;
            onLoad(level.data, level.info);
        });
    }

    static getCreatedLevelsInfo(onLoad) {
        xmlRequest("get_created_levels_info", "get", null, (response) => {
            const levelInfoList = [];
            response.data.forEach(leveldata => {
                let info = tryToParse(leveldata, true);
                levelInfoList.push(new LevelInfo(info));
            });
            onLoad(levelInfoList);
        })
    }

    static getCreatedLevelContent(id, onLoad) {
        xmlRequest(`get_created_level`, "get", {id: id}, (response) => {
            let level = response.data;
            onLoad(level.data, level.info);
        });
    }

    /**
     * Update the info of a created level.
     * @param {LevelInfo} levelInfo Level info object.
     */
    static saveLevelInfo(levelInfo) {
        let json = JSON.stringify(levelInfo);
        xmlRequest("save_level_info", "post", {info: json}, (response) => {});
    }

    static logError(message) {
        console.error("API ERROR: " + message);
    }
}

/**
 * Helper function for doing an XML request.
 * @param {string} apiMethod Name of api method (without ".php")
 * @param {string} requestMethod either "get" or "post"
 * @param {object} data Object containing the data included in the url.
 * @param {Function} onLoad Function which runs when the request is done. Receives response data.
 */
function xmlRequest(apiMethod, requestMethod, data, onLoad,) {
    const xml = new XMLHttpRequest();
    const url = formatRequestURL(apiMethod, data);    

    xml.open(requestMethod, url, true);

    xml.onreadystatechange = function() {
        if(!xmlReady(xml)) return;
        const response = recursiveParse(this.responseText.trim());
        
        if(response.status == "OK") {
            onLoad(response);
        } else {
            let errorMessage = response.message ? response.message : 
                (typeof response == "string" && response) ? response : 
                "Request failed";
            API.logError(errorMessage);
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