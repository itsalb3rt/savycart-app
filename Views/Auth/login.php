<div class="container">
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
        <?php if(isset($_GET['create_user'])): ?>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="panel">
                    <div class="head success text center">Usuario creado!</div>
                </div>
            </div>
        <?php endif; ?>
        <?php if(isset($_GET['worng_data'])): ?>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="panel">
                    <div class="head danger text center">Datos erroneos</div>
                </div>
            </div>
        <?php endif; ?>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <form action="<?= Assets::href('auth/login_check') ?>" method="POST">
                <div class="panel">
                    <div class="body">
                        <div class="input-group">
                            <h4 class="horizontal-line-text-main-container" style="font-weight: normal!important;">
                                <span class="horizontal-line-text-container">Iniciar sesión</span>
                            </h4>
                            <div>
                                <input type="text" name="user_name" placeholder="username" required>
                            </div>
                            <div>
                                <input type="password" name="password" placeholder="Password" required>
                            </div>
                        </div>
                        <div>
                            <div class="body">
                                <div class="text x-small right">
                                    <a href="#" class="important undecoration primary">Olvido su contraseña?</a>
                                </div>
                            </div>

                        </div>
                        <div class="text center input-group">
                            <div>
                                <button class="button primary">Iniciar sesión</button>
                            </div>
                        </div>
                        <div class="panel">
                            <div class="body">
                                <div class="text small center">
                                    Crear una cuenta... <a href="<?= Assets::href('auth/register') ?>" class="success">CREAR CUENTA</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>