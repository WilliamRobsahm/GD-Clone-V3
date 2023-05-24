
<?php

function success_response($msg = null, $data = null) {
    $r = new Response();
    $r->status = "OK";
    $r->message = $msg ?? "Operation successful";
    $r->data = $data;
    die(json_encode($r));
}

function error_response($msg = null) {
    $r = new Response();
    $r->status = "Error";
    $r->message = $msg ?? "Something went wrong";
    die(json_encode($r));
}

function data_response($data = null) {
    $r = new Response();
    $r->status = "OK";
    $r->data = json_encode($data);
    die(json_encode($r));
}


class Response {
    public $status;
    public $message;
    public $data;
}
?>