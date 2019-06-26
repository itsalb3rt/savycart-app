<template>
  <div>
    <MenuComponent title="Detalle de compra"></MenuComponent>
    <div class="container-app">
      <div class="row head-details" v-if="purchaseDetails.length == undefined">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="data">
            <div>
              <strong>Nombre establecimiento</strong>
              <a href="#" @click="removePurchase" class="danger important undecoration right">
                <font-awesome-icon icon="trash"/>&Tab;Eliminar
              </a>
              <div>{{purchaseDetails.establishment.name}}</div>
            </div>
            <div>
              <strong>Compra #</strong>
              {{purchaseDetails.purchase.id_purchase}}
            </div>
            <div>
              <strong>Fecha</strong>
              {{purchaseDetails.purchase.date}}
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 product-details-container">
          <div class="row" v-for="(product,index) in purchaseDetails.purchase_details" :key="index">
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              {{product.quantity}}
              <span class="quantity-indicator">x</span>
            </div>
            <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
              <div>
                <strong>{{product.product_name}}</strong>
              </div>
              <div
                class="information"
              >{{product.measurement_unit}} | ITBIS {{ (product.apply_itbis == '1')? 'SI':'NO' }}</div>
            </div>
            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
              <a
                href="#"
                class="primary undecoration important"
              >RD$ {{parseInt(product.unit_price) * parseInt(product.quantity) }}</a>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 final-price-details">
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="data">
                <div>
                  <strong>Sub-total</strong>
                </div>
                <div>
                  <strong>ITBIS</strong>
                </div>
                <div>
                  <strong>TOTAL</strong>
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="data">
                <div>RD$ {{numberFormat(subTotal)}}</div>
                <div>RD$ {{numberFormat(itbis)}}</div>
                <div>
                  <a href="#" class="primary important">RD$ {{numberFormat(totalPurchasePrice)}}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
          <div class="col-xs">
              <h1><font-awesome-icon icon="magic"/>&Tab;Nada por aqui...</h1>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent.vue";
import axios from "axios";
import { mapState } from "vuex";
import dndod from "dndod";
import "dndod/dist/dndod-popup.min.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mounted() {
    this.requestPurchaseDetails();
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      purchaseDetails: []
    };
  },
  computed: {
    ...mapState(["apiDomain"]),
    subTotal() {
      let subTotal = 0;
      this.purchaseDetails.purchase_details.forEach(product => {
        subTotal +=
          parseFloat(product.unit_price) * parseFloat(product.quantity);
      });
      return subTotal;
    },
    itbis() {
      let itbis = 0;
      this.purchaseDetails.purchase_details.forEach(product => {
        itbis +=
          parseFloat(product.unit_price) *
          parseFloat(product.quantity) *
          (parseFloat(this.purchaseDetails.itbis_quantity.quantity) / 100);
      });
      return itbis;
    },
    totalPurchasePrice() {
      return parseFloat(this.subTotal) + parseFloat(this.itbis);
    }
  },
  methods: {
    requestPurchaseDetails() {
      axios
        .get(
          `${this.apiDomain}/shopping/shopping?id_purchase=${
            this.$route.params.id
          }`
        )
        .then(response => {
          this.purchaseDetails = response.data;
        });
    },
    removePurchase() {
      dndod.popup({
        title: "Eliminar compra",
        msg: "Esta seguro que desea eliminar esta compra ?",
        buttons: [
          {
            text: "Mantener compra",
            handler: (e, popup) => {
              popup.close();
            }
          },
          {
            text: "Eliminarlo",
            type: "danger",
            handler: (e, popup) => {
              axios
                .delete(
                  `${this.apiDomain}/shopping/shopping?id_purchase=${
                    this.$route.params.id
                  }`
                )
                .then(response => {
                    if(response.data.status == 'success'){
                        const notyf = new Notyf();
                        notyf.success('Compra eliminada!');
                        this.$router.push('/analysis/shopping_history');
                    }
                });
              popup.close();
            }
          }
        ]
      });
    },
    numberFormat(number) {
      let l10nEN = new Intl.NumberFormat("en-US");
      return l10nEN.format(number);
    }
  }
};
</script>

<style>
.product-details-container {
  margin: 20px auto;
}
.product-details-container > div {
  margin: 10px auto;
  padding: 10px 0px;
  border-bottom: 2px solid var(--light-grey);
}
.quantity-indicator {
  color: var(--grey);
  font-weight: bold;
}
.final-price-details {
  border-bottom: 2px solid var(--light-grey);
}

.final-price-details .data > div {
  margin: 10px auto;
  text-align: right;
}

.head-details .data > div,
.head-details .data > div > div {
  margin: 10px auto;
}
</style>
