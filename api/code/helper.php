<?php
function required_get($key) {
    if(!isset($_GET[$key])) {
        error_response("Missing required parameter - " . $key);
    }
    return $_GET[$key];
}

function required_post($key) {
    if(!isset($_POST[$key])) {
        error_response("Missing required parameter - " . $key);
    }
    return $_POST[$key];
}
?>