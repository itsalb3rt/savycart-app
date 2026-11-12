<template>
	<div>
		<page-header :title="$t('page_titles.view_purchase')" />
		<v-row v-if="purchaseDetails.establishment">
			<v-col cols="12">
				<dl class="detail-grid">
					<div class="detail-grid__row">
						<dt>{{ $t('shopping_car.name_establishment') }}</dt>
						<dd class="purchase-details__establishment">
							<span>{{purchaseDetails.establishment.name}}</span>
							<v-btn small text color="error" class="purchase-details__delete" @click="dialogShowConfirmDelete = true">
								<v-icon small class="mr-2">fa-trash</v-icon>
								{{ $t('call_action_buttons.delete') }}
							</v-btn>
						</dd>
					</div>
					<div class="detail-grid__row">
						<dt>{{ $t('shop.purchase') }} #</dt>
						<dd class="num">{{purchaseDetails.purchase.id_purchase}}</dd>
					</div>
					<div class="detail-grid__row">
						<dt>{{ $t('messages.date') }}</dt>
						<dd>{{purchaseDetails.purchase.create_at}}</dd>
					</div>
				</dl>
			</v-col>
			<v-col cols="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12">
				<div
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
			<v-col cols="12">
				<dl class="detail-grid purchase-totals">
					<div class="detail-grid__row">
						<dt>{{ $t('messages.sub_total') }}</dt>
						<dd class="num">{{currency.symbol}} {{numberFormat(subTotal)}}</dd>
					</div>
					<div class="detail-grid__row">
						<dt>{{ $t('products.tax') }}</dt>
						<dd class="num">{{currency.symbol}} {{numberFormat(itbis)}}</dd>
					</div>
					<div class="detail-grid__row detail-grid__row--total">
						<dt>{{ $t('messages.total') }}</dt>
						<dd class="num">{{currency.symbol}} {{numberFormat(totalPurchasePrice)}}</dd>
					</div>
				</dl>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<empty-state
					icon="fa-magic"
					:title="$t('messages.nothing_to_display')"
				/>
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
import PageHeader from '@/components/Interface/PageHeader';
import EmptyState from '@/components/Interface/EmptyState';

export default {
	mixins: [currencies],
	components: { deleteDialog, PurchasedProduct, PageHeader, EmptyState },
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
			if (!this.purchaseDetails.purchase_details || !Array.isArray(this.purchaseDetails.purchase_details)) {
				return 0;
			}
			let subTotal = 0;
			this.purchaseDetails.purchase_details.forEach(product => {
				subTotal +=
					parseFloat(product.unit_price) * parseFloat(product.quantity);
			});
			return subTotal;
		},
		itbis() {
			if (!this.purchaseDetails.purchase_details || !Array.isArray(this.purchaseDetails.purchase_details) || !this.purchaseDetails.tax) {
				return 0;
			}
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
				})
				.catch(error => {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
					console.log('TCL: requestPurchaseDetails -> error', error);
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
.purchase-details__establishment {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.purchase-details__delete {
	flex-shrink: 0;
}

.purchase-totals .detail-grid__row {
	grid-template-columns: 1fr auto;
}

.purchase-totals dd {
	text-align: right;
}

.purchase-totals .detail-grid__row--total dt {
	color: var(--text);
	font-weight: 600;
	font-size: var(--fs-body);
}

.purchase-totals .detail-grid__row--total dd {
	font-size: var(--fs-section);
	font-weight: 600;
}
</style>

