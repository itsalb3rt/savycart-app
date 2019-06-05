<div class="container" id="register-app">
    <div class="row center-xs center-sm center-md center-lg">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <h1 style="font-size: 40px!important;font-weight: bold;">
                <a href="#" class="primary important undecoration">Sheiley Shop</a>
            </h1>
            <h5>
                <a href="#" class="warning undecoration">shopping registration application</a>
            </h5>
        </div>
    </div>
    <div class="row" style="margin-top: 60px">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="userExitst">
            <div class="panel">
                <div class="head danger text center">Este nombre de usuario ya esta registrado</div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="emailExits">
            <div class="panel">
                <div class="head danger text center">Este email ya esta registrado</div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <form action="<?= Assets::href('auth/register_user') ?>" method="POST">
                <div class="panel">
                    <div class="body">
                        <div class="input-group">
                            <h4 class="horizontal-line-text-main-container" style="font-weight: normal!important;">
                                <span class="horizontal-line-text-container">Crear cuenta</span>
                            </h4>
                            <div>
                                <input type="text" name="first_name" placeholder="Nombres" required>
                            </div>
                            <div>
                                <input type="text" name="last_name" placeholder="Apellidos" required>
                            </div>
                            <div>
                                <input type="text" name="user_name" placeholder="Nombre de usuario"
                                       v-model="userName"
                                       @change="validatedUserName"
                                       required>
                            </div>
                            <div>
                                <input type="email" name="email" placeholder="Email@domain.com"
                                       v-model="email"
                                       @change="validatedEmail"
                                       required>
                            </div>
                            <div>
                                <input type="password" name="password" placeholder="Contraseña " required>
                            </div>
                            <div>
                                <input type="password" name="password2" placeholder="Confirmar contraseña " required>
                            </div>
                        </div>
                        <div class="text center input-group">
                            <div>
                                <button type="submit"
                                        :disabled="userExitst || emailExits === true"
                                        class="button success">Crear cuenta</button>
                            </div>
                        </div>
                        <div class="panel">
                            <div class="body">
                                <div class="text small center">
                                    Ya tienes una cuenta ?&Tab;<a href="<?= Assets::href('auth/login') ?>" class="success">Inicia sesión!</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script type="text/javascript" src="<?= Assets::setAssets('js/vuejs/vue.js')?>"></script>
<script type="text/javascript" src="<?= Assets::setAssets('js/axios/axios.js')?>"></script>
<script type="text/javascript" src="<?= Assets::setAssets('js/ligne_route/ligne_route.js')?>"></script>
<script type="text/javascript" src="<?= Assets::setAssets('js/auth_app/register_app.js')?>"></script>