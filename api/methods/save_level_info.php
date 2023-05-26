<?php
require_once("../class/response.php");
require_once("../code/file_access.php");
require_once("../code/helper.php");
require_once("../code/validation.php");

$info = required_get("info");
$info = json_decode($info);
$path = "../../data/created_levels/" . $info->id . "/info.json";

Validation::require_properties($info, ["id", "songId", "title", "description", "difficulty", "duration"]);

$saved_info = new stdClass();

$saved_info->title = $info->title;
$saved_info->levelID = $info->id;
$saved_info->songID = $info->songId;
$saved_info->description = $info->description;
$saved_info->difficulty = $info->difficulty;
$saved_info->duration = $info->duration;

FileAccess::set_file_content($path, json_encode($saved_info));

success_response("Successfully saved level info");
?>