<template>
  <div>
    <div>
      <v-card flat>
        <v-card-text>
          <v-layout row wrap v-if="shoppingCar.length > 0" class="mb-5 pb-5">
            <v-flex xs12>
              <v-text-field
                name="name_establishment"
                :label=" $t('shopping_car.name_establishment') "
                v-model="nameEstablishment"
                id="name_establishment"
                :placeholder=" $t('shopping_car.name_establishment_placeholder') "
              ></v-text-field>
              <v-btn
                class="ml-0"
                color="success"
                @click="saveShop"
                :disabled="disabledSubmitButton"
              >
                <v-icon small class="mr-2">fa-save</v-icon>
                {{ $t('call_action_buttons.save') }}
              </v-btn>
              <v-divider class="mt-3 mb-3"></v-divider>
            </v-flex>
            <v-flex xs12 v-for="(product,index) in shoppingCar" :key="index" class="mb-3">
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <span class="primary--text">{{product.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                      <span class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</span>
                    </v-flex>
                    <v-flex xs12>
                      <strong>{{currency.symbol}} {{product.price * product.quantity}}</strong>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        min="1"
                        name="quantity"
                        :label=" $t('products.quantity') "
                        id="quantity"
                        v-model="product.quantity"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="error"
                    outline
                    @click="removeItemFromShoppingCar(product.id_product)"
                  >{{ $t('shopping_car.remove_from_shopping_car') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row wrap v-else>
            <v-flex xs12>
              <h1 class="empty-car-information">
                <v-icon large class="mr-2">fa-shopping-cart</v-icon>
                {{ $t('shopping_car.empty_car') }}
              </h1>
              <v-btn
                flat
                href="#"
                class="primary--text ml-0"
                @click="$router.push('/shop/registation')"
              >
                <v-icon class="mr-2">fa-plus-circle</v-icon>
                {{ $t('shopping_car.go_to_logger_purchase') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
    <ShopResume
      :quantity="shoppingCar.length"
      :sub-total="subTotal"
      onCar="true"
      :currency-symbol="currency.symbol"
      :total-itbis="totalItbis"
    ></ShopResume>
    <v-snackbar v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu";
import ShopResume from "@/components/shop/ShopResume";
import ShoppingCar from "@/components/shop/ShoppingCar";
import { mapState, mapMutations } from "vuex";
import axios from "axios";

import ShoppingCarMixin from "@/mixins/shop/ShoppingCar";
import currencies from "@/mixins/miscellany/currencies";
import itbisMixin from "@/mixins/miscellany/Itbis";

export default {
  mixins: [ShoppingCarMixin, currencies, itbisMixin],
  async mounted() {
    this.shoppingCar = await this.getShoppingCarItems();
    this.currency = await this.getPreferredCurrency();
    this.itbis = await this.getItbisFromIndexedDb();
  },
  components: {
    MenuComponent,
    ShopResume,
    ShoppingCar
  },
  data() {
    return {
      shoppingCar: [],
      nameEstablishment: "",
      disabledSubmitButton: false,
      currency: [],
      itbis: 1,
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: ""
    };
  },
  computed: {
    ...mapState([
      "user",
      "online",
      "apiDomain",
      "measurement_units",
      "categories"
    ]),
    subTotal() {
      let total = 0;
      this.shoppingCar.forEach(item => {
        total += parseInt(item.price) * parseInt(item.quantity);
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
  methods: {
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
    async saveShop() {
      this.disabledSubmitButton = true;

      if (this.online) {
        if (this.nameEstablishment.length > 0) {
          let formData = new FormData();
          await this.setMeasurementNameToProductOnShoppinCar();
          await this.setCategoryNameToProductOnShoppinCar();

          formData.append("shoppingCar", JSON.stringify(this.shoppingCar));
          formData.append("nameEstablishment", this.nameEstablishment);
          formData.append("idUser", this.user.id_user);

          axios
            .post(`${this.apiDomain}/Shopping/shopping`, formData)
            .then(response => {
              if (response.data.status == "success") {
                this.snackbarShow = true;
                this.snackbarMessage = `${this.$t('shop.purchase')} ${this.$t('messages.saved')}`;
                this.snackbarColor = "success";
                this.clearShoppingCar();
                setTimeout(() => {
                  this.$router.push("/product/list");
                }, 1000);
              }
            })
            .catch(function(error) {
              if (error.response.status === 500)
                this.snackbarShow = true;
                this.snackbarMessage = this.$t('message.server_error');
                this.snackbarColor = "error";
                console.log("TCL: createCategory -> error", error);
            });
        } else {
          this.snackbarShow = true;
          this.snackbarMessage = "Debe colocar un nombre de establecimiento";
          this.snackbarColor = "error";
          this.disabledSubmitButton = false;
        }
      } else {
        this.snackbarShow = true;
        this.snackbarMessage =
          "Debe estar conectado a internet para realizar esta acción.";
        this.snackbarColor = "error";
        this.disabledSubmitButton = false;
      }
    },
    setMeasurementNameToProductOnShoppinCar() {
      this.shoppingCar.forEach(product => {
        this.measurement_units.forEach(unit => {
          if (product.id_unit_measurement == unit.id_unit_measurement) {
            product.measurementUnitName = unit.name;
            return;
          }
        });
      });
    },
    setCategoryNameToProductOnShoppinCar() {
      this.shoppingCar.forEach(product => {
        this.categories.forEach(category => {
          if (product.id_category == category.id_category) {
            product.categoryName = category.name;
            return;
          }
        });
      });
    }
  }
};
</script>

<style>
.empty-car-information {
  margin: 40% auto 50px;
  color: var(--grey);
}
.product-main-container {
  margin-bottom: 100px;
}
</style>
