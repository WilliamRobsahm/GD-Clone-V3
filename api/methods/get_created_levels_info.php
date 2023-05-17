
<?php
require_once("../code/file_access.php");
$main_path = "../../data/created_levels";

$created_levels_info = array();

$dir_main = new DirectoryIterator($main_path);
foreach ($dir_main as $dir) {
    if (!$dir->isDot()) {
        $path = $main_path . "/" . $dir->getFilename() . "/info.json";
        $info = FileAccess::get_file_content($path);
        array_push($created_levels_info, $info);
    }
}

echo json_encode($created_levels_info);
?>