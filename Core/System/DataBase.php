<?php
/**
 * Esto es un singleton para la conexion a la base de datos utilizando PDO
 **/
namespace Core\System;

use Core\System\pdox\Pdox;

class DataBase
{
    private $bdd = null;
    private $credentials;
    private $config;

    public function getBdd() {
        // Leer credenciales desde el  archivo ini
        $this->credentials = parse_ini_file(ROOT . "Config/config.php.ini");

        $this->config = [
            'host'		=> $this->credentials["host"],
            'driver'	=> $this->credentials["driver"],
            'database'	=> $this->credentials["dbname"],
            'username'	=> $this->credentials["user"],
            'password'	=> $this->credentials["pass"],
            'charset'	=> $this->credentials["charset"],
            'collation'	=> $this->credentials["collation"],
            'prefix'	=> $this->credentials["prefix"],
            'port'	=> $this->credentials["port"]
        ];

        try {
            if(is_null($this->bdd)) {
                /**
                 * Pdox es un Query Builder usado para facilitar la manera en que se
                 * hacen las consultas a la base de datos, es una clase bien completa
                 * que contiene metodos para toda clase de consultas
                **/
                require_once(ROOT . "Core/System/pdox/Pdox.php");

                $this->bdd = new Pdox($this->config);
            }
            return $this->bdd;
        }
        catch (PDOException $e) {
            error_log($e->getMessage(),0);
            echo $e->getMessage();

            echo '<h4>Code: ' . $e->getCode() . '</h4>';
            die();
        }
    }
}