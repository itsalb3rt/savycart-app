<template>
  <v-container>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <p class="display-3 primary--text text-xs-center">Sheiley Shop</p>
        <p class="warning--text text-xs-center">shopping registration application</p>
      </v-flex>
    </v-layout>

    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <form @submit.prevent="registerUser">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span
                    class="horizontal-line-text-container white"
                    style="background-color:#fafafa"
                  >
                    <span class="black--text">{{$t('auth.create_an_account')}}</span>
                  </span>
                </h4>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="newUser.first_name" :label=" $t('auth.first_name') " required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="newUser.last_name" :label=" $t('auth.last_name') " required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="newUser.user_name"
                  @change="validatedUserName"
                  :label=" $t('auth.user_name') "
                  @keyup="purifyUserName"
                  required
                ></v-text-field>
                <div xs12 v-if="userExitst">
                  <p class="error--text">{{ $t('auth.user_name_already_registered') }}</p>
                </div>
                <div xs12 v-if="!isUserNameValid">
                  <p class="error--text">{{ $t('messages.invalid_input') }} {{$t('auth.user_name')}}</p>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="newUser.email"
                  @change="validatedEmail"
                  :label=" $t('auth.email') "
                  placeholder="jhon@domain.com"
                  type="email"
                  required
                ></v-text-field>
                <div color="error" v-if="emailExits">
                  <p  class="error--text">{{ $t('auth.email_already_registered') }}</p>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="newUser.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  @click:append="showPassword = !showPassword"
                  :label=" $t('auth.password') "
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="newUser.password2"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  @click:append="showPassword = !showPassword"
                  :label=" $t('auth.second_password') "
                  required
                ></v-text-field>
              </v-flex>
              <v-flex x12>
                <v-btn
                  type="submit"
                  color="success"
                  :disabled="userExitst === true || emailExits === true || disabledSubmitButton === true || isUserNameValid === false"
                  block
                >{{ $t('auth.create_an_account') }}</v-btn>
              </v-flex>
              <v-flex x12 class="mt-4">
                {{ $t('auth.do_you_already_have_an_account') }}?
                <v-btn
                  color="primary"
                  flat
                  small
                  class="ma-0 pa-0"
                  to="/login"
                >{{ $t('auth.login') }}!</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapState } from "vuex";

export default {
  mounted: function() {
    if (this.$store.getters['auth/getIsLogged']) {
      this.$router.push("product/list");
    }
  },
  data: function() {
    return {
      newUser:{
        user_name:'',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email:''
      },
      userExitst: false,
      emailExits: false,
      disabledSubmitButton: false,
      showPassword: false,
      regex: '^[a-z0-9_-]{3,15}$',
    };
  },
  computed: {
    ...mapState([ "user"]),
    isUserNameValid(){
      return /^[a-z0-9_-]{3,15}$/.test(this.userName);
    }
  },
  methods: {
    validatedUserName() {
      let route = `${this.apiDomain}/auth/userAlreadyExists/${this.userName}`;
      this.axios({
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
      this.axios({
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

      data.append("first_name", this.firstName);
      data.append("last_name", this.lastName);
      data.append("user_name", this.userName);
      data.append("email", this.email);
      data.append("password", this.password);
      data.append("password2", this.password2);

      this.$store.dispatch('auth/register')
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
    },
    purifyUserName(){
      this.userName = this.userName.toLowerCase();
    }
  }
};
</script>
<style>
.horizontal-line-text-main-container {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid lightgray;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

.horizontal-line-text-main-container .horizontal-line-text-container {
  padding: 0 10px;
}
</style>