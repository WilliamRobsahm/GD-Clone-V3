<?php
require_once("../class/level_info.php");
require_once("../class/level_data.php");
require_once("../class/response.php");
require_once("../code/file_access.php");

$main_path = "../../data/custom_levels";
Validation::check_directory($main_path);

$id = 0;
$path;

try {
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

    // Prepare file content
    $info_content = new LevelInfo();
    $info_content->levelID = $id;
    $data_content = new LevelData();

    // Create files
    FileAccess::create_file($path, "info.json", json_encode($info_content));
    FileAccess::create_file($path, "data.json", json_encode($data_content));

    success_response(null, $id);
} catch(Exception $e) {
    error_response($e);
}
?>