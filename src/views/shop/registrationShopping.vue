<template>
  <div>
    <v-layout row wrap v-if="products.length > 0">
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-flex xs12>
              <v-text-field
                prepend-inner-icon="fa-search"
                v-model="searchProductName"
                label="Buscar..."
                clearable
              ></v-text-field>
              <v-tabs fixed-tabs>
                <v-tab @click="showFavorites = false">
                  <v-icon class="mr-2">fa-list</v-icon>Todos
                </v-tab>
                <v-tab @click="showFavorites = true">
                  <v-icon class="mr-2">fa-star</v-icon>Favoritos
                </v-tab>
              </v-tabs>
            </v-flex>

            <v-flex xs12 class="products-container">
              <v-layout
                class="mt-2 mb-2"
                row
                wrap
                v-for="(product,index) in actualAvaliableProducts"
                :key="index"
              >
                <v-flex xs12>
                  <v-card>
                    <v-card-text>
                      <div class="primary--text font-weight-bold" @click="$router.push({ name: 'view_product', params: { id: product.id_product } })">
                        {{product.name}}
                        <span v-if="product.favorite == '1' ">
                          <v-icon small color="warning" class="ml-2">fa-star</v-icon>
                        </span>
                      </div>
                      <div class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</div>
                      <div>
                        <v-layout row wrap>
                          <v-flex xs5 class="mr-1 ml-2">
                            <v-text-field
                              :label="currency.symbol"
                              type="number"
                              name="price"
                              id="price"
                              step="0.01"
                              min="1"
                              placeholder="1"
                              v-model.number="product.price"
                              :disabled="isOnCar(product.id_product)"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs5 class="ml-1">
                            <v-text-field
                              label="Cantidad"
                              type="number"
                              name="quantity"
                              id="quantity"
                              value="1"
                              min="1"
                              placeholder="1"
                              v-model.number="product.quantity"
                              :disabled="isOnCar(product.id_product)"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        class="ma-0"
                        outline
                        v-if="!isOnCar(product.id_product)"
                        @click="addItemToShoppingCar(index)"
                      >Anadir al carro</v-btn>
                      <v-btn
                        color="error"
                        class="ma-0"
                        outline
                        v-if="isOnCar(product.id_product)"
                        @click="removeItemFromShoppingCar(product.id_product)"
                      >Eliminar del carro</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <ShopResume
                :quantity="shoppingCar.length"
                :sub-total="subTotal"
                :currency-symbol="currency.symbol"
                :total-itbis="totalItbis"
              ></ShopResume>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-flex xs12>
              <p class="headline grey--text">No se ha creado ningún producto</p>
              <v-btn class="ml-0" color="primary" @click="$router.push('/product/add')">
                <v-icon class="mr-2">fa-plus-circle</v-icon>Crear un producto
              </v-btn>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import ShoppingCar from "@/components/shop/ShoppingCar";
import ShopResume from "@/components/shop/ShopResume";

import products from "@/mixins/products/Products";
import ShoppingCarMixin from "@/mixins/shop/ShoppingCar";
import currencies from "@/mixins/miscellany/currencies";
import itbisMixin from "@/mixins/miscellany/Itbis";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [products, ShoppingCarMixin, currencies, itbisMixin],
  async mounted() {
    if (this.online) {
      this.isLoading = true;
      this.requestProducts(axios).then(response => {
        this.setProducts(response.data);
        this.isLoading = false;
      });
    }

    let shoppingCarTemp = await this.getShoppingCarItems();

    if (shoppingCarTemp != null) {
      this.shoppingCar = shoppingCarTemp;
    }
    this.currency = await this.getPreferredCurrency();
    this.itbis = await this.getItbisFromIndexedDb();
  },
  components: {
    MenuComponent,
    ShoppingCar,
    ShopResume,
    Loading
  },
  computed: {
    ...mapState([
      "products",
      "user",
      "online",
      "apiDomain",
      "measurement_units"
    ]),
    actualAvaliableProducts: function() {
      if (this.searchProductName == null) {
        this.searchProductName = "";
      }

      let filteredProducts = this.products.filter(item =>
        item.name.toUpperCase().includes(this.searchProductName.toUpperCase())
      );

      let orderedProducts = filteredProducts.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );

      if (this.showFavorites) {
        orderedProducts = orderedProducts.filter(
          product => product.favorite == "1"
        );
      }

      return orderedProducts;
    },
    subTotal() {
      let total = 0;
      this.shoppingCar.forEach(item => {
        total += parseFloat(item.price) * parseFloat(item.quantity);
      });
      return total;
    },
    totalItbis() {
      let totalItbis = 0;
      this.shoppingCar.forEach(item => {
        totalItbis +=
          parseFloat(item.price) *
          parseFloat(item.quantity) *
          (this.itbis / 100);
      });
      return totalItbis;
    }
  },
  data() {
    return {
      searchProductName: "",
      shoppingCar: [],
      currency: [],
      itbis: 1,
      isLoading: false,
      showFavorites: false
    };
  },
  methods: {
    ...mapMutations(["setProducts"]),
    getMeasurementName(id) {
      let value;
      this.measurement_units.forEach(unit => {
        if (unit.id_unit_measurement == id) {
          value = unit.name;
          return;
        }
      });
      return value;
    },
    isOnCar(idProduct) {
      let result;
      this.shoppingCar.forEach(item => {
        if (item.id_product == idProduct) {
          result = true;
          return;
        }
      });
      return result;
    },
    numberFormat(number) {
      let l10nEN = new Intl.NumberFormat("en-US");
      return l10nEN.format(number);
    }
  }
};
</script>

<style>
.product-main-container {
  margin-top: 20px;
  margin-bottom: 115px;
}
.add-remove-from-card-label {
  margin: 10px auto;
}
.products-container {
  margin-bottom: 130px;
}
</style>