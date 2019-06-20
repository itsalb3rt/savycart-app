<template>
  <div>
    <MenuComponent title="Lista"/>
    <div class="container-app">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="input-group">
            <input type="search" placeholder="Buscar...">
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 20px;">
          <div class="product-container" v-for="(product,index) in products" :key="index">
            <div class="row">
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="photo">
                  <img src="./../../assets/img/product-default-img.png" alt>
                </div>
              </div>
              <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 details">
                <div class="name">
                  <a href="#" class="primary important undecoration">{{product.name}}</a>
                  <a class="success undecoration important right">Editar</a>
                </div>
                <div class="unit" style="color: var(--grey)">
                  {{getMeasurementName(product.id_unit_measurement)}}
                </div>
                <div class="price" style="font-weight: bold;">
                  RD$ {{product.price}}
                  <a class="danger undecoration important right">Eliminar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="stiky-float-right-button">
      <router-link to="/product/add" :class="['undecoration','primary','important']">
        <font-awesome-icon icon="plus-circle"/>
      </router-link>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent.vue";
import products from "@/mixins/products/Products";
import axios from "axios";
import { mapState, mapMutations } from "vuex";

export default {
  mixins: [products],
  async mounted() {
    await this.requestProducts(axios);
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
    ])
  },
  methods: {
    ...mapMutations(["addProduct", "deleteProduct", "setProducts"]),
    getMeasurementName(id) {
      let value;
      this.measurement_units.forEach(unit => {
        if (unit.id_unit_measurement == id) {
          value = unit.name;
          return;
        }
      });
      return value;
    }
  }
};
</script>