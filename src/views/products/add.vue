<template>
  <v-form @submit.prevent="createProduct">
    <v-container>
      <v-card flat>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                id="name"
                v-model="name"
                label="Nombre"
                @keyup="uppercase"
                autocomplete="off"
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
            <v-flex xs6>
              <v-btn small color="primary" :disabled="name.length == 0" type="submit">
                <v-icon small class="mr-2">fa-save</v-icon>Guardar
              </v-btn>
            </v-flex>
            <v-flex xs6>
              <v-spacer></v-spacer>
              <v-btn small class="mr-0" color="error" @click="$router.push('/product/list')">
                <v-icon small class="mr-2">fa-window-close</v-icon>Cancelar
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
  </v-form>
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

export default {
  mixins: [categories, measurementUnits],
  mounted() {
    if (this.online) {
      this.requestCategories(axios);
      this.requestMeasurementUnit(axios);
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
      isLoading: false
    };
  },
  components: {
    MenuComponent,
    Loading
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

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Products/add`, formData)
          .then(response => {
            if (response.data.status == "success") {
              product.id_product = response.data.data.id_product;
              this.addProduct(product);
              notyf.success("Producto guardado!");
              this.name = "";
              this.price = 1;
              document.querySelector("#name").focus();
              this.isLoading = false;
            } else if (response.data.status == "exits") {
              notyf.error(
                `Ya existe un producto nombrado: ${response.data.data.name}`
              );
            }
          })
          .catch(function(error) {
            console.log("TCL: createCategory -> error", error);
          });
      } else {
        notyf.error(
          "Debes estar conectado a internet para realizar esta accion."
        );
      }
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>