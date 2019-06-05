<?php
/**
 * Created by PhpStorm.
 * User: destroid
 * Date: 2/6/2019
 * Time: 4:57 PM
 */
use Models\User\User;
use Core\Util\ligne_sessions\SessionsController;

class AuthController extends Controller
{
    public function login(){
        $session = new SessionsController();

        if($session->get('is_login') == true){
            $this->redirect(['controller'=>'products','action'=>'list']);
        }else{
            $this->render('login','Login',false,'simple_layout');
        }
    }

    public function login_check(){
        $request = $this->easy_request();

        if($request->getMethod() == 'POST'){
            $new_login = new User();
            $user_credentials = $new_login->getUser( strtolower( $request->request->filter('user_name') ) );

            if( empty($user_credentials) === false
                && password_verify($request->request->filter('password'),$user_credentials->password)){

                $this->createUserSession($user_credentials);
                $this->redirect(['controller'=>'products','action'=>'list']);
            }else{
                $this->redirect(['controller'=>'auth','action'=>'login'],'?worng_data=true');
            }
        }
    }

    public function logout(){
        $session = new SessionsController();
        $session->destroy_all_session();
    }

    public function register(){
        $request = $this->easy_request();
        if($request->request->get('islogin') == null){
            $this->render('register','Register',false,'simple_layout');
        }
    }

    public function register_user(){
        $request = $this->easy_request();
        if($request->server->get('REQUEST_METHOD') == 'POST'){

            if(!$this->password_match($request->request->get('password'),$request->request->get('password2'))){
                $this->redirect(['controller'=>'auth','action'=>'register?bad_password=true']);
                exit();
            }

            $user_data = [
                'first_name'=>$request->request->get('first_name'),
                'last_name'=>$request->request->get('last_name'),
                'user_name'=>$request->request->get('user_name'),
                'password'=>$this->encrypt_password($request->request->get('password')),
                'email'=>$request->request->get('email'),
            ];

            $new_user = new User();

            if( $new_user->isExitsUserName($user_data['user_name'])->count > 0){
                $this->redirect(['controller'=>'auth','action'=>'register?user_exists=true']);
                exit();
            }

            if( $new_user->isExitsEmail($user_data['email'])->count > 0){
                $this->redirect(['controller'=>'auth','action'=>'register?user_exists=true']);
                exit();
            }

            $new_user->registerUser($user_data);
            $this->redirect(['controller'=>'auth','action'=>'login?create_user=true']);
        }
    }

    public function userAlreadyExists($userName){
        $request = $this->easy_request();
        if($request->server->get('REQUEST_METHOD') == 'GET'){
            $user = new User();
            if($user->isExitsUserName($userName)->count > 0){
                echo json_encode(['status'=>'true']);
            }else{
                echo json_encode(['status'=>'false']);
            }
        }
    }
    public function emailAlreadyExists(){
        $request = $this->easy_request();

        if($request->server->get('REQUEST_METHOD') == 'POST'){
            $user = new User();
            if($user->isExitsEmail($request->request->filter('email'))->count > 0){
                echo json_encode(['status'=>'true']);
            }else{
                echo json_encode(['status'=>'false']);
            }
        }
    }
    //Utils Private

    private function createUserSession(object $user){
        $session = new SessionsController();
        $session->set('id_user',$user->id_user)
            ->set('user_name',$user->user_name)
            ->set('first_name',$user->first_name)
            ->set('last_name',$user->last_name)
            ->set('email',$user->email)
            ->set('is_login','true');
    }

    private function password_match($password1,$password2){
        if($password1 == $password2)
            return true;
        else
            return false;
    }

    private function encrypt_password($password){
        return password_hash($password,PASSWORD_ARGON2I);
    }
}