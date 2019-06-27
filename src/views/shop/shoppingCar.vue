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
                v-model="nameEstablishment"
                placeholder="Super mercado..."
              >
            </div>
          </div>
          <div>
            <button class="button success small" @click="saveShop" :disabled="disabledSubmitButton">
              <font-awesome-icon icon="save"/>&Tab;Confirmar y guardar
            </button>
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
                  {{currency.symbol}} {{product.price * product.quantity}}
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
    <ShopResume :quantity="shoppingCar.length" :sub-total="subTotal" onCar="true" :currency-symbol="currency.symbol" :total-itbis="totalItbis"></ShopResume>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu";
import ShopResume from "@/components/shop/ShopResume";
import ShoppingCar from "@/components/shop/ShoppingCar";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import dndod from "dndod";
import "dndod/dist/dndod-popup.min.css";
import ShoppingCarMixin from "@/mixins/shop/ShoppingCar";
import currencies from '@/mixins/miscellany/currencies';
import itbisMixin from '@/mixins/miscellany/Itbis';

export default {
  mixins: [ShoppingCarMixin,currencies,itbisMixin],
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
      currency:[],
      itbis:1
    };
  },
  computed: {
    ...mapState(["user", "online", "apiDomain", "measurement_units","categories"]),
    subTotal() {
      let total = 0;
      this.shoppingCar.forEach(item => {
        total += parseInt(item.price) * parseInt(item.quantity);
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
      const notyf = new Notyf();
      this.disabledSubmitButton = true;

      if (this.online) {
        if (this.nameEstablishment.length > 0) {
          let formData = new FormData();
          await this.setMeasurementNameToProductOnShoppinCar();
          await this.setCategoryNameToProductOnShoppinCar();

          formData.append("shoppingCar", JSON.stringify(this.shoppingCar));
          formData.append("nameEstablishment", this.nameEstablishment);
          formData.append('idUser',this.user.id_user);

          axios
            .post(`${this.apiDomain}/Shopping/shopping`, formData)
            .then(response => {
              if(response.data.status == 'success'){
                notyf.success("Compra guardada");
              }
              this.clearShoppingCar();
              this.$router.push('/product/list');
            })
            .catch(function(error) {
              console.log("TCL: createCategory -> error", error);
            });
        } else {
          notyf.error("Debe colocar un nombre de establecimiento");
          this.disabledSubmitButton = false;
        }
      } else {
        notyf.error(
          "Debe estar conectado a internet para realizar esta acción."
        );
        this.disabledSubmitButton = false;
      }
    },
    setMeasurementNameToProductOnShoppinCar(){
      this.shoppingCar.forEach(product=>{
        this.measurement_units.forEach(unit=>{
          if(product.id_unit_measurement == unit.id_unit_measurement){
            product.measurementUnitName = unit.name;
            return;
          }
        })
      });
    },
    setCategoryNameToProductOnShoppinCar(){
      this.shoppingCar.forEach(product=>{
        this.categories.forEach(category=>{
          if(product.id_category == category.id_category){
            product.categoryName = category.name;
            return;
          }
        })
      });
    },
  }
};
</script>

<style>
.empty-car-information {
  margin: 40% auto 50px;
  color: var(--grey);
}
.product-main-container {
  margin-bottom: 80px;
}
</style>
