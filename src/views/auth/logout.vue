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
  },
  methods: {
    ...mapMutations(["setLoginState"])
  }
};
</script>