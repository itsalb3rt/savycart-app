<template>
  <div>
    <v-card flat>
      <v-card-text>
        <v-layout row wrap v-if="purchaseDetails.length == undefined">
          <v-flex xs12>
            <strong>{{ $t('shopping_car.name_establishment') }}</strong>
            <p>{{purchaseDetails.establishment.name}}</p>
            <div>
              <v-btn
                small
                style="float:right"
                @click="dialogShowConfirmDelete = true"
                flat
                color="error"
                class="ma-0"
              >
                <v-icon small class="mr-2">fa-trash</v-icon>{{ $t('call_action_buttons.delete') }}
              </v-btn>
            </div>
          </v-flex>
          <v-flex xs12>
            <div>
              <strong>{{ $t('shop.purchase') }} #</strong>
              {{purchaseDetails.purchase.id_purchase}}
            </div>
            <div>
              <strong>{{ $t('messages.date') }}</strong>
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
                >{{product.measurement_unit}} | {{ $t('products.tax') }} {{ (product.apply_itbis == '1')? $t('messages.yes') : $t('messages.no') }}</div>
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
              <strong>{{ $t('messages.sub_total') }}</strong>
            </div>
            <div class="mt-2 mb-2">
              <strong>{{ $t('products.tax') }}</strong>
            </div>
            <div class="mt-2 mb-2">
              <strong>{{ $t('messages.total') }}</strong>
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
              <v-icon large class="mr-2">fa-magic</v-icon>{{ $t('messages.nothing_to_display') }}
            </h1>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-layout row justify-center>
      <v-dialog v-model="dialogShowConfirmDelete" persistent full-width>
        <v-card>
          <v-card-title class="headline">{{ $t('shop.delete_purchase') }}</v-card-title>
          <v-card-text>{{ $t('shop.delete_purchase_message') }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deletePurchase()">{{ $t('call_action_buttons.delete') }}</v-btn>
            <v-btn color="primary" flat @click="dialogShowConfirmDelete = false">{{ $t('messages.keep') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import currencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [currencies],
  async mounted() {
    this.requestPurchaseDetails();
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      purchaseDetails: [],
      currency: [],
      dialogShowConfirmDelete: false,
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: ""
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
          (parseFloat(this.purchaseDetails.tax.quantity) / 100);
      });
      return itbis;
    },
    totalPurchasePrice() {
      return parseFloat(this.subTotal) + parseFloat(this.itbis);
    }
  },
  methods: {
    requestPurchaseDetails() {
      this.$store.dispatch('shoppings/get',{id:this.$route.params.id})
        .then(response => {
          this.purchaseDetails = response.data.data;
        });
    },
    deletePurchase() {
      this.$store.dispatch('shoppings/delete',{id:this.$route.params.id})
        .then(response => {
            this.snackbarShow = true;
            this.snackbarMessage = this.$t('call_action_buttons.delete');
            this.snackbarColor = "success";

            setTimeout(() => {
              this.$router.push("/analysis/shopping_history");
            }, 1000);
        }).catch(error=>{
          console.log(error)
        })
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
