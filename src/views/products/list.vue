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
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 20px">
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
                <div class="unit" style="color: var(--grey)">{{product.measurementUnits}}</div>
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
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "./../../components/MenuComponent.vue";

export default {
  components: {
    MenuComponent
  },
  mounted: function() {
    this.products.push({
      name: "Producto1",
      measurementUnits: "UN",
      price: 50.88
    });
    this.products.push({
      name: "Producto2",
      measurementUnits: "UN",
      price: 65
    });
  },
  computed: {
    ...mapState(['products','user'])
  },
  methods: {
    ...mapMutations(["setProduct"])
  }
};
</script>