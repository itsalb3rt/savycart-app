<template>
  <v-container grid-list-xs>
    <v-card flat>
      <v-card-text>
        <v-layout row wrap v-if="purchaseDetails.length == undefined">
          <v-flex xs12>
            <strong>Nombre establecimiento</strong>
            <p>{{purchaseDetails.establishment.name}}</p>
            <div>
              <v-btn
                small
                style="float:right"
                @click="removePurchase"
                flat
                color="error"
                class="ma-0"
              >
                <v-icon small class="mr-2">fa-trash</v-icon>Eliminar
              </v-btn>
            </div>
          </v-flex>
          <v-flex xs12>
            <div>
              <strong>Compra #</strong>
              {{purchaseDetails.purchase.id_purchase}}
            </div>
            <div>
              <strong>Fecha</strong>
              {{purchaseDetails.purchase.date}}
            </div>
          </v-flex>
          <v-flex xs12>
            <v-divider class="mt-2 mb-2"></v-divider>
          </v-flex>
          <v-flex xs12>
            <v-layout
              row
              wrap
              align-center
              v-for="(product,index) in purchaseDetails.purchase_details"
              :key="index"
              class="mt-1 mb-1 pt-2 pb-2"
            >
              <v-flex xs1>
                {{product.quantity}}
                <span class="quantity-indicator">x</span>
              </v-flex>
              <v-flex xs8>
                <strong>{{product.product_name}}</strong>
                <div
                  class="grey--text"
                >{{product.measurement_unit}} | ITBIS {{ (product.apply_itbis == '1')? 'SI':'NO' }}</div>
              </v-flex>
              <v-flex xs3>
                <span
                  class="font-weight-bold"
                >{{currency.symbol}} {{parseInt(product.unit_price) * parseInt(product.quantity) }}</span>
              </v-flex>
              <v-flex xs12>
                <v-divider></v-divider>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-divider class="mt-2 mb-2"></v-divider>
          </v-flex>
          <v-flex xs6>
            <div class="mt-2 mb-2">
              <strong>Sub-total</strong>
            </div>
            <div class="mt-2 mb-2">
              <strong>ITBIS</strong>
            </div>
            <div class="mt-2 mb-2">
              <strong>TOTAL</strong>
            </div>
          </v-flex>
          <v-flex xs6>
            <div class="mt-2 mb-2">{{currency.symbol}} {{numberFormat(subTotal)}}</div>
            <div class="mt-2 mb-2">{{currency.symbol}} {{numberFormat(itbis)}}</div>
            <div class="mt-2 mb-2">
              <span
                class="primary--text font-weight-bold"
              >{{currency.symbol}} {{numberFormat(totalPurchasePrice)}}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
          <v-flex xs12>
            <h1 class="mt-5">
              <v-icon large class="mr-2">fa-magic</v-icon>Nada por aqui...
            </h1>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import MenuComponent from "@/components/TheMenu.vue";
import axios from "axios";
import { mapState } from "vuex";
import dndod from "dndod";
import "dndod/dist/dndod-popup.min.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import currencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [currencies],
  async mounted() {
    this.requestPurchaseDetails();
    this.currency = await this.getPreferredCurrency();
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      purchaseDetails: [],
      currency: []
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
          `${this.apiDomain}/shopping/shopping?id_purchase=${this.$route.params.id}`
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
                  `${this.apiDomain}/shopping/shopping?id_purchase=${this.$route.params.id}`
                )
                .then(response => {
                  if (response.data.status == "success") {
                    const notyf = new Notyf();
                    notyf.success("Compra eliminada!");
                    this.$router.push("/analysis/shopping_history");
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
