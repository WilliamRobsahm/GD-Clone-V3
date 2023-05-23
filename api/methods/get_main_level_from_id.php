
<?php
require_once("../class/response.php");
require_once("../code/file_access.php");
if(!isset($_GET["id"])) {
    error_response();
}

$id = $_GET["id"];

$data_path = "../../data/main_levels/" . $id . "/data.json";
$info_path = "../../data/main_levels/" . $id . "/info.json";

data_response([
    "data" => FileAccess::get_file_content($data_path),
    "info" => FileAccess::get_file_content($info_path),
]);
?>