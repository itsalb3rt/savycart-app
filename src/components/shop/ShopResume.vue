<template>
	<v-row v-if="quantity > 0" class="shop-resume-bar-container constrain">
		<v-col cols="6" class="text-xs-right reduce-20-magin-bottom quantity">
			<strong>{{quantity}}</strong>
			{{ $t('messages.item') }}
		</v-col>
		<v-col cols="6" class="text-xs-right reduce-20-magin-bottom sub-total">
			<strong>{{currencySymbol}} {{getSubTotalInNumberFormat()}}</strong>
		</v-col>
		<v-col cols="12">
			<v-divider></v-divider>
		</v-col>
		<v-col cols="6" class="text-xs-right reduce-20-magin-bottom">
			<div class="tax">{{ $t('products.tax') }}</div>
			<div class="total">{{ $t('messages.total') }}</div>
		</v-col>
		<v-col cols="6" class="text-xs-right reduce-20-magin-bottom">
			<strong class="total-tax">{{currencySymbol}} {{getTotalTaxInNumberFormat()}}</strong>
			<p class="primary--text font-weight-bold final-total">{{currencySymbol}} {{getTotalInNumberFormat()}}</p>
		</v-col>
		<v-col cols="12">
			<v-btn
				v-if="!onCar"
				block
				small
				@click="$router.push('/shop/shopping_car')"
				color="primary"
				outlined
				class="mt-0 go-to-resume"
			>{{ $t('call_action_buttons.go_to_resume') }}</v-btn>
		</v-col>
	</v-row>
</template>

<script>
export default {
	props: {
		quantity: 0,
		subTotal: 0,
		totalTax: 0,
		onCar: false,
		currencySymbol: ''
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
		}
	}
};
</script>

<style>
.shop-resume-bar-container {
	position: fixed;
	bottom: 0;
	width: 100%;
	margin: auto;
	background-color: white;
	padding: 10px 30px 0px 33px;
	box-shadow: 0px 0px 4px 1px rgba(128, 128, 128, 0.16);
}

@media only screen and (max-width: 900px) {
  .shop-resume-bar-container  {
    left: 0;
  }
}
.shop-resume-bar-container hr {
	width: 100%;
	margin-left: 0px;
}
.reduce-20-magin-bottom{
  margin-bottom: -20px!important;
}
</style>
