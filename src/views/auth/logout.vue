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
    this.$store.commit('auth/SET_LOGGED', false);
  }
};
</script>