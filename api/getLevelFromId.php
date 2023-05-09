
<?php

if(!isset($_GET["id"])) {
    die("error");
}
$id = $_GET["id"];

$path = "../data/levels/" . $id . "/data.json";

if(file_exists($path)) {
    $file = fopen($path, "r");
    $info = fread($file,filesize($path));
    echo $info;
}
?>