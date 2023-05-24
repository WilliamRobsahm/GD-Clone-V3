<?php
class Validation {
    static function check_directory($path) {
        if(!is_dir($path)) {
            error_response("Invalid path: " . $path);
        }
    }
}
?>