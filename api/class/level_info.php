
<?php

function get_level_info($info) {
    return json_encode(new LevelInfo($info));
}

class LevelInfo {
    public $title;
    public $songID;
    public $levelID;
    public $difficulty;
    public $duration;

    function __construct($info = new stdClass()) {
        $info = json_decode($info);
        $this->title = $info->title ?? "Unnamed";
        $this->songID = $info->songID ?? null;
        $this->levelID = $info->levelID ?? null;
        $this->difficulty = $info->difficulty ?? null;
        $this->duration = $info->duration ?? 0;
    }
}

?>