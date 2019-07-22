<template>
  <div>
    <v-toolbar>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer app temporary v-model="drawer">
      <v-layout mt-4 column align-center>
        <v-flex xs12>
          <v-avatar :size="80" color="indigo">
            <v-icon large dark>fa-user</v-icon>
          </v-avatar>
        </v-flex>
        <v-flex xs12>
          <p class="mt-3 headline">{{user.first_name}} {{user.last_name}}</p>
          <p class="mt-0">{{user.email}}</p>
        </v-flex>
      </v-layout>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="(item,index) in items" :key="index" :to="{path:item.routePath}">
          <v-list-tile-action>
            <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group prepend-icon="fa-cog" no-action sub-group :value="false">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Ajustes</v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-tile v-for="(item,index) in settings" :key="index" :to="{path:item.routePath}">
            <v-list-tile-action>
              <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <v-list-tile class="mt-5 pt-5" :to="{path:logout[0].routePath}">
          <v-list-tile-action>
            <v-icon :color="logout[0].iconColor">{{ logout[0].icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ logout[0].title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    title: ""
  },
  computed: {
    ...mapState(["user", "online"])
  },
  data() {
    return {
      dark: false,
      drawer: false,
      items: [
        {
          title: "Mi lista",
          icon: "fa-clipboard-list",
          iconColor: "success",
          routePath: "/product/list"
        },
        {
          title: "Registrar compra",
          icon: "fa-shopping-cart",
          iconColor: "primary",
          routePath: "/shop/registation"
        },
        {
          title: "Historial de compras",
          icon: "fa-history",
          iconColor: "",
          routePath: "/analysis/shopping_history"
        },
        {
          title: "Analisis",
          icon: "fa-chart-bar",
          iconColor: "purple",
          routePath: "/none"
        }
      ],
      settings: [
        {
          title: "Unidades de medidas",
          icon: "fa-balance-scale",
          iconColor: "purple",
          routePath: "/measurement_units"
        },
        {
          title: "Categorias",
          icon: "fa-list-ul",
          iconColor: "",
          routePath: "/categories"
        },
        {
          title: "Mas ajustes",
          icon: "fa-cog",
          iconColor: "",
          routePath: "/settings"
        }
      ],
      logout: [
        {
          title: "Cerrar sesion",
          icon: "fa-sign-out-alt",
          iconColor: "error",
          routePath: "/auth/logout"
        }
      ]
    };
  }
};
</script>
