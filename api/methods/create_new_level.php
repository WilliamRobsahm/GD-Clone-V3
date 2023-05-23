<?php
require_once("../class/level_info.php");
require_once("../class/level_data.php");
require_once("../class/response.php");
$main_path = "../../data/created_levels";

$id = 0;
$path;

// Find lowest unoccupied ID
while(true) {
    $path = $main_path . "/" . $id;
    if(!is_dir($main_path . "/" . $id)) {
        break;
    }
    $id++;
}

// Create directory
mkdir($path);

$info_content = new LevelInfo();
$info_content->levelID = $id;
$data_content = new LevelData();

$f_info = fopen($path . "/info.json", "wb");
fwrite($f_info, json_encode($info_content));
fclose($f_info);

$f_data = fopen($path . "/data.json", "wb");
fwrite($f_data, json_encode($data_content));
fclose($f_data);

success_response();
?>