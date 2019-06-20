<template>
  <div></div>
</template>

<script>
import { deleteState } from "@/plugins/storage";
import { mapMutations } from "vuex";

export default {
  mounted: async function() {
    await deleteState();
    await this.setLoginState("false");
    this.$router.push("/login");
  },
  methods: {
    ...mapMutations(["setLoginState"])
  }
};
</script>