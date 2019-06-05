<?php
/**
 * Created by PhpStorm.
 * User: Usuario
 * Date: 1/10/2018
 * Time: 3:34 PM
 */

/**
 * Esta clase es practicamente para ejemplos, se recomienda dejarla intacta
 * generalmente se utiliza para asegurarse que el framework esta funcionando correctamente
**/

class DefaultController extends Controller
{
    /**
     * Default index, se usa para ejemplo
     */
    public function index()
    {
        $data['framework_name'] = "Ligne Framework";
        $data['version'] = "v1.4";
        $data['environment'] = "Dev";
        $data['date'] = "Feb 2019";
        $data['external_components_included'] = "HttpFoundation";
        $data['autor'] = "Albert Eduardo Hidalgo Taveras";
        $this->setData($data); //envia datos a la vista
        $this->render("index",'Welcome!'); //Renderiza la vista
    }
}