


/**
 * Data structure for the basic information about a level
 * Does not contain objects or color channels, and is only used for showing lists of levels.
 * When the user enters a level, the full level data is requested and put in a different object.
 */
export default class LevelInfo {
    constructor(params) {
        this.id = params.levelID ?? -1;
        this.title = params.title ?? "";
        this.difficulty = params.difficulty ?? 0;
        this.songId = params.songID ?? null;
    }
}