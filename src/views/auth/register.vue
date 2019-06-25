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
        <form
          action="<?= Assets::href('auth/register_user') ?>"
          method="POST"
          @submit.prevent="registerUser"
        >
          <div class="panel">
            <div class="body">
              <div class="input-group">
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span class="horizontal-line-text-container">Crear cuenta</span>
                </h4>
                <div>
                  <input
                    type="text"
                    name="first_name"
                    v-model="firstName"
                    placeholder="Nombres"
                    required
                  >
                </div>
                <div>
                  <input
                    type="text"
                    name="last_name"
                    v-model="lastName"
                    placeholder="Apellidos"
                    required
                  >
                </div>
                <div>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Nombre de usuario"
                    v-model="userName"
                    @change="validatedUserName"
                    required
                  >
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email@domain.com"
                    v-model="email"
                    @change="validatedEmail"
                    required
                  >
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    v-model="password"
                    placeholder="Contraseña "
                    required
                  >
                </div>
                <div>
                  <input
                    type="password"
                    name="password2"
                    placeholder="Confirmar contraseña"
                    v-model="password2"
                    required
                  >
                </div>
              </div>
              <div class="text center input-group">
                <div>
                  <button
                    type="submit"
                    :disabled="userExitst === true || emailExits === true || disabledSubmitButton === true"
                    class="button success"
                  >Crear cuenta</button>
                </div>
              </div>
              <div class="panel">
                <div class="body">
                  <div class="text small center">
                    Ya tienes una cuenta ?&Tab;
                    <router-link to="/login" :class="['success']">Inicia sesión!</router-link>
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
import { mapState } from "vuex";

export default {
  mounted: function() {
    if (this.isLoged == 'true') {
      this.$router.push("product/list");
    }
  },
  data: function() {
    return {
      userExitst: false,
      emailExits: false,
      userName: null,
      email: null,
      firstName: null,
      lastName: null,
      password: null,
      password2: null,
      disabledSubmitButton: false
    };
  },
  computed: {
    ...mapState(['apiDomain', 'user','isLoged'])
  },
  methods: {
    validatedUserName() {
      let route = `${this.apiDomain}/auth/userAlreadyExists/${this.userName}`;
      axios({
        method: "get",
        url: route
      })
        .then(response => {
          if (response.data.status == "true") {
            this.userExitst = true;
          } else {
            this.userExitst = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    validatedEmail() {
      let route = `${this.apiDomain}/auth/emailAlreadyExists`;
      let data = new FormData();
      data.append("email", this.email);
      axios({
        method: "POST",
        url: route,
        data: data
      })
        .then(response => {
          if (response.data.status == "true") {
            this.emailExits = true;
          } else {
            this.emailExits = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    registerUser() {
      this.disabledSubmitButton = true;
      let route = `${this.apiDomain}/auth/register_user`;
      let data = new FormData();

      data.append("first_name", this.firstName);
      data.append("last_name", this.lastName);
      data.append("user_name", this.userName);
      data.append("email", this.email);
      data.append("password", this.password);
      data.append("password2", this.password2);

      axios({
        method: "POST",
        url: route,
        data: data
      })
        .then(response => {
          if (response.data.status == "register") {
            this.$router.push({
              path: "login",
              query: { create_user: "created" }
            });
          } else if (response.data.status == "user_exists") {
            this.disabledSubmitButton = false;
            this.userExitst = true;
          } else if (response.data.status == "email_exists") {
            this.disabledSubmitButton = false;
            this.emailExits = true;
          }
        })
        .catch(function(error) {
          this.disabledSubmitButton = false;
          console.log(error);
        });
    }
  }
};
</script>