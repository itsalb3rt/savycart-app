<template>
  <v-app >
    <MenuComponent title=" " v-if="isLoged == 'true'"/>
    <v-content>
      <router-view />
    </v-content>
    <!-- @detected-condition fires when the connectivity status of the device changes -->
    <offline @detected-condition="handleConnectivityChange"></offline>
  </v-app>
</template>

<script>
import MenuComponent from "./components/TheMenu.vue";
import offline from "v-offline";
import { mapMutations,mapState } from "vuex";

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
  },
  computed:{
    ...mapState(["isLoged"]),
  }
};
</script>