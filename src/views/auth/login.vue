<template>
  <v-container>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <p class="display-3 primary--text text-xs-center">Sheiley Shop</p>
        <p class="warning--text text-xs-center">shopping registration application</p>
      </v-flex>
      <v-flex xs12 class="white--text" v-if="loginFailed">
        <v-card flat dark color="error" class="text-xs-center">
          <v-card-text class="subheading">Datos erroneos</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 class="white--text" v-if="this.$route.query.create_user !== undefined">
        <v-card flat dark color="success" class="text-xs-center">
          <v-card-text class="subheading">Usuario creado!</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <v-form method="POST" @submit.prevent="login">
          <v-card flat>
            <v-card-text>
              <v-container>
                <v-layout row wrap>
                  <v-flex x12>
                    <h4
                      class="horizontal-line-text-main-container"
                      style="font-weight: normal!important;"
                    >
                      <span class="horizontal-line-text-container white">
                        <span class="black--text">Iniciar sesión</span>
                      </span>
                    </h4>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="userName" label="Nombre usuario" required></v-text-field>
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
                  <v-flex xs12 class="pt-2 pb-2">
                    <v-btn
                      color="primary"
                      flat
                      small
                      class="ma-0 pa-0"
                      href="#"
                    >Olvido su contraseña?</v-btn>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn color="primary" type="submit" block>Iniciar sesión</v-btn>
                  </v-flex>
                  <v-flex xs12 class="pt-3">
                    Crear una cuenta...
                    <v-btn color="primary" flat small class="ma-0 pa-0" to="/register">CREAR CUENTA</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import curriencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [curriencies],
  mounted: function() {
    if (this.isLoged == true) {
      this.$router.push("product/list");
    }
  },
  data: function() {
    return {
      userName: "",
      password: "",
      loginFailed: false,
      showPassword:false
    };
  },
  computed: {
    ...mapState(["apiDomain", "user", "isLoged"])
  },
  methods: {
    ...mapMutations(["setUser", "setLoginState"]),
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
          if (response.data.status == "login_correct") {
            this.setUser(response.data.user);
            this.setLoginState("true");
            this.saveInIndexedDbCurrencies();
            this.$router.push("product/list");
          } else if (response.data.status == "login_failed") {
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