<template>
	<div>
		<v-row v-if="purchaseDetails.establishment">
			<v-col cols="12">
				<strong>{{ $t('shopping_car.name_establishment') }}</strong>
				<p>
					{{purchaseDetails.establishment.name}}
					<v-btn small class="float-right" @click="dialogShowConfirmDelete = true" text color="error">
						<v-icon small class="mr-2">fa-trash</v-icon>
						{{ $t('call_action_buttons.delete') }}
					</v-btn>
				</p>
			</v-col>
			<v-col cols="12">
				<div>
					<strong>{{ $t('shop.purchase') }} #</strong>
					{{purchaseDetails.purchase.id_purchase}}
				</div>
				<div>
					<strong>{{ $t('messages.date') }}</strong>
					{{purchaseDetails.purchase.create_at}}
				</div>
			</v-col>
			<v-col cols="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12">
				<div
					row
					wrap
					align-center
					v-for="(purchase,index) in purchaseDetails.purchase_details"
					:key="index"
				>
					<purchased-product :product="purchase" :currency="currency" />
					<v-divider class="my-4" />
				</div>
			</v-col>
			<v-col cols="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="6">
				<div class="mt-2 mb-2">
					<strong>{{ $t('messages.sub_total') }}</strong>
				</div>
				<div class="mt-2 mb-2">
					<strong>{{ $t('products.tax') }}</strong>
				</div>
				<div class="mt-2 mb-2">
					<strong>{{ $t('messages.total') }}</strong>
				</div>
			</v-col>
			<v-col cols="6">
				<div class="mt-2 mb-2">{{currency.symbol}} {{numberFormat(subTotal)}}</div>
				<div class="mt-2 mb-2">{{currency.symbol}} {{numberFormat(itbis)}}</div>
				<div class="mt-2 mb-2">
					<span
						class="primary--text font-weight-bold"
					>{{currency.symbol}} {{numberFormat(totalPurchasePrice)}}</span>
				</div>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<h1 class="mt-10 pt-10">
					<v-icon large class="mr-2">fa-magic</v-icon>
					{{ $t('messages.nothing_to_display') }}
				</h1>
			</v-col>
		</v-row>
		<delete-dialog
			:show="dialogShowConfirmDelete"
			@cancel="dialogShowConfirmDelete = false"
			@confirm="deletePurchase()"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import deleteDialog from '@/components/Interface/Dialogs/Delete';
import PurchasedProduct from '@/components/Products/PurchasedProduct';

export default {
	mixins: [currencies],
	components: { deleteDialog, PurchasedProduct },
	async mounted() {
		this.requestPurchaseDetails();
		this.currency = await this.getPreferredCurrency();
	},
	data() {
		return {
			purchaseDetails: [],
			currency: [],
			dialogShowConfirmDelete: false
		};
	},
	computed: {
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
			this.$store
				.dispatch('shoppings/get', { id: this.$route.params.id })
				.then(response => {
					this.purchaseDetails = response.data.data;
				});
		},
		deletePurchase() {
			this.$store
				.dispatch('shoppings/delete', { id: this.$route.params.id })
				.then(response => {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('call_action_buttons.deleted'),
						color: 'success',
						top: true
					});

					setTimeout(() => {
						this.$router.push('/analysis/shopping_history');
					}, 1000);
				})
				.catch(error => {
					console.log(error);
				});
		},
		numberFormat(number) {
			let l10nEN = new Intl.NumberFormat('en-US');
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
