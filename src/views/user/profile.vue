<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 class="edit-form" v-if="online">
        <v-container class="white">
          <v-form autocomplete="off">
            <p class="mb-2 mt-2">{{ $t('messages.basic') }}</p>
            <v-text-field
              id="first-name"
              v-model="localUser.firstName"
              :label=" $t('auth.first_name') "
              placeholder="Albert Eduardo"
              required
            ></v-text-field>
            <v-text-field
              id="last-name"
              v-model="localUser.lastName"
              :label=" $t('auth.last_name') "
              placeholder="Hidalgo Taveras"
              required
            ></v-text-field>
            <v-text-field
              id="email"
              type="email"
              v-model="localUser.email"
              :label=" $t('auth.email') "
              placeholder="alhidalgo@domain.com"
              required
            ></v-text-field>
            <p class="mb-2 mt-2">{{ $t('messages.security') }}</p>
            <p>{{ $t('messages.password_change_instructions') }}</p>
            <v-text-field
              id="password"
              type="password"
              v-model="localUser.password"
              :label=" $t('auth.password') "
              placeholder="********"
              required
            ></v-text-field>
            <v-text-field
              id="password2"
              type="password"
              v-model="localUser.password2"
             :label=" $t('auth.second_password') "
              placeholder="********"
              required
            ></v-text-field>
            <v-btn class="mr-0" color="success" @click="updateUser()">
              <v-icon class="mr-2">fa-save</v-icon>{{ $t('call_action_buttons.save') }}
            </v-btn>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
    <v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import OfflineInfomation from "@/components/Offline/OfflineInformation";

export default {
  mounted() {
    this.isLoading = true;
    this.requestUser();
  },
  data() {
    return {
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: "",
      snackbarMultiLine: true,
      isLoading: false,
      localUser: {
        id_user: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: ""
      }
    };
  },
  components: {
    MenuComponent,
    Loading,
    OfflineInfomation
  },
  computed: {
    ...mapState(["user", "online", "apiDomain"])
  },
  methods: {
    requestUser() {
      let route = `${this.apiDomain}/user/user/${this.user.id_user}`;

      this.axios
        .get(route)
        .then(response => {
          this.localUser.id_user = response.data.id_user;
          this.localUser.firstName = response.data.first_name;
          this.localUser.lastName = response.data.last_name;
          this.localUser.email = response.data.email;
          this.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateUser() {
      this.isLoading = true;
      let route = `${this.apiDomain}/user/user`;
      this.axios({
        method: "PATCH",
        url: route,
        data: JSON.stringify(this.localUser),
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(response => {
          this.isLoading = false;
          if (response.data.message == "success") {
            this.user.email = this.localUser.email;
            this.user.first_name = this.localUser.firstName;
            this.user.last_name = this.localUser.lastName;
            
            this.snackbarShow = true;
            this.snackbarMessage = this.$t('messages.save');
            this.snackbarColor = "success";
          }
        })
        .catch(error => {
          this.isLoading = false;
          if (error.response.status === 409) {
            this.snackbarShow = true;
            this.snackbarMessage = this.$t('messages.password_not_match');
            this.snackbarColor = "error";
          } else {
            this.snackbarShow = true;
            this.snackbarMessage = this.$t('messages.server_error');
            this.snackbarColor = "error";
          }
        });
    }
  }
};
</script>