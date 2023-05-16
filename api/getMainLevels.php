
<?php
$main_path = "../data/main_levels";

$level_data = array();

$dir_main = new DirectoryIterator($main_path);
foreach ($dir_main as $dir) {
    if (!$dir->isDot()) {
        $path = $main_path . "/" . $dir->getFilename() . "/info.json";

        if(file_exists($path)) {
            $file = fopen($path, "r");
            $info = fread($file,filesize($path));
            array_push($level_data, $info);
        }
    }
}

echo json_encode($level_data);
?>