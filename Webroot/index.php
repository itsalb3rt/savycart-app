<?php
/**
 * WebRoot Es el archivo que enlaza todos los mecanismos globales del Framework
 **/

/**
 * Verifica la version del servidor, las versiones debajo de la 7.1.3 no soportan
 * ciertas caracteristicas como la palabra recervada const en propiedades de clases.
 **/
if(version_compare(PHP_VERSION, '7.1.3', '>=') == false ){
    echo '<meta charset="UTF-8">';
    echo '<title>Versión | Error</title>';
    echo '<div style="margin: auto;text-align: center;font-family: sans-serif;margin-top: 70px;">';
    echo '<h1>Versión no compatible</h1>';
    echo '<h3>La versión de PHP que está utilizando no es compatible con LIGNE, favor utilizar una versión igual o superior a 7.1.3</h3>';
    echo '</div>';
    die();
}

//Constantes
define('WEBROOT', str_replace("Webroot/index.php", "", $_SERVER["SCRIPT_NAME"]));
define('ROOT', str_replace("Webroot/index.php", "", $_SERVER["SCRIPT_FILENAME"]));
/**
 * Esta constante define el protocolo utilizado en el momento, es utilizado principlamente para
 * agregar los assets y el redireccionamiento con el metodo del Controller principal
 **/
define('PROTOCOL','http');
/**
 * Esta constante se define para determinar en que entorno se encuentra la aplicacion usando
 * el framework, esto para evitar mostrar errores no deseados a los usuarios cuando
 * el sistema esta en produccion
 **/
define('ENVIROMENT','dev');

/**
 * Esta funcion es utilizada para mostrar los errores mas comunes en una vista
 * mas amigable para el desarrollador, no deberia estar en modo de produccion ya que
 * prodria revelar datos que usted no desea que los usuarios sepan
 *
 * Acceso a base de datos, rutas, nombre de clases, directorios, etc...
 **/
function __show_dev_messages__($header,$description,$route = null){
    if(ENVIROMENT == 'dev'){
        ob_clean (); //Limpia lo que sea que este antes de esta salida
        include (ROOT . 'Core/System/Core/pages_messages/Views/code_messages/messages.php');
        die();
    }else{
        include (ROOT . 'Core/System/Core/pages_messages/Views/for_production_page/index.html');
        die();
    }
}

//algunos archivos

/**
 * Carga todas las clases que se utilicen con la
 * palabra clase use, esto es gracias al namespace
 **/
require_once(ROOT . 'Core/System/Core/autoload.php');
/**
 * El el nucleo centrar el framework, carga clases escenciales
 * para el funcionamiento
 **/
require_once(ROOT . 'Core/System/Core/core.php');
require_once(ROOT . 'router.php');
require_once(ROOT . 'request.php');
require_once(ROOT . 'dispatcher.php');
require_once(ROOT . 'Core/Assets.php');
//Uses
use Core\System\Core\errorHandler\ErrorHandler;

new ErrorHandler();

$dispatch = new Dispatcher();
$dispatch->dispatch();
