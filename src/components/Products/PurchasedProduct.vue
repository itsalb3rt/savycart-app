<template>
  <v-row>
	  <v-col cols="1" class="quantity">
	  	{{product.quantity}}
	  	<span class="quantity-indicator">x</span>
	  </v-col>
	  <v-col cols="8" class="name">
	  	<strong>{{product.product_name}}</strong>
	  	<div class="grey--text">
	  		{{product.brand}} 
	  	</div>
	  	<div
	  		class="grey--text measurement-unit"
	  	>{{product.measurement_unit}} | {{ $t('settings.tax') }}: {{ (product.apply_itbis == '1')? $t('messages.yes') : $t('messages.no') }}
	  	</div>
	  </v-col>
	  <v-col cols="3">
	  	<span
	  		class="font-weight-bold price-container"
	  	>{{currency.symbol}} {{parseInt(product.unit_price) * parseInt(product.quantity) }}</span>
	  </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'purchasedProduct',
  props: {
    product: {
      type: Object,
      required: true
    },
    currency: {
      type: Object,
      required: true
    }
  }
}
</script>