<?php
/**
 * El objetivo de este archivo es obtener la URL solicitada por el usuario.
 */

class Request
{
    public $url;

    public function __construct()
    {
        $this->url = $_SERVER["REQUEST_URI"];
    }
}
