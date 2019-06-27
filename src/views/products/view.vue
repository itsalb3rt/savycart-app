<template>
  <div>
    <MenuComponent :title="'Detalles / ' + product.name "/>
    <div class="container-app">
      <div class="row" v-if="product.length == undefined">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div style="margin:20px auto">
            <router-link
              v-if="product.id_product"
              :to="{ name: 'edit product', params: { id: product.id_product } }"
              :class="['success' ,'important','undecoration']"
            >
              <font-awesome-icon icon="edit"/>&Tab;Editar
            </router-link>
          </div>
          <div class="input-group">
            <div>
              <label for="name">Nombre</label>
              <div>{{product.name}}</div>
            </div>
            <div>
              <label for="price">Precio</label>
              <div>{{currency.symbol}} {{product.price}}</div>
            </div>
            <div>
              <label for="measurement_units">Unidad medida</label>
              <div>{{getMeasurementName(product.id_unit_measurement)}}</div>
            </div>
            <div>
              <label for="category">Categoria</label>
              <div>{{getCategory(product.id_category)}}</div>
            </div>
            <div>
              <strong>Incluir ITBIS</strong>
              <div>{{ (product.itbis == '1')? 'SI':'NO' }}</div>
            </div>
            <div>
              <label for="description">Descripción</label>
              <div>{{product.description}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h1 style="margin:40% auto;"><font-awesome-icon icon="magic"/>&Tab;Nada por aqui...</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from "@/mixins/miscellany/categories";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import axios from "axios";
import currencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [categories, measurementUnits, currencies],
  async mounted() {
    if (this.online) {
      await this.requestCategories(axios);
      await this.requestMeasurementUnit(axios);
      await this.getProduct();
    }
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      product: [],
      currency: []
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
    ...mapMutations(["setCategories", "setMeasurementUnit"]),
    getProduct() {
      axios
        .get(
          `${this.apiDomain}/products/products?idProduct=${
            this.$route.params.id
          }`
        )
        .then(response => {
          this.product = response.data;
        })
        .catch(function(error) {
          console.log("TCL: requestProducts -> error", error);
        });
    },
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
    getCategory(id) {
      let value;
      this.categories.forEach(category => {
        if (category.id_category == id) {
          value = category.name;
          return;
        }
      });
      return value;
    }
  }
};
</script>