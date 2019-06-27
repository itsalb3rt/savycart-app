<template>
  <div class="container">
    <router-view/>
    <!-- @detected-condition fires when the connectivity status of the device changes -->
    <offline @detected-condition="handleConnectivityChange"></offline>
  </div>
</template>

<script>
import MenuComponent from "./components/TheMenu.vue";
import offline from "v-offline";
import { mapMutations } from "vuex";

export default {
  components: {
    MenuComponent,
    offline
  },
  methods: {
    ...mapMutations(["setOnline"]),
    handleConnectivityChange(status) {
      this.setOnline(status);
      console.log("TCL: handleConnectivityChange -> status", status);
    }
  }
};
</script>