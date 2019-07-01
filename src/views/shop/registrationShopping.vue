<template>
  <div>
    <MenuComponent title="Registro compra"/>
    <ShoppingCar :count="shoppingCar.length"></ShoppingCar>
    <div class="container-app">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="products.length > 0">
          <div class="input-group">
            <input type="search" placeholder="Buscar..." v-model="searchProductName">
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 product-main-container"
          v-if="products.length > 0"
        >
          <div
            class="product-container"
            v-for="(product,index) in actualAvaliableProducts"
            :key="index"
          >
            <div class="row">
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="photo">
                  <img src="./../../assets/img/product-default-img.png" alt>
                </div>
              </div>
              <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 details">
                <div class="name input-group">
                  <a href="#" class="primary important undecoration">{{product.name}}</a>
                  <input
                    type="number"
                    class="right"
                    name="quantity"
                    id="quantity"
                    value="1"
                    min="1"
                    placeholder="1"
                    style="width: 30px!important"
                    v-model="product.quantity"
                  >
                </div>
                <div
                  class="unit"
                  style="color: var(--grey)"
                >{{getMeasurementName(product.id_unit_measurement)}}</div>
                <div class="price" style="font-weight: bold;">
                  {{currency.symbol}} {{product.price}}
                  <a
                    v-if="!isOnCar(product.id_product)"
                    class="primary undecoration important right"
                    href="#"
                    @click="addItemToShoppingCar(index)"
                  >Anadir al carro</a>
                  <a
                    v-if="isOnCar(product.id_product)"
                    class="danger undecoration important right"
                    @click="removeItemFromShoppingCar(product.id_product)"
                  >Eliminar del carro</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="products.length == 0" style="margin-top:40%;">
          <div class="panel">
            <div class="body">
              <p class="text x-large" style="color:var(--grey)">No se ha creado ningún producto</p>
            </div>
            <div>
              <h3 @click="$router.push('/product/add')">
                <a href="#" class="important primary undecoration">
                  <font-awesome-icon icon="plus-circle"/>&Tab;Crear un producto
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ShopResume :quantity="shoppingCar.length" :sub-total="subTotal" :currency-symbol="currency.symbol" :total-itbis="totalItbis"></ShopResume>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import ShoppingCar from "@/components/shop/ShoppingCar";
import ShopResume from "@/components/shop/ShopResume";


import products from "@/mixins/products/Products";
import ShoppingCarMixin from "@/mixins/shop/ShoppingCar";
import currencies from '@/mixins/miscellany/currencies';
import itbisMixin from '@/mixins/miscellany/Itbis';

export default {
  mixins: [products, ShoppingCarMixin,currencies,itbisMixin],
  async mounted() {
    if (this.online) {
      await this.requestProducts(axios);
      await this.requestMeasurementUnit(axios);
      await this.requestCategories(axios);
    }

    let shoppingCarTemp = await this.getShoppingCarItems();

    if (shoppingCarTemp != null) {
      this.shoppingCar = shoppingCarTemp;
    }
    this.currency = await this.getPreferredCurrency();
    this.itbis = await this.getItbisFromIndexedDb();
  },
  components: {
    MenuComponent,
    ShoppingCar,
    ShopResume
  },
  computed: {
    ...mapState([
      "products",
      "user",
      "online",
      "apiDomain",
      "measurement_units"
    ]),
    actualAvaliableProducts: function() {
      return this.products.filter(item =>
        item.name.toUpperCase().includes(this.searchProductName.toUpperCase())
      );
    },
    subTotal() {
      let total = 0;
      this.shoppingCar.forEach(item => {
        total += parseFloat(item.price) * parseFloat(item.quantity);
      });
      return total;
    },
    totalItbis(){
      let totalItbis = 0;
      this.shoppingCar.forEach(item => {
        totalItbis += (parseFloat(item.price) * parseFloat(item.quantity)) * (this.itbis / 100);
      });
      return totalItbis;
    }
  },
  data() {
    return {
      searchProductName: "",
      shoppingCar: [],
      currency:[],
      itbis:1
    };
  },
  methods: {
    ...mapMutations(["setProducts"]),
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
    isOnCar(idProduct) {
      let result;
      this.shoppingCar.forEach(item => {
        if (item.id_product == idProduct) {
          result = true;
          return;
        }
      });
      return result;
    }
  }
};
</script>

<style>
.product-main-container {
  margin-top: 20px;
  margin-bottom: 115px;
}
</style>