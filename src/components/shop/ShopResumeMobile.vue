<template>
  <v-expansion-panels
    flat
    v-model="open"
    class="shop-resume-mobile"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>
        {{ $t('shopping_car.resume_title') }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row v-if="quantity > 0">
          <v-col cols="6" class="text-right reduce-20-magin-bottom quantity">
            <strong>{{ quantity }}</strong>
            {{ $t('messages.item') }}
          </v-col>
          <v-col cols="6" class="text-right reduce-20-magin-bottom sub-total">
            <strong
              >{{ currencySymbol }} {{ getSubTotalInNumberFormat() }}</strong
            >
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6" class="text-right reduce-20-magin-bottom">
            <div class="tax">{{ $t('products.tax') }}</div>
            <div class="total">{{ $t('messages.total') }}</div>
          </v-col>
          <v-col cols="6" class="text-right reduce-20-magin-bottom">
            <strong class="total-tax"
              >{{ currencySymbol }} {{ getTotalTaxInNumberFormat() }}</strong
            >
            <p class="final-total num">
              {{ currencySymbol }} {{ getTotalInNumberFormat() }}
            </p>
          </v-col>
          <v-col cols="12">
            <v-btn
              v-if="!onCar"
              block
              small
              @click="$router.push('/shop/shopping_car')"
              color="primary"
              class="mt-0 go-to-resume"
              >{{ $t('call_action_buttons.go_to_resume') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    quantity: 0,
    subTotal: 0,
    totalTax: 0,
    onCar: false,
    currencySymbol: '',
    isOpen: false
  },
  data () {
    return {
      open: false
    };
  },
  mounted () {
    this.open = this.isOpen;
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
      let l10nEN = new Intl.NumberFormat('en-US');
      return l10nEN.format(number);
    },
  },
  watch: {
    isOpen: function (val) {
      this.open = val;
    }
  }
};
</script>

<style>
.shop-resume-mobile {
  position: absolute;
  bottom: 20px;
  left: 0;
}

.shop-resume-mobile .v-expansion-panel-header {
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--text);
  min-height: 44px;
}
</style>
