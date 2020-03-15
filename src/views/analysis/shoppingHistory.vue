<template>
  <div>
    <v-layout row wrap v-if="shoppingHistory.length > 0">
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-text-field
              type="search"
              :label=" $t('products.search') "
              v-model="search"
              prepend-inner-icon="fa-search"
            ></v-text-field>
            <p>{{ $t('shop.ux_shopping_details_view_instructions') }}</p>
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
              <v-alert :value="true" color="error" icon="fa-warning">{{ $t('messages.nothing_to_display') }}</v-alert>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="fa-warning"
              >{{ $t('messages.no_match_found') }} "{{ search }}"</v-alert>
            </template>
            <template v-slot:items="shop">
              <td>
                <router-link
                  :to="{ name: 'purchase_details', params: { id: shop.item.id_purchase } }"
                  class="primary--text font-weight-bold"
                >{{shop.item.names_establishments}}</router-link>
              </td>
              <td>{{ shop.item.create_at.substring(0, 10) }}</td>
              <td>
                <router-link
                  :to="{ name: 'purchase_details', params: { id: shop.item.id_purchase } }"
                  class="primary--text font-weight-bold"
                >{{currency.symbol}} {{createNumberFormat(shop.item.total)}}</router-link>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <h1 class="empty-history-information">
          <v-icon large class="mr-2">fa-history</v-icon>{{ $t('messages.nothing_to_display') }}
        </h1>
      </v-flex>
    </v-layout>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import currencies from "@/mixins/miscellany/currencies";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [currencies],
  async mounted() {
    this.isLoading = true;
    this.requestShoppingHistory();
    this.currency = await this.getPreferredCurrency();
  },
  components: {
    Loading
  },
  data() {
    return {
      shoppingHistory: [],
      currency: [],
      search: "",
      pagination: {},
      selected: [],
      headers: [
        { text: this.$t('shop.place'), align: "left", value: "names_establishments" },
        { text: this.$t('messages.date'), align: "left", value: "create_at" },
        { text: this.$t('messages.total'), align: "left", value: "total" }
      ],
      isLoading: false
    };
  },
  computed: {
    ...mapState(["user"]),
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
      this.$store.dispatch('shoppings/getAll')
        .then(response => {
            this.shoppingHistory = response.data.data;
            this.isLoading = false;
        }).catch(error=>{
          console.log(error)
        })
    },
    createNumberFormat(number) {
      let l10nEN = new Intl.NumberFormat("en-US");
      return l10nEN.format(number);
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