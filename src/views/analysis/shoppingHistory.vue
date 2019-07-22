<template>
  <v-container grid-list-xs>
    <v-layout row wrap v-if="shoppingHistory.length > 0">
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-text-field
              type="search"
              label="Buscar..."
              v-model="search"
              prepend-inner-icon="fa-search"
            ></v-text-field>
            <p>Al hacer click en el nombre o total de compra podrá ver el detalle.</p>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <div>
          <v-data-table
            :headers="headers"
            :items="shoppingHistory"
            :search="search"
            :pagination.sync="pagination"
          >
            <template v-slot:no-data>
              <v-alert :value="true" color="error" icon="fa-warning">No hay ningun dato para mostrar</v-alert>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="fa-warning"
              >No existen resultados para "{{ search }}"</v-alert>
            </template>
            <template v-slot:items="shop">
              <td>
                <router-link
                  :to="{ name: 'purchase_details', params: { id: shop.item.id_purchase } }"
                  class="primary--text font-weight-bold"
                >{{shop.item.names_establishments}}</router-link>
              </td>
              <td>{{ shop.item.date.substring(0, 10) }}</td>
              <td>
                <router-link
                  :to="{ name: 'purchase_details', params: { id: shop.item.id_purchase } }"
                  class="primary--text font-weight-bold"
                >{{currency.symbol}} {{shop.item.total}}</router-link>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <h1 class="empty-history-information">
          <v-icon large class="mr-2">fa-history</v-icon> Tu historial de compras esta vacío
        </h1>
        <v-btn color="primary" class="ml-0" flat @click="$router.push('/shop/registation')">
          <v-icon class="mr-2">fa-plus-circle</v-icon>Registrar una compra
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import axios from "axios";
import { mapState } from "vuex";
import currencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [currencies],
  async mounted() {
    this.requestShoppingHistory();
    this.currency = await this.getPreferredCurrency();
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      shoppingHistory: [],
      currency: [],
      search: "",
      pagination: {},
      selected: [],
      headers: [
        { text: "Lugar", align: "left", value: "lugar" },
        { text: "Fecha", align: "left", value: "fecha" },
        { text: "Total", align: "left", value: "total" }
      ]
    };
  },
  computed: {
    ...mapState(["apiDomain", "user"]),
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  methods: {
    requestShoppingHistory() {
      axios
        .get(
          `${this.apiDomain}/Analysis/shoppingHistory?id_user=${this.user.id_user}`
        )
        .then(response => {
          if (response.data.status == "success") {
            this.shoppingHistory = response.data.history;
          }
        });
    }
  }
};
</script>

<style>
.empty-history-information {
  margin: 40% auto 50px;
  color: var(--grey);
}
</style>