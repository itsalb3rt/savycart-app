<template>
  <v-container>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <p class="display-3 primary--text text-xs-center">Sheiley Shop</p>
        <p class="warning--text text-xs-center">shopping registration application</p>
      </v-flex>
    </v-layout>
    <v-flex xs12 class="white--text" v-if="loginFailed">
      <v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
    </v-flex>
    <v-flex xs12 class="white--text" v-if="this.$route.query.create_user !== undefined">
      <v-alert type="success" :value="true">{{ $t('auth.the_user_was_created') }}</v-alert>
    </v-flex>
    <v-flex xs12>
      <v-form method="POST" @submit.prevent="login">
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex x12>
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span class="horizontal-line-text-container font-weight-bold" style="background-color:#fafafa">
                    <span class="black--text">{{ $t('auth.login_title') }}</span>
                  </span>
                </h4>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="userName" :label=" $t('auth.user_name') " required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  @click:append="showPassword = !showPassword"
                  :label=" $t('auth.password') "
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="pt-2 pb-2">
                <v-btn color="primary" flat small class="ma-0 pa-0" href="#">{{ $t('auth.forgot_your_password') }}</v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn color="primary" type="submit" block>{{ $t('auth.login') }}</v-btn>
              </v-flex>
              <v-flex xs12 class="pt-3">
                <v-btn color="primary" flat small class="ma-0 pa-0" to="/register">{{ $t('auth.create_an_account') }}</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
  </v-container>
</template>

<script>
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
      showPassword: false
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

      this.axios({
        method: "POST",
        url: route,
        data: data
      })
        .then(response => {
          if (response.data.status == "login_correct") {
            this.setUser(response.data.user);
            this.setLoginState(true);
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
<style>
.horizontal-line-text-main-container {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid lightgray;
    line-height: .1em;
    margin: 10px 0 20px
}

.horizontal-line-text-main-container .horizontal-line-text-container {
    padding: 0 10px
}
</style>
