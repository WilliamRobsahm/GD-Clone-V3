
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

    function __construct($data = "{}") {
        try {
            $data = json_decode($data);
        } catch(Exception $e) {
            $data = new stdClass();
        }
        
        $this->background = $data?->background ?? 0;
        $this->floor = $data?->floor ?? 0;
        $this->speed = $data?->speed ?? 1;
        $this->gamemode = $data?->gamemode ?? 0;
        $this->pulseBPM = $data?->pulseBPM ?? 120;
        $this->pulseOffset = $data?->pulseOffset ?? 0;

        // Ternary just didn't work for this one?? I don't know why. It just became null.
        $this->channels = $data?->channels ?? null;
        if($this->channels == null) {
            $this->channels = '{
            "bg":{"h":230,"s":100,"l":62},
            "g":{"h":230,"s":60,"l":40}
            }';
        }

        $this->objects = $data?->objects ?? "[]";
    }
}

?>