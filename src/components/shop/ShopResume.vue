<template>
  <v-layout row wrap v-if="quantity > 0" class="shop-resume-bar-container">
    <v-flex xs9>
      <v-layout row wrap>
        <v-flex xs12>
          <strong>{{quantity}}</strong> articulos
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs6>
          <div>Sub-total</div>
          <div>ITBIS</div>
          <div>Total</div>
        </v-flex>
        <v-flex xs6>
          <div>
            <strong>{{currencySymbol}} {{getSubTotalInNumberFormat()}}</strong>
          </div>
          <div>
            <strong>{{currencySymbol}} {{getTotalItebisInNumberFormat()}}</strong>
          </div>
          <div>
            <p
              class="primary--text font-weight-bold"
            >{{currencySymbol}} {{getTotalInNumberFormat()}}</p>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs3 v-if="!onCar">
      <v-btn small @click="$router.push('/shop/shopping_car')" color="primary" outline>Ir a caja</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    quantity: 0,
    subTotal: 0,
    totalItbis: 0,
    onCar: false,
    currencySymbol: ""
  },
  methods: {
    getTotalInNumberFormat() {
      return this.createNumberFormat(this.subTotal + this.totalItbis);
    },
    getTotalItebisInNumberFormat() {
      return this.createNumberFormat(this.totalItbis);
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
  left: 7px;
  background-color: var(--white);
  padding: 10px 30px 0px 33px;
  border: 1px dotted var(--grey);
}
.shop-resume-bar-container hr {
  width: 100%;
  margin-left: 0px;
}
</style>
