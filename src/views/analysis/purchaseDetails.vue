<template>
	<div class="purchase-details-page">
		<div class="purchase-details-page__header">
			<button class="purchase-details-page__back-btn" @click="$router.back()" type="button">
				<v-icon>fa-chevron-left</v-icon>
			</button>
			<h1 class="purchase-details-page__title">{{ $t('shop.purchase') }} #{{ purchaseDetails.purchase ? purchaseDetails.purchase.id_purchase : '' }}</h1>
		</div>

		<div v-if="purchaseDetails.establishment" class="purchase-details-page__content">
			<div class="purchase-details-page__store-card">
				<div class="purchase-details-page__store-info">
					<div class="purchase-details-page__store-name">{{ purchaseDetails.establishment.name }}</div>
					<div class="purchase-details-page__store-date">{{ purchaseDetails.purchase.create_at }}</div>
				</div>
				<button class="purchase-details-page__delete-btn" @click="dialogShowConfirmDelete = true" type="button">
					{{ $t('call_action_buttons.delete') }}
				</button>
			</div>

			<div class="purchase-details-page__products-card">
				<div
					v-for="(purchase, index) in purchaseDetails.purchase_details"
					:key="index"
					class="purchase-details-page__product-item"
					:class="{ 'purchase-details-page__product-item--divided': index > 0 }"
				>
					<div class="purchase-details-page__product-qty" :style="{ background: getAvatarBg(purchase.product_name) }">
						{{ purchase.quantity }}×
					</div>
					<div class="purchase-details-page__product-info">
						<div class="purchase-details-page__product-name">{{ purchase.product_name }}</div>
						<div class="purchase-details-page__product-tax">{{ $t(purchase.apply_itbis == '1' ? 'messages.yes' : 'messages.no') }} {{ $t('products.tax') }}</div>
					</div>
					<div class="purchase-details-page__product-price">{{ currency.symbol }}{{ createItemTotal(purchase) }}</div>
				</div>
			</div>

			<div class="purchase-details-page__summary-card">
				<div class="purchase-details-page__summary-row">
					<span class="purchase-details-page__summary-label">{{ $t('messages.sub_total') }}</span>
					<span class="purchase-details-page__summary-value">{{ currency.symbol }}{{ numberFormat(subTotal) }}</span>
				</div>
				<div class="purchase-details-page__summary-row">
					<span class="purchase-details-page__summary-label">{{ $t('products.tax') }}</span>
					<span class="purchase-details-page__summary-value">{{ currency.symbol }}{{ numberFormat(itbis) }}</span>
				</div>
				<div class="purchase-details-page__summary-row purchase-details-page__summary-row--total">
					<span class="purchase-details-page__summary-label">{{ $t('messages.total') }}</span>
					<span class="purchase-details-page__summary-value">{{ currency.symbol }}{{ numberFormat(totalPurchasePrice) }}</span>
				</div>
			</div>
		</div>

		<div v-else class="purchase-details-page__empty">
			<empty-state
				icon="fa-magic"
				:title="$t('messages.nothing_to_display')"
			/>
		</div>

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
import EmptyState from '@/components/Interface/EmptyState';

export default {
	mixins: [currencies],
	components: { deleteDialog, EmptyState },
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
		},
		createItemTotal(product) {
			let l10nEN = new Intl.NumberFormat('en-US');
			return l10nEN.format(parseFloat(product.unit_price) * parseFloat(product.quantity));
		},
		getAvatarBg(name) {
			const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
			const index = (name.charCodeAt(0) || 0) % colors.length;
			return colors[index];
		}
	}
};
</script>

<style>
.purchase-details-page {
	padding-bottom: 16px;
}

.purchase-details-page__header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.purchase-details-page__back-btn {
	width: 36px;
	height: 36px;
	border: none;
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--text);
	padding: 0;
}

.purchase-details-page__back-btn:hover {
	background: var(--surface-hover, transparent);
}

.purchase-details-page__title {
	font-size: var(--fs-title);
	font-weight: 700;
	color: var(--text);
	margin: 0;
}

.purchase-details-page__content {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.purchase-details-page__store-card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 16px 20px;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.purchase-details-page__store-name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	line-height: 1.3;
}

.purchase-details-page__store-date {
	font-size: var(--fs-small);
	color: var(--muted);
	margin-top: 4px;
}

.purchase-details-page__delete-btn {
	background: none;
	border: none;
	color: var(--negative);
	font-size: var(--fs-body);
	font-weight: 600;
	cursor: pointer;
	padding: 4px 8px;
	flex-shrink: 0;
}

.purchase-details-page__delete-btn:hover {
	opacity: 0.8;
}

.purchase-details-page__products-card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 4px;
}

.purchase-details-page__product-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
}

.purchase-details-page__product-item--divided {
	border-top: 1px solid var(--border);
}

.purchase-details-page__product-qty {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: var(--fs-body);
	font-weight: 700;
	color: var(--text);
	flex-shrink: 0;
}

.purchase-details-page__product-info {
	flex: 1;
	min-width: 0;
}

.purchase-details-page__product-name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	line-height: 1.3;
}

.purchase-details-page__product-tax {
	font-size: var(--fs-small);
	color: var(--muted);
	margin-top: 2px;
}

.purchase-details-page__product-price {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	flex-shrink: 0;
}

.purchase-details-page__summary-card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 16px 20px;
}

.purchase-details-page__summary-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 0;
}

.purchase-details-page__summary-label {
	font-size: var(--fs-body);
	color: var(--muted);
}

.purchase-details-page__summary-value {
	font-size: var(--fs-body);
	color: var(--muted);
	font-weight: 500;
}

.purchase-details-page__summary-row--total {
	border-top: 1px solid var(--border);
	margin-top: 8px;
	padding-top: 12px;
}

.purchase-details-page__summary-row--total .purchase-details-page__summary-label {
	font-size: var(--fs-section);
	font-weight: 700;
	color: var(--text);
}

.purchase-details-page__summary-row--total .purchase-details-page__summary-value {
	font-size: var(--fs-section);
	font-weight: 700;
	color: var(--text);
}

.purchase-details-page__empty {
	padding: 32px 0;
}
</style>

