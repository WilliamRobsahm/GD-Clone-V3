
<?php
require_once("../class/response.php");
require_once("../code/file_access.php");
require_once("../code/helper.php");

$id = required_get("id");

$path = "../../data/custom_levels/" . $id;

data_response([
    "data" => FileAccess::get_file_content($path . "/data.json"),
    "info" => FileAccess::get_file_content($path . "/info.json"),
    
]);
?>