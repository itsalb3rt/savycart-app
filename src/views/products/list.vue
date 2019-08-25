<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-flex xs12 v-if="products.length > 0">
              <v-text-field
                prepend-inner-icon="fa-search"
                v-model="searchProductName"
                :label=" $t('products.search') + '...' "
                clearable
              ></v-text-field>
              <v-tabs fixed-tabs>
                <v-tab @click="showFavorites = false">
                  <v-icon class="mr-2">fa-list</v-icon>{{ $t('products.all') }}
                </v-tab>
                <v-tab @click="showFavorites = true">
                  <v-icon class="mr-2">fa-star</v-icon>{{ $t('products.favorites') }}
                </v-tab>
              </v-tabs>
            </v-flex>
            <v-flex xs12 class="mt-3" v-if="products.length > 0">
              <v-layout
                class="mt-2 mb-2"
                row
                wrap
                v-for="(product,index) in filterProducts"
                :key="index"
              >
                <v-flex xs12>
                  <v-card>
                    <v-card-text>
                      <v-flex xs12>
                        <div>
                          <span
                            @click="$router.push({ name: 'view_product', params: { id: product.id_product } })"
                            flat
                            small
                            class="ma-0 pa-0 primary--text font-weight-bold subheading"
                          >{{product.name}}</span>
                          <span v-if="product.favorite == '1' ">
                            <v-icon small color="warning" class="ml-2">fa-star</v-icon>
                          </span>
                        </div>
                        <div class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</div>
                        <div
                          class="font-weight-bold subheading"
                        >{{currency.symbol}} {{product.price}}</div>
                      </v-flex>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="success"
                        small
                        depressed
                        outline
                        class="ma-0 pa-0 right"
                        @click="$router.push({name:'edit product', params:{id: product.id_product} })"
                      >
                        <v-icon small class="mr-1">fa-edit</v-icon>{{ $t('call_action_buttons.edit') }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        small
                        flat
                        class="ma-0 pa-0 right"
                        @click="showDialogToDeleteProduct(product.id_product)"
                      >
                        <v-icon small class="mr-1">fa-trash</v-icon>{{ $t('call_action_buttons.delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="products.length == 0" xs12>
              <p
                class="headline mt-5 grey--text font-weight-bold"
              >{{ $t('products.empty_list') }}</p>
            </v-flex>
            <v-btn
              color="primary"
              dark
              fixed
              right
              bottom
              fab
              @click="$router.push({path:'/product/add'})"
            >
              <v-icon>fa-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent full-width>
        <v-card>
          <v-card-title class="headline">{{ $t('products.delete_product_modal_title') }}</v-card-title>
          <v-card-text>{{ $t('products.delete_product_modal_message') }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteProduct()">{{ $t('call_action_buttons.delete') }}</v-btn>
            <v-btn color="primary" flat @click="dialog = false">{{ $t('products.keep_item') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar v-model="successDeleteProduct" color="success">
      {{ $t('products.product_removed') }}
      <v-btn dark flat @click="successDeleteProduct = false">{{ $t('call_action_buttons.close') }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import products from "@/mixins/products/Products";
import currencies from "@/mixins/miscellany/currencies";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import categories from "@/mixins/miscellany/categories";

import itbisMixin from "@/mixins/miscellany/Itbis";

export default {
  mixins: [products, currencies, measurementUnits, categories, itbisMixin],
  async mounted() {
    if (this.online) {
      this.getItbis();
      this.requestProducts(axios).then(response => {
        this.setProducts(response.data);
        this.requestMeasurementUnit(axios);
        this.requestCategories(axios);
      });
    }
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      searchProductName: "",
      currency: [],
      showFavorites: false,
      dialog: false,
      deleteProductId: "",
      successDeleteProduct: false
    };
  },
  components: {
    MenuComponent
  },
  computed: {
    ...mapState([
      "products",
      "user",
      "online",
      "apiDomain",
      "measurement_units"
    ]),
    filterProducts: function() {
      let orderedProducts = this.products.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );

      if (this.searchProductName == null) {
        this.searchProductName = "";
      }
      let filteredProducts = orderedProducts.filter(item =>
        item.name.toUpperCase().includes(this.searchProductName.toUpperCase())
      );

      if (this.showFavorites) {
        filteredProducts = filteredProducts.filter(
          product => product.favorite == "1"
        );
      }

      return filteredProducts;
    }
  },
  methods: {
    ...mapMutations([
      "addProduct",
      "removeProduct",
      "setProducts",
      "setMeasurementUnit",
      "setCategories"
    ]),
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
    showDialogToDeleteProduct(idProduct) {
      this.dialog = true;
      this.deleteProductId = idProduct;
    },
    deleteProduct() {
      this.dialog = false;
      axios
        .get(`${this.apiDomain}/products/delete/${this.deleteProductId}`)
        .then(response => {
          if (response.data.status == "success") {
            this.products.forEach((product, index) => {
              if (product.id_product == this.deleteProductId) {
                this.removeProduct(index);
                return;
              }
            });
            this.successDeleteProduct = true;
          }
        })
        .catch(function(error) {
          console.log("TCL: deleteCategory -> error", error);
        });
    },
    getItbis() {
      axios
        .get(`${this.apiDomain}/Miscellany/itbis?id_user=${this.user.id_user}`)
        .then(response => {
          this.itbis = response.data.quantity;
          this.saveInIndexedDbItbis(this.itbis);
        });
    }
  }
};
</script>
<style lang="css">
.right {
  float: right !important;
}
</style>