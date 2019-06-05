<?php
/**
 * Created by PhpStorm.
 * User: destroid
 * Date: 5/6/2019
 * Time: 2:15 PM
 */
use Core\Util\ligne_sessions\SessionsController;

class ProductsController extends Controller
{

    public function __construct()
    {
        $session = new SessionsController();
        if($session->get('id_user') == false){
            $this->redirect(['controller'=>'auth','action'=>'login']);
        }
    }

    public function list(){
        $session = new SessionsController();
        var_dump($session->get_all());
    }
}