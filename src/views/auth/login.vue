<template>
  <div>
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
      <div
        class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
        v-if="this.$route.query.create_user !== undefined"
      >
        <div class="panel">
          <div class="head success text center">Usuario creado!</div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="loginFailed">
        <div class="panel">
          <div class="head danger text center">Datos erroneos</div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <form
          action="<?= Assets::href('auth/login_check') ?>"
          method="POST"
          @submit.prevent="login"
        >
          <div class="panel">
            <div class="body">
              <div class="input-group">
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span class="horizontal-line-text-container">Iniciar sesión</span>
                </h4>
                <div>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="username"
                    v-model="userName"
                    required
                  >
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    v-model="password"
                    required
                  >
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
                    Crear una cuenta...
                    <router-link
                      to="/register"
                      :class="['important','primary','undecoration']"
                    >CREAR CUENTA</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState,mapMutations } from "vuex";

export default {
  mounted:function(){
    if(this.isLoged == 'true'){
      this.$router.push('product/list');
    }
  },
  data: function() {
    return {
      userName: "",
      password: "",
      loginFailed:false
    };
  },
  computed: {
    ...mapState(['apiDomain','user','isLoged'])
  },
  methods: {
    ...mapMutations(['setUser','setLoginState']),
    login() {
      let route = `${this.apiDomain}/auth/login_check`;
      let data = new FormData();

      data.append("user_name", this.userName);
      data.append("password", this.password);

      axios({
        method: "POST",
        url: route,
        data: data
      })
        .then(response => {
          if(response.data.status == 'login_correct'){
            this.setUser(response.data.user);
            this.setLoginState('true');
            this.$router.push('product/list');
          }else if(response.data.status == 'login_failed'){
            this.loginFailed = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>