<?php
require_once("../class/response.php");

/**
 * A collection of functions that check a condition, and gives an error response if the condition is not met.
 * Used in various API methods to verify input data, file paths, etc.
 */
class Validation {
    static function check_directory($path) {
        if(!is_dir($path)) {
            error_response("Invalid path: " . $path);
        }
    }

    static function check_file($path) {
        if(!is_file($path)) {
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