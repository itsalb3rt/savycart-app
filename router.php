<?php
/**
 * Esta clase controla inclusive si en la url se ha ingresado un controlador
 * inexistente o un metodo del controlador que no existe con la siguiente jerarquía:
 *
 * http://host/controller/action/[parameter]
 *                  ^        ^
 *            1ro verifica   2da verifica
 *
 * Hasta que la primera condicion de este no se da, no continua, siendo esta una manera
 * se asegurarse de que el controlador este correcrto para poder verificar
 * que el metodo sea parte de ese controlador.
 *
 * El enrutador toma la url capturada por request.php y explota la url en 3
 * partes diferentes en el carácter "/":
 *
 **/
class Router
{
    /**
     * Las variables @projectDir y @offSet se incluyeron en la actualizacion del 20/02/2019 para
     * que el framework pueda estar en cualquier directorio o subdirectorio del servidor
     *
     * Esto analiza en que nivel de la URLI estan el contorlador, la accion y los parametros
     *
     * @param $url
     * @param $request
     */
    static public function parse($url, $request){
        $url = strtok(trim($url),'?');
        $explode_url = explode('/', $url);

        $projectDir = explode('/',ROOT);
        $offSet = count($projectDir)-3;

        $explode_url = array_slice($explode_url, $offSet);
        if ($url == '/' . self::root_dir() . '/' || strlen($explode_url[0]) == 0 )
            self::load_index($request);
        elseif(self::is_array_url_valid($explode_url))
            self::route_construct($request,$explode_url);
        else
            self::show_nonexistent_controller($explode_url[0]);
    }

    /**
     * Constuye la url si esta es valida, digase que exista el controlador
     * y su accion
     * @param $request
     * @param $explode_url
     */
    static private function route_construct($request, $explode_url){
        $request->controller = $explode_url[0];
        $request->action = $explode_url[1];
        $request->params = array_slice($explode_url, 2);
    }
    /**
     * Carga el index de la aplicacion esto puede ser configurado
     * para que el usuario vea el index que se desea con solo cambiar el controller y
     * el action que se desea vea el usuario
     * @param $request
     */
    static public function load_index($request){
        $request->controller = "Default";
        $request->action = "index";
        $request->params = [];
    }
    /**
     * Verifica que la $url sea un arreglo de 2 o mas posiciones para obtener
     * una url valida
     * eje: http://localhost/ligne_php/Controller/Action/[parameter]
     *                                  ^          ^
     *                                $url[0]     $url[1]
     * @param $url Array
     *
     * @return bool
     */
    static private function is_array_url_valid($url){
        if (count($url) > 1)
            return true;
        else
            return false;
    }
    /**
     * Retorna el nombre de la carpeta base del proyecto
     * esto es relativo ya que la carpeta donde esta el framework podria
     * llamarse de cualquier manera y con esto se obtiene este nombre
     *
     * @return string
     */
    static private function root_dir(){
        $root_dir = $_SERVER['REQUEST_URI'];
        $root_dir = explode('/',$root_dir);
        return $root_dir[1];
    }
    /**
     * Muestra una pantalla cuando en la ruta se ha insertado un
     * controller que no existe
     */
    static public function show_nonexistent_controller($controller_name = null){
        __show_dev_messages__("El controlador no existe",
            "Debe verificar la ruta que ha insertado, en realidad tiene un controlador con el nombre <span class='special_name_element'>$controller_name</span>",$_SERVER['REQUEST_URI']);
    }

    /**
     * Muestra al usuario que la accion requerida esta vacia, no existe o es incorrecta
     */
    static public function show_invalid_action(){
        __show_dev_messages__("Acción  inexistente para la url",
            "Puede que este intentado realizar una acción que no exista, por ejemplo, para un controlador foo que tenga una acción bar la ruta seria http://dominio/foo/bar",
            $_SERVER['REQUEST_URI']);
    }

    /**
     * Muestra al usuario que el metodo del controlador no existe
     * @param $method String
     */
    static public function show_action_no_exists($method){
        __show_dev_messages__("La acción ' " . $method . " ' no existe",
            "La acción solicitada al parecer no existe en el controlador");
    }
}