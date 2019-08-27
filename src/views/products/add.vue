<template>
  <v-form @submit.prevent="createProduct">
    <v-card flat>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              id="name"
              v-model="name"
              :label=" $t('products.name') "
              @keyup="uppercase"
              autocomplete="off"
              :placeholder=" $t('products.product_name_placeholder') "
              required
            ></v-text-field>
            <v-text-field
              type="number"
              v-model="price"
              :label=" $t('products.price') "
              value="1"
              min="1"
              step="0.01"
              required
            ></v-text-field>
            <v-select
              v-model="measurementUnit"
              :items="measurement_units"
              :label=" $t('products.measurement_unit') "
              item-text="name"
              item-value="id_unit_measurement"
              append-outer-icon="fa-plus"
              @click:append-outer="$router.push('/measurement_units')"
              required
            ></v-select>
            <v-select
              v-model="category"
              :items="categories"
              :label=" $t('products.category') "
              item-text="name"
              item-value="id_category"
              append-outer-icon="fa-plus"
              @click:append-outer="$router.push('/categories')"
              required
            ></v-select>
            <v-switch
              color="primary"
              v-model="itbis"
              :label="` ${$t('products.tax')} ${itbisQuantity}% : ${(itbis == '1')? $t('messages.yes') : $t('messages.no') }`"
              true-value="1"
              false-value="0"
            ></v-switch>
            <p class="grey--text">{{ $t('products.tax_info') }}</p>
            <v-divider></v-divider>
            <v-switch
              color="primary"
              v-model.number="favorite"
              :label="`${$t('products.favorite_mark_message')}: ${(favorite == 1)? $t('messages.yes') : $t('messages.no') }`"
              true-value.number="1"
              false-value.number="0"
            ></v-switch>
            <v-divider></v-divider>
            <v-textarea
              :label=" $t('products.description') "
              v-model="description"
              :placeholder=" $t('products.description_message') "
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout align-center>
          <v-flex x6>
            <v-btn small color="primary" type="submit" :disabled="name.length == 0" class="ml-0">
              <v-icon small class="mr-2">fa-save</v-icon>{{ $t('call_action_buttons.save') }}
            </v-btn>
          </v-flex>
          <v-flex xs6 text-xs-right>
            <v-btn small outline color="error" @click="$router.push('/product/list')" class="mr-0">
              <v-icon small class="mr-2">fa-window-close</v-icon>{{ $t('call_action_buttons.cancel') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
    </v-snackbar>
  </v-form>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from "@/mixins/miscellany/categories";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import axios from "axios";

import itbisMixin from "@/mixins/miscellany/Itbis";

export default {
  mixins: [categories, measurementUnits,itbisMixin],
  async mounted() {
    if (this.online) {
      this.requestCategories(axios);
      this.requestMeasurementUnit(axios);
      this.itbisQuantity = await this.getItbisFromIndexedDb();
    }
  },
  data() {
    return {
      name: "",
      price: 1,
      measurementUnit: "",
      category: "",
      itbis: "1",
      description: "",
      favorite: 0,
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: "",
      snackbarMultiLine:true,
      itbisQuantity:0
    };
  },
  components: {
    MenuComponent
  },
  computed: {
    ...mapState([
      "measurement_units",
      "categories",
      "user",
      "online",
      "apiDomain"
    ])
  },
  methods: {
    ...mapMutations([
      "addProduct",
      "deleteProduct",
      "setCategories",
      "setMeasurementUnit"
    ]),
    createProduct() {
      this.isLoading = true;
      let formData = new FormData();
      let product = {
        id_user: this.user.id_user,
        name: this.name,
        price: this.price,
        id_unit_measurement: this.measurementUnit,
        id_category: this.category,
        itbis: this.itbis,
        description: this.description,
        favorite: this.favorite
      };
      formData.append("product", JSON.stringify(product));

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Products/add`, formData)
          .then(response => {
            if (response.data.status == "success") {
              product.id_product = response.data.data.id_product;
              this.addProduct(product);
              this.snackbarShow = true;
              this.snackbarMessage = this.$t('messages.save');
              this.snackbarColor = "success";
              this.name = "";
              this.price = 1;
              document.querySelector("#name").focus();
              this.isLoading = false;
            } else if (response.data.status == "exits") {
              this.snackbarShow = true;
              this.snackbarMessage = `${this.$t('messages.item_already_exists')}: ${response.data.data.name}`;
              this.snackbarColor = "error";
            }
          })
          .catch(function(error) {
            console.log("TCL: createCategory -> error", error);
          });
      } else {
        this.snackbarShow = true;
        this.snackbarMessage = this.$t('messages.intenet_required');
        this.snackbarColor = "error";
      }
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>