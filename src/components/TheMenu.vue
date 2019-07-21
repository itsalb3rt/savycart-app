<template>
  <div>
    <v-toolbar>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer app  v-model="drawer">
      <v-layout mt-4 column align-center>
        <v-flex>
          <v-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-avatar>
        </v-flex>
        <v-flex>
          <p class="mt-3 headline">{{user.first_name}} {{user.last_name}}</p>
          <p>{{user.email}}</p>
        </v-flex>
      </v-layout>
      
      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="(item,index) in items"
          :key="index"
          :to="{path:item.routePath}"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
  </div>

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    title: ""
  },
  computed: {
    ...mapState(["user","online"])
  },
  data() {
    return {
      drawer: false,
      items: [
        { title: "Mi lista", icon: "fa-clipboard-list" , routePath:'/product/list' },
        { title: "Registrar compra", icon: "fa-shopping-cart" , routePath:'/shop/registation' },
        { title: "Historial de compras", icon: "fa-history" , routePath:'/analysis/shopping_history' },
        { title: "Analisis", icon: "fa-chart-bar" , routePath:'/none' },
        { title: "Unidades de medidas", icon: "fa-balance-scale" , routePath:'/measurement_units' },
        { title: "Categorias", icon: "fa-list-ul" , routePath:'/categories' },
        { title: "Mas ajustes", icon: "fa-cog" , routePath:'/settings' },
        { title: "Cerrar sesion", icon: "fa-sign-out-alt" , routePath:'/auth/logout' },
      ]
    };
  }
};
</script>
