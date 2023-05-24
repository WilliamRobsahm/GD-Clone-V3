
<?php
require_once("../class/level_info.php");
require_once("../class/response.php");
require_once("../code/file_access.php");
require_once("../code/validation.php");
$main_path = "../../data/created_levels";

$created_levels_info = array();

Validation::check_directory($main_path);


$dir_main = new DirectoryIterator($main_path);
foreach ($dir_main as $dir) {
    if (!$dir->isDot()) {
        $path = $main_path . "/" . $dir->getFilename() . "/info.json";
        $info = FileAccess::get_file_content($path);
        array_push($created_levels_info, get_level_info($info));
    }
}

data_response($created_levels_info);
?>