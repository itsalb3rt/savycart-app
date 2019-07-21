<template>
  <v-container>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <p class="display-3 primary--text text-xs-center">Sheiley Shop</p>
        <p class="warning--text text-xs-center">shopping registration application</p>
      </v-flex>
      <v-flex xs12 class="white--text" v-if="userExitst">
        <v-card flat dark color="error" class="text-xs-center">
          <v-card-text class="subheading">Este nombre de usuario ya esta registrado</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 class="white--text" v-if="emailExits">
        <v-card flat dark color="error" class="text-xs-center">
          <v-card-text class="subheading">Este email ya esta registrado</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap align-center justify-center class="white">
      <v-flex xs12>
        <form @submit.prevent="registerUser">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span class="horizontal-line-text-container white">
                    <span class="black--text">Crear cuenta</span>
                  </span>
                </h4>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="firstName" label="Nombres" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="lastName" label="Apellidos" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="userName"
                  @change="validatedUserName"
                  label="Nombre de usuario"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="email"
                  @change="validatedEmail"
                  label="Email@domain.com"
                  type="email"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  @click:append="showPassword = !showPassword"
                  label="Password"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="password2"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  @click:append="showPassword = !showPassword"
                  label="Confirmar contraseña"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex x12>
                <v-btn
                  type="submit"
                  color="success"
                  :disabled="userExitst === true || emailExits === true || disabledSubmitButton === true"
                  block
                >Crear cuenta</v-btn>
              </v-flex>
              <v-flex x12 class="mt-4">
                Ya tienes una cuenta ?
                <v-btn color="primary" flat small class="ma-0 pa-0" to="/login">Inicia sesión!</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  mounted: function() {
    if (this.isLoged == "true") {
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
      disabledSubmitButton: false,
      showPassword: false
    };
  },
  computed: {
    ...mapState(["apiDomain", "user", "isLoged"])
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