
/**
 * Data structure for the basic information about a level
 * Does not contain objects or color channels, and is only used for showing lists of levels.
 * When the user enters a level, the full level data is requested and put in a different object.
 */
export default class LevelInfo {
    constructor(params) {
        this.id = params.levelID ?? -1;
        this.title = params.title ?? "";
        this.description = params.description ?? "";
        this.difficulty = params.difficulty ?? "N/A";
        this.songId = params.songID ?? null;
        this.duration = params.duration ?? 0;
        this.length = this.getLengthFromDuration();
    }

    getLengthFromDuration(durationSeconds = this.duration) {
        if(!durationSeconds || isNaN(durationSeconds)) return "Unknown";
        if(durationSeconds < 15) return "Tiny";
        if(durationSeconds < 30) return "Short";
        if(durationSeconds < 60) return "Medium";   
        if(durationSeconds < 120) return "Long";
        else return "XL";        
    }
}