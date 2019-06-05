<?php
/**
 * El despachador está haciendo el mismo trabajo que un controlador de tránsito aéreo.
 * Cuando se carga una nueva solicitud, selecciona el controlador y la
 * acción con parámetros. Entonces, con un solo método (dispatch ()),podemos
 * iniciar toda esta lógica de enrutamiento.
 *
 *  http://host/controller/action/[parameter]
 *
**/
class Dispatcher
{

    private $request;

    public function dispatch()
    {
        $this->request = new Request();
        Router::parse($this->request->url, $this->request);
        $controller = $this->loadController();
        $this->is_empty_action($this->request->action);
        if(method_exists($controller, $this->request->action)){
            call_user_func_array([$controller, $this->request->action], $this->request->params);
        }else{
            Router::show_action_no_exists($this->request->action);
        }

    }

    /**
     * Carga un controlador segun la URL solicitada
     * @return mixed
     */
    public function loadController()
    {
        $name = $this->request->controller . "Controller";
        $file = ROOT . 'Controllers/' . ucfirst($name) . '.php';
        if(file_exists($file)){
            require($file);
            $controller = new $name();
            return $controller;
        }
        else
            Router::show_nonexistent_controller($this->request->controller);
    }

    /**
     * Se utiliza para saber si la variable que contiene la accion
     * Esta vacia, de estar vacia no se ha ingresado una accion valida
     * o metodo del controlador
     * @param $action [Metodo del controlador]
     *
     * @return bool
     */
    public function is_empty_action($action){
        if(empty($action)){
           Router::show_invalid_action();
        }
    }

}