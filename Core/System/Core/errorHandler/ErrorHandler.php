<?php

namespace Core\System\Core\errorHandler;
/**
 * Captura los errores comunes que pueden ocurrir
 * dentro de un proyecto, esto no manja todos los errores del framework ya que
 * otras cosas especificas como errores al pasar un url
 * o errore de archivo de vista son manejados desde el controlador
 * principal
**/
class ErrorHandler
{

    public function __construct()
    {
        set_error_handler([$this, 'errorHandler']);
    }

    public function errorHandler($errno, $errstr, $errfile, $errline)
    {
        if($this->is_notice($errno) || $this->is_warning($errno) || $this->is_fatal_error($errno)){
            $file_without_root_dir = str_replace(str_replace(DS,'\\',ROOT),'',$errfile);
            __show_dev_messages__($errstr, "<span class='code'>$errstr</span> " . $file_without_root_dir  . " <span class='code'>on line $errline</span>");
        }
    }

    private function is_notice($errno){
        switch ($errno){
            case E_NOTICE:
            case E_USER_NOTICE:
            case E_DEPRECATED:
            case E_USER_DEPRECATED:
            case E_STRICT:
                return true;
        }
    }
    private function is_warning($errno){
        switch ($errno){
            case E_WARNING:
            case E_USER_WARNING:
                return true;
        }
    }

    private function is_fatal_error($errno){
        switch ($errno){
            case E_ERROR:
            case E_USER_ERROR:
            case E_RECOVERABLE_ERROR:
                return true;
        }
    }
}
