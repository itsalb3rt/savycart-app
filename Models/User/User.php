<?php
/**
 * Created by PhpStorm.
 * User: destroid
 * Date: 2/6/2019
 * Time: 7:45 PM
 */

namespace Models\User;


use Core\Model;

class User extends Model
{
    /**
     * @param $user | Array
     */
    public function registerUser(Array $user):void {
        $this->getBdd()
            ->table('users')
            ->insert($user);
    }

    public function isExitsUserName(String $userName):object {
        return $this->getBdd()
            ->count('id_user','count')
            ->table('users')
            ->where('user_name','=',$userName)
            ->get();
    }

    public function isExitsEmail(String $email):object {
        return $this->getBdd()
            ->count('id_user','count')
            ->table('users')
            ->where('email','=',$email)
            ->get();
    }

    public function getUser($userName){
        return $this->getBdd()
            ->table('users')
            ->where('user_name','=',$userName)
            ->get();
    }

}