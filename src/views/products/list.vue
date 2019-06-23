<template>
  <div>
    <MenuComponent title="Lista"/>
    <div class="container-app">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="products.length > 0">
          <div class="input-group">
            <input type="search" placeholder="Buscar..." v-model="searchProductName">
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
          style="margin-top: 20px;"
          v-if="products.length > 0"
        >
          <div class="product-container" v-for="(product,index) in filterProducts" :key="index">
            <div class="row">
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="photo">
                  <img src="./../../assets/img/product-default-img.png" alt>
                </div>
              </div>
              <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 details">
                <div class="name">
                  <a href="#" class="primary important undecoration">{{product.name}}</a>
                  <a
                    class="success undecoration important right"
                    @click="$router.push( {name:'edit product', params:{id: product.id_product} } )"
                  >Editar</a>
                </div>
                <div
                  class="unit"
                  style="color: var(--grey)"
                >{{getMeasurementName(product.id_unit_measurement)}}</div>
                <div class="price" style="font-weight: bold;">
                  RD$ {{product.price}}
                  <a
                    class="danger undecoration important right"
                    @click="dispatcherDeleteProduct(index)"
                  >Eliminar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="products.length == 0" style="margin-top:40%;">
          <div class="panel">
            <div class="body">
              <p
                class="text x-large"
                style="color:var(--grey)"
              >No se ha creado ningún producto, pulse el botón + para agregar productos.</p>
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
import dndod from "dndod";
import "dndod/dist/dndod-popup.min.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mixins: [products],
  async mounted() {
    if(this.online){
      await this.requestProducts(axios);
    }
  },
  data(){
    return{
      searchProductName:''
    }
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
    filterProducts: function () {
        return this.products.filter((item) => item.name.toUpperCase().includes(this.searchProductName.toUpperCase()));
    }
  },
  methods: {
    ...mapMutations(["addProduct", "removeProduct", "setProducts"]),
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
    dispatcherDeleteProduct(index) {
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
              this.deleteProduct(this.products[index].id_product, index);
              popup.close();
            }
          }
        ]
      });
    },
    deleteProduct($idProduct, index) {
      axios
        .get(`${this.apiDomain}/products/delete/${$idProduct}`)
        .then(response => {
          if (response.data.status == "success") {
            const notyf = new Notyf();
            this.removeProduct(index);
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