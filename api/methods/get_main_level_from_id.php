<?php
require_once("../class/response.php");
require_once("../code/file_access.php");
require_once("../code/helper.php");
require_once("../code/validation.php");

$id = required_get("id");

$path = "../../data/main_levels/" . $id;

Validation::check_directory($path);

data_response([
    "data" => FileAccess::get_file_content($path . "/data.json"),
    "info" => FileAccess::get_file_content($path . "/info.json"),
]);
?>