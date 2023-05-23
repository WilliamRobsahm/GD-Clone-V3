
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
}
?>