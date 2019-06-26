<template>
  <div>
    <MenuComponent title="Historial de compras"/>
    <div class="container-app">
      <div class="row" v-if="shoppingHistory.length > 0">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="input-group" style="margin-bottom:20px;">
            <input type="search" placeholder="Buscar..." v-model="searchProductName">
          </div>
          <div>
            <p
              class="text small"
            >Al hacer click en el nombre o total de compra podrá ver el detalle.</p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="text small">
            <table class="table hover striped">
              <thead>
                <tr>
                  <th>ESTABLECIMIENTO</th>
                  <th>FECHA</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for=" (shop,index) in shoppingHistory " :key="index">
                  <td>
                    <router-link
                      :to="{ name: 'purchase_details', params: { id: shop.id_purchase } }"
                      :class="['undecoration' ,'primary']"
                    >{{shop.names_establishments}}</router-link>
                  </td>
                  <td>{{shop.date}}</td>
                  <td>
                    <router-link
                      :to="{ name: 'purchase_details', params: { id: shop.id_purchase } }"
                      :class="['undecoration' ,'primary']"
                    >RD$ {{shop.total}}</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h1 class="empty-history-information">
            <font-awesome-icon icon="history"/>&Tab;Tu historial de compras esta vacío
          </h1>
          <h3 @click="$router.push('/shop/registation')">
            <a href="#" class="important primary undecoration">
              <font-awesome-icon icon="plus-circle"/>&Tab;Registrar una compra
            </a>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  mounted() {
    this.requestShoppingHistory();
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      shoppingHistory: [],
      searchProductName: []
    };
  },
  computed: {
    ...mapState(["apiDomain", "user"])
  },
  methods: {
    requestShoppingHistory() {
      axios
        .get(
          `${this.apiDomain}/Analysis/shoppingHistory?id_user=${
            this.user.id_user
          }`
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