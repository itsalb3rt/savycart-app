<template>
  <div>
    <MenuComponent title="Carro de compra"></MenuComponent>
    <ShoppingCar :count="shoppingCar.length"></ShoppingCar>
    <div class="container-app">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="shoppingCar.length > 0">
          <div class="input-group">
            <div>
              <label for="name_establishment">Nombre de establecimiento</label>
              <input
                type="text"
                id="name_establishment"
                v-model="name_establishment"
                placeholder="Super mercado..."
              >
            </div>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 product-main-container"
          v-if="shoppingCar.length > 0"
        >
          <div class="product-container" v-for="(product,index) in shoppingCar" :key="index">
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
                  RD$ {{product.price * product.quantity}}
                  <a
                    class="danger undecoration important right"
                    @click="removeItemFromShoppingCar(product.id_product)"
                  >Eliminar del carro</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-else>
          <h1 class="empty-car-information">
            <font-awesome-icon icon="shopping-cart"/>&Tab;Tu carrito esta vacío
          </h1>
          <h3 @click="$router.push('/shop/registation')">
            <a href="#" class="important primary undecoration">
                <font-awesome-icon icon="plus-circle"/>&Tab;Ir al registro de compras
            </a>
          </h3>
        </div>
      </div>
    </div>
    <ShopResume :quantity="shoppingCar.length" :totalPrice="totalPrice" onCar="true"></ShopResume>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent";
import ShopResume from "@/components/shop/ShopResume";
import ShoppingCar from "@/components/shop/ShoppingCar";
import ShoppingCarMixin from "@/mixins/shop/ShoppingCar";
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  mixins: [ShoppingCarMixin],
  async mounted() {
    this.shoppingCar = await this.getShoppingCarItems();
  },
  components: {
    MenuComponent,
    ShopResume,
    ShoppingCar
  },
  data() {
    return {
      shoppingCar: [],
      name_establishment: ""
    };
  },
  computed: {
    ...mapState(["user", "online", "apiDomain", "measurement_units"]),
    totalPrice() {
      let total = 0;
      this.shoppingCar.forEach(item => {
        total += parseInt(item.price) * parseInt(item.quantity);
      });
      return total;
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
    }
  }
};
</script>

<style>
.empty-car-information {
  margin: 40% auto 50px;
  color: var(--grey);
}
.product-main-container{
    margin-bottom: 80px;
}
</style>
