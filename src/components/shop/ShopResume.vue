<template>
  <div>
    <div class="row shop-resume-bar-container" v-if="quantity > 0">
      <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">{{quantity}} articulos</div>
          <hr>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <strong>Total:</strong>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text right">
              <strong>RD$: {{totalPrice}}</strong>
              </div>
        </div>
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
        <button class="button primary small">Ir a caja</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quantity: 0,
    totalPrice: 0
  }
};
</script>

<style>
.shop-resume-bar-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--white);
  box-shadow: 0px 0px 2px 2px var(--light-grey);
  padding: 12px 20px;
}
.shop-resume-bar-container hr {
  width: 100%;
  margin-left: 0px;
}
</style>
