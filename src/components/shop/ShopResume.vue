<template>
  <div>
    <div class="row shop-resume-bar-container" v-if="quantity > 0">
      <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">{{quantity}} articulos</div>
          <hr>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div>
              Sub-total
            </div>
            <div>
              ITBIS
            </div>
            <div>
              Total
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text right">
            <div>
              <strong>{{currencySymbol}} {{subTotal}}</strong>
            </div>
            <div>
              <strong>{{currencySymbol}} {{totalItbis}}</strong>
            </div>
            <div>
              <a href="#" class="primary important">{{currencySymbol}} {{subTotal + totalItbis}}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3" v-if="!onCar">
        <button class="button primary expand hollow" @click="$router.push('/shop/shopping_car')">Ir a caja</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quantity: 0,
    subTotal: 0,
    totalItbis:0,
    onCar:false,
    currencySymbol:''
  }
};
</script>

<style>
.shop-resume-bar-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--white);
  padding: 12px 20px;
  border: 1px dotted var(--grey);
}
.shop-resume-bar-container hr {
  width: 100%;
  margin-left: 0px;
}
</style>
