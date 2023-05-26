<?php
require_once("../class/response.php");

class Validation {
    static function check_directory($path) {
        if(!is_dir($path)) {
            error_response("Invalid path: " . $path);
        }
    }

    static function require_properties($object, $propertyNameList) {
        foreach($propertyNameList as $prop) {
            if(!property_exists($object, $prop)) {
                error_response("Missing property: '" . $prop . "'");
            }
        }
    }
}
?>