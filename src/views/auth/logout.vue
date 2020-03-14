<template>
  <div></div>
</template>

<script>
import { deleteState } from "@/plugins/storage";
import { mapMutations } from "vuex";

export default {
  mounted() {
    deleteState()
    this.$router.push("/login");
    this.setLoginState(false);
    this.$store.commit('auth/SET_LOGGED', false);
  },
  methods: {
    ...mapMutations(["setLoginState"])
  }
};
</script>