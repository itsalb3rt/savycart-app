<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs12>
        <p class="display-3 primary--text text-xs-center">Sheiley Shop</p>
        <p class="warning--text text-xs-center">shopping registration application</p>
      </v-flex>
    </v-layout>
    <v-flex xs12 class="white--text" v-if="loginFailed">
      <v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
    </v-flex>
    <v-flex xs12 v-if="recoveryWasRequested">
      <p class="text-xs-center">
        <v-avatar size="80" color="success" class="mb-4 mt-4">
          <v-icon x-large dark>fa-check</v-icon>
        </v-avatar>
      </p>
      <p class="text-xs-center">{{$t('auth.account_recovery_information')}}</p>
      <v-flex x12>
        <v-btn color="primary" flat to="/login">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
      </v-flex>
    </v-flex>
    <v-flex xs12 v-else>
      <v-flex xs12 class="white--text" v-if="emailNotExits">
        <v-alert type="error" :value="true">{{ $t('auth.email_not_register') }}</v-alert>
      </v-flex>
      <v-form method="POST" ref="form" @submit.prevent="recoveryAccount">
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex x12>
                <h4
                  class="horizontal-line-text-main-container"
                  style="font-weight: normal!important;"
                >
                  <span
                    class="horizontal-line-text-container font-weight-bold"
                    style="background-color:#fafafa"
                  >
                    <span class="black--text">{{ $t('auth.recovery_title') }}</span>
                  </span>
                </h4>
              </v-flex>
              <v-flex xs12>
                <p>{{$t('auth.account_recovery_description')}}</p>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="emailRules"
                  v-model="email"
                  type="email"
                  :label=" $t('auth.email') "
                  placeholder="jhon@domain.com"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  :loading="loading"
                  color="success"
                  type="submit"
                  block
                >{{ $t('auth.recovery_title') }}</v-btn>
              </v-flex>
              <v-flex xs12 class="pt-3">
                <v-btn
                  color="primary"
                  flat
                  small
                  class="ma-0 pa-0"
                  to="/register"
                >{{ $t('auth.create_an_account') }}</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
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
      email: "",
      loginFailed: false,
      loading: false,
      emailRules: [
        v => !!v || this.$t("auth.email_required"),
        v => /.+@.+/.test(v) || this.$t("auth.email_invalid")
      ],
      recoveryWasRequested: false,
      emailNotExits:false
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    recoveryAccount() {
      this.emailNotExits = false;
      if (!this.$refs.form.validate()) {
        return false;
      }

      this.loading = true;

      this.$store.dispatch('auth/recoveryAccount',{email:this.email})
        .then(response => {
          this.loading = false;
            this.recoveryWasRequested = true;
        })
        .catch(function(error) {
          console.log(error);
        }).finally(()=>{
          this.loading = false;
        })
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
