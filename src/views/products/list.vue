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
                label="Buscar..."
              ></v-text-field>
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
                        </div>
                        <div class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</div>
                        <div class="font-weight-bold subheading">{{currency.symbol}} {{product.price}}</div>
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
                        <v-icon small class="mr-1">fa-edit</v-icon>Editar
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        small
                        flat
                        class="ma-0 pa-0 right"
                        @click="dispatcherDeleteProduct(product.id_product)"
                      >
                        <v-icon small class="mr-1">fa-trash</v-icon>Eliminar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="products.length == 0" xs12>
              <p
                class="headline mt-5 grey--text font-weight-bold"
              >No se ha creado ningún producto, pulse el botón + para agregar productos.</p>
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
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import dndod from "dndod";
import "dndod/dist/dndod-popup.min.css";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import products from "@/mixins/products/Products";
import currencies from "@/mixins/miscellany/currencies";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import categories from "@/mixins/miscellany/categories";

export default {
  mixins: [products, currencies, measurementUnits, categories],
  async mounted() {
    if (this.online) {
      await this.requestProducts(axios);
      await this.requestMeasurementUnit(axios);
      await this.requestCategories(axios);
    }
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      searchProductName: "",
      currency: []
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

      let filteredProducts = orderedProducts.filter(item =>
        item.name.toUpperCase().includes(this.searchProductName.toUpperCase())
      );

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
    dispatcherDeleteProduct(idProduct) {
      dndod.popup({
        title: "Eliminar producto",
        msg: "Esta seguro que desea eliminar este producto ?",
        buttons: [
          {
            text: "Mantener producto",
            handler: (e, popup) => {
              popup.close();
            }
          },
          {
            text: "Eliminarlo",
            type: "danger",
            handler: (e, popup) => {
              this.deleteProduct(idProduct);
              popup.close();
            }
          }
        ]
      });
    },
    deleteProduct(idProduct) {
      axios
        .get(`${this.apiDomain}/products/delete/${idProduct}`)
        .then(response => {
          if (response.data.status == "success") {
            const notyf = new Notyf();
            this.products.forEach((product, index) => {
              if (product.id_product == idProduct) {
                this.removeProduct(index);
                return;
              }
            });
            notyf.success("Producto eliminado.");
          }
        })
        .catch(function(error) {
          console.log("TCL: deleteCategory -> error", error);
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