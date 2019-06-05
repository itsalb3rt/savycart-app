<?php
/**
 * Created by PhpStorm.
 * User: Albert Eduardo Hidalgo Taveras
 * Date: 26/10/2018
 * Time: 11:31 PM
 *
 * Auto cargador de clases, esta funcion utiliza
 * el namespace de las clases para buscarlas en el directorio
 * en el que esten, tener pendiente que si el namespace esta mal,
 * no se localizara la clase
 */

spl_autoload_register('_autoload');

// Constante para reemplazar el slash invertido del namespace
define('DS','/');

function _autoload( $class ) {
    $class = ROOT  . str_replace("\\",DS,$class) . '.php';

    if(!file_exists($class)){
        //echo "Error al cargar la clase " . $class;
        __show_dev_messages__("Error al cargar clase","No se ha podido cargar <span class='special_name_element'>$class</span> empiece verificando; <div>
<ul>
<li>Si ha hecho uso de una clase que existe</li>
<li>No ha hecho uso de la clase en el encabezado del archivo (palabra clave <span class='special_name_element'>use foo\bar;</span>)</li>
<li><span class='code'>namespace</span> de la clase que esta intentando instanciar esta correcto ?</li>
</ul>
</div>");
        die();
    }else{
        require_once($class);
    }
}
