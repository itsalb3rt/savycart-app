<template>
  <v-layout row wrap v-if="quantity > 0" class="shop-resume-bar-container">
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs6 class="text-xs-right">
          <strong>{{quantity}}</strong> {{ $t('messages.item') }}
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <strong>{{currencySymbol}} {{getSubTotalInNumberFormat()}}</strong>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <div>{{ $t('products.tax') }}</div>
          <div>{{ $t('messages.total') }}</div>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <strong>{{currencySymbol}} {{getTotalTaxInNumberFormat()}}</strong>
          <p class="primary--text font-weight-bold">{{currencySymbol}} {{getTotalInNumberFormat()}}</p>
        </v-flex>
        <v-flex xs12>
          <v-btn
            v-if="!onCar"
            block
            small
            @click="$router.push('/shop/shopping_car')"
            color="primary"
            outline
            class="mt-0"
          >{{ $t('call_action_buttons.go_to_resume') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    quantity: 0,
    subTotal: 0,
    totalTax: 0,
    onCar: false,
    currencySymbol: ""
  },
  methods: {
    getTotalInNumberFormat() {
      return this.createNumberFormat(this.subTotal + this.totalTax);
    },
    getTotalTaxInNumberFormat() {
      return this.createNumberFormat(this.totalTax);
    },
    getSubTotalInNumberFormat() {
      return this.createNumberFormat(this.subTotal);
    },
    createNumberFormat(number) {
      let l10nEN = new Intl.NumberFormat("en-US");
      return l10nEN.format(number);
    }
  }
};
</script>

<style>
.shop-resume-bar-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0px;
  background-color: white;
  padding: 10px 30px 0px 33px;
  box-shadow: 0px 0px 4px 1px rgba(128, 128, 128, 0.16);
}
.shop-resume-bar-container hr {
  width: 100%;
  margin-left: 0px;
}
</style>
