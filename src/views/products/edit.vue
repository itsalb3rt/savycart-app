<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 class="edit-form" v-if="online">
        <v-container class="white">
          <v-form @submit.prevent="updateProduct">
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  id="name"
                  v-model="name"
                  label="Nombre"
                  @keyup="uppercase"
                  placeholder="Manzana"
                  required
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model="price"
                  label="Precio"
                  value="1"
                  min="1"
                  step="0.01"
                  required
                ></v-text-field>
                <v-select
                  v-model="measurementUnit"
                  :items="measurement_units"
                  label="Unidad medida"
                  item-text="name"
                  item-value="id_unit_measurement"
                  required
                ></v-select>
                <v-select
                  v-model="category"
                  :items="categories"
                  label="Categoria"
                  item-text="name"
                  item-value="id_category"
                  required
                ></v-select>
                <v-switch
                  color="primary"
                  v-model="itbis"
                  :label="`Incluir ITBIS: ${(itbis == '1')? 'SI' : 'NO' }`"
                  true-value="1"
                  false-value="0"
                ></v-switch>
                <p class="grey--text">El porcentaje de ITBIS se asigna en ajustes.</p>
                <v-divider></v-divider>
                <v-textarea
                  label="Descripción"
                  v-model="description"
                  placeholder="Agregue aquí una descripción breve, esto es opcional"
                ></v-textarea>
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex xs6>
                <v-btn
                  small
                  color="success"
                  :disabled="name.length == 0"
                  type="submit"
                  class="ml-0"
                >
                  <v-icon small class="mr-2">fa-save</v-icon>Guardar
                </v-btn>
              </v-flex>
              <v-flex xs6 text-xs-right>
                <v-btn
                  small
                  outline
                  color="error"
                  @click="$router.push('/product/list')"
                  class="mr-0"
                >
                  <v-icon small class="mr-2">fa-window-close</v-icon>Cancelar
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-flex>
      <v-flex xs12 v-else>
        <offline-infomation></offline-infomation>
      </v-flex>
    </v-layout>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from "@/mixins/miscellany/categories";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import OfflineInfomation from "@/components/Offline/OfflineInformation";

export default {
  mixins: [categories, measurementUnits],
  mounted() {
    if (this.online) {
      this.requestCategories(axios);
      this.requestMeasurementUnit(axios);
      this.getProduct();
      this.isLoading = true;
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
      product: [],
      isLoading: false
    };
  },
  components: {
    MenuComponent,
    Loading,
    OfflineInfomation
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
    ...mapMutations(["setCategories", "setMeasurementUnit"]),
    updateProduct() {
      this.isLoading = true;
      const notyf = new Notyf();
      let formData = new FormData();
      let product = {
        id_user: this.user.id_user,
        name: this.name,
        price: this.price,
        id_unit_measurement: this.measurementUnit,
        id_category: this.category,
        itbis: this.itbis,
        description: this.description
      };
      formData.append("product", JSON.stringify(product));
      formData.append("id_product", this.$route.params.id);

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Products/update`, formData)
          .then(response => {
            if (response.data.status == "success") {
              notyf.success("Producto guardado!");
              this.$router.push("product/list");
            }
            this.isLoading = false;
          })
          .catch(function(error) {
            console.log("TCL: createCategory -> error", error);
          });
      } else {
        this.isLoading = false;
        notyf.error(
          "Debes estar conectado a internet para realizar esta accion."
        );
      }
    },
    getProduct() {
      axios
        .get(
          `${this.apiDomain}/products/products?idProduct=${this.$route.params.id}`
        )
        .then(response => {
          this.product = response.data;
          this.name = this.product.name;
          this.price = this.product.price;
          this.measurementUnit = this.product.id_unit_measurement;
          this.category = this.product.id_category;
          this.itbis = this.product.itbis;
          this.description = this.product.description;
          this.isLoading = false;
        })
        .catch(function(error) {
          console.log("TCL: requestProducts -> error", error);
        });
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>