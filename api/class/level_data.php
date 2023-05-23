
<?php

function get_level_data($data) {
    return json_encode(new LevelData($data));
}

class LevelData {
    public $background;
    public $floor;
    public $speed;
    public $gamemode;
    public $pulseBPM;
    public $pulseOffset;
    public $channels;
    public $objects;

    function __construct($data = new stdClass()) {
        $data = json_decode($data);
        $this->background = $data?->background ?? 0;
        $this->floor = $data?->floor ?? 0;
        $this->speed = $data?->speed ?? 1;
        $this->gamemode = $data?->gamemode ?? 0;
        $this->pulseBPM = $data?->pulseBPM ?? 120;
        $this->pulseOffset = $data?->pulseOffset ?? 0;
        $this->channels = $data?->channels ?? "{}";
        $this->objects = $data?->objects ?? "[]";
    }
}

?>