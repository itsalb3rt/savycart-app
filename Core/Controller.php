<?php
/**
 * Todos los controladores creados deben heredar
 * de este controlador para el funcionamiento de los mismos ya que
 * contiene el asignamiento de los datos y el renderizado de la pantilla y vistas
 **/
use Core\Util\HttpFoundation\Request;

class Controller
{
    /**
     * Almacena los datos que se quieren pasar a la vista
     **/
    private $vars = [];
    /**
     * Contiene el nombre de la 'vista' donde se renderizaran las vistas
     **/
    private $layout = "default";

    /**
     * Esta propiedad esta definida para establecer el titulo de la pagina
     * que este a su vez es pasado por el metodo render y se utiliza en el metodo render_layout
     **/
    private $page_title;

    /**
     * fusionará todos los datos que queremos pasar a la vista.
     * Cualquier datos que le pasemos este lo envia a la vista, preferiblemente pasar arreglos.
     *
     * eje: $data['foo'] = 'bar';
     *
     * @param $data
     */
    function setData($data)
    {
        $this->vars = array_merge($this->vars, $data);
    }

    /**
     * importará los datos con el método extract y luego
     * cargará el diseño solicitado en el directorio Views. Además, esto nos
     * permite tener un diseño para evitar la estúpida repetición de HTML en nuestras vistas.
     *
     * El parametro @external_view Se utiliza para indicarle al metodo
     * @render si la vista que se esta cargando no esta dentro del ambito
     * del controlador actual, es util para cargar componentes de otras vistas
     * o otras vistas completas
     *
     * @param $filename
     * @param null $title
     * @param bool $external_view
     * @param null $other_layout
     */
    function render($filename,$title = null,$external_view = false,$other_layout = null)
    {
        extract($this->vars);
        ob_start();
        if($external_view){
            $view_file = ROOT . "Views/" . $filename . '.php';
        }else{
            $view_file = ROOT . "Views/" . ucfirst(str_replace('Controller', '', get_class($this))) . '/' . $filename . '.php';
        }

        if(file_exists($view_file))
            require($view_file);
        else
            $this->view_nonexists($filename);

        $this->page_title = $title;
        $this->layout = ($other_layout != null)? $other_layout : $this->layout;
        $content_for_layout = ob_get_clean();
        $this->render_layout($content_for_layout);
    }


    /**
     * Requiere el layout existente y dentro pasa el contenido
     * que se envio al controlador
     * @param $content_for_layout
     */
    private function render_layout($content_for_layout){
        //Se crea esta propiedad aqui para que este diponible en el layout
        $page_title = ($this->page_title != null)? $this->page_title : null ;
        if(file_exists(ROOT . "Views/Layouts/" . $this->layout . '.php')){
            require(ROOT . "Views/Layouts/" . $this->layout . '.php');
        }else {
            $this->fail_on_load_default_layout();
        }
    }

    /**
     * Retorna todas las peticiones http en una capa orientada a objeto
     * Esto reemplaza las variables $_GET, $_POST y otras variables globales
     * Esto gracias a HttpFoundation.
     *
     * @return Request
     */
    public function easy_request(){
        return new Request(
            $_GET,
            $_POST,
            array(),
            $_COOKIE,
            $_FILES,
            $_SERVER
        );
    }

    /**
     * Este metodo es utilizado para redirigir sea a un controlador
     * o a una url fuera del proyecto, tambien admite un segundo parametro opcional
     *
     * array ( 'controller'  =>  'myController' ,  'action'  =>  'foo' , [2])
     *
     * @param $redirecTo
     * @param null $param
     */
    function redirect($redirecTo,$param = null) {
        if(is_array($redirecTo)) {
            $root_dir = $_SERVER['REQUEST_URI'];
            $root_dir = explode('/',$root_dir);
            $param_ = ($param == null )? '' : '/' . $param;
            header('Location: '. PROTOCOL . '://' . $_SERVER['SERVER_NAME'] . '/' . $root_dir[1] . '/' . $redirecTo['controller'] . '/' . $redirecTo['action'] . $param_ );
        }else
            header('Location: '.$redirecTo);
    }

    private function secure_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    protected function secure_form($form)
    {
        foreach ($form as $key => $value)
        {
            $form[$key] = $this->secure_input($value);
        }
    }

    /**
     * Este metodo es llamado si el archivo con el nombre de la vista
     * no existe, muestra el usuario que la vista no existe
     * @param $filename
     */
    private function view_nonexists($filename){
        __show_dev_messages__("Error archivo vista",
            "La vista <span class='special_name_element'>' $filename '</span> no fue encontrada");
    }
    /**
     * Este metodo es solo utilizado para mostrar al usuario
     * que el layout que ha elegido no es valido en caso se no serlo
    **/
    private function fail_on_load_default_layout(){
        __show_dev_messages__("Problema al cargar el Default Layout",
            "No se ha podido cargar el layout por defecto, probablemente no este con el nombre que se ha configurado o no exista.",
            ROOT . "Views/Layouts/" . $this->layout . '.php');
    }

}