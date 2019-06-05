<?php
/**
 * Clase para el manejo de sesiones, es una capa de abstraccion
 * para un manejo mas amigable
 *
 * Autor: Albert Eduardo Hidalgo Taveras
 * Github: https://github.com/itsalb3rt
 * Fecha: 2018-12-19
 **/

namespace Core\Util\ligne_sessions;

class SessionsController
{
    public function __construct()
    {
        if(!$this->is_session_started_before()){
            session_start();
        }
    }

    /**
     * Retorna los datos de la sesion segun el @key especificado
     * De no existir retorna null
     * @param $key
     * @return mixed
     */
    public function get($key){
        if($this->session_exists($key)){
            return $_SESSION[$key];
        }
    }

    public function id(){
        if($this->is_session_started_before()){
            return session_id();
        }
    }

    /**
     * @param $key
     * @return SessionsController
     */
    public function remove($key){
        if(is_array($key)){
            $this->remove_group_session($key);
        }else{
            $this->remove_single_session($key);
        }
        return $this;
    }

    /**
     * Este metodo es utilizado por @remove
     * @param $key
     */
    private function remove_single_session($key){
        if($this->session_exists($key)){
            unset($_SESSION[$key]);
        }
    }

    /**
     * Este metodo es utilizado por @remove
     * @param $array
     */
    private function remove_group_session($array){
        foreach ($array as $key => $value){
            if($this->session_exists($value)){
                $this->remove_single_session($value);
            }
        }
    }

    /**
     * Este metodo tiene 2 razones de existir;
     * @Primero
     * Iniciar los datos de
     * sessiones osea los datos del usuario según un arreglo desde la
     * base de datos.
     *
     * @segundo
     * Generar sesiones personalizadas con datos
     * de preferencia por el programador
     *
     * @ejemplo: Alamacenar datos que no sea necesario tener en la base
     * de datos, pasar datos de una pagina a otra, etc...
     *
     * @recomendaciones
     * Utilizar en algun ciclo para ahorrar escribir lo mismo en varias
     * lienas de codigo
     *      foreach($algo as $key => $value){
     *          $session->set_session($key,$value
     *      }
     *
     * @param $key
     * @param $value
     * @param null $expired
     * @return SessionsController
     */
    public function set($key, $value, $expired = null){
            $_SESSION[$key] = trim($value);
        return $this;
    }

    /**
     * @return array|null
     */
    public function get_all(){
        if($this->is_session_null() == false){
            $sessions = [];
            foreach($_SESSION as $key => $value){
                $sessions[$key] = $value;
            }
            return $sessions;
        }else{
            return null;
        }
    }

    /**
     * Elimina toda las sesiones actuales y destruye la sesion
     * se realiza una verificacion para asegurarse que el array
     * @_SESSION no este vacio
     */
    public function destroy_all_session(){
        session_unset();
        session_destroy();
    }

    /**
     * @param $key
     * @return bool
     */
    private function session_exists($key){
        if(isset($_SESSION[$key])){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Se utiliza en el constructor para saber si se inicia
     * una sesion nueva o no de inicia ninguna
     * @return bool
     */
    private function is_session_started_before(){
        if(session_status() == 2 || session_status() == 'PHP_SESSION_ACTIVE'){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Es utilizado el el metro de destruccion de sessiones
     * para evitar una llamada en un ciclo sobre un arreglo
     * sin datos
     * @return bool
     */
    private function is_session_null(){
        if(count($_SESSION) == 0){
            return true;
        }else{
            return false;
        }
    }
}