<template>
  <div></div>
</template>

<script>
import { deleteState } from "@/plugins/storage";
import { mapMutations } from "vuex";

export default {
  mounted() {
    deleteState()
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    this.$store.commit('auth/SET_LOGGED', false);
    this.$router.push("/login");
  }
};
</script>