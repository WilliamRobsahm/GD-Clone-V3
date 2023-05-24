
<?php

class FileAccess {
    static function get_file_content($path) {
        if(file_exists($path)) {
            $file = fopen($path, "r");
            if(filesize($path) > 0) {
                return fread($file, filesize($path));
            }
        } 
        return null;
    }

    static function create_file($dir_path, $file_name, $file_content) {
        $f = fopen($dir_path . "/" . $file_name, "wb");
        fwrite($f, $file_content);
        fclose($f);
    }
}
?>