<template>
	<div class="product-view-page">
		<div class="product-view-page__header">
			<v-btn text class="product-view-page__back" @click="$router.push('/product/list')">
				<v-icon>fa-arrow-left</v-icon>
			</v-btn>
			<h1 class="product-view-page__title">{{ $t('page_titles.view_product') }}</h1>
		</div>

		<loading :active.sync="loading" :can-cancel="false" :is-full-page="true"></loading>

		<div v-if="product.id_product" class="product-view-page__content">
			<div class="product-view__card product-view__card--header">
				<div class="product-view__avatar" :style="{ background: avatarBg }">
					{{ product.name.charAt(0).toUpperCase() }}
				</div>
				<div class="product-view__header-info">
					<div class="product-view__name">{{ product.name }}</div>
					<div v-if="product.brand" class="product-view__brand">{{ product.brand }}</div>
				</div>
				<div class="product-view__price">{{ currency.symbol }}{{ product.price }}</div>
			</div>

			<div class="product-view__card product-view__card--details">
				<div class="product-view__detail-row">
					<span class="product-view__detail-label">{{ $t('products.category') }}</span>
					<span class="product-view__detail-value">{{ getCategory(product.id_category) || $t('messages.no') }}</span>
				</div>
				<div class="product-view__divider"></div>
				<div class="product-view__detail-row">
					<span class="product-view__detail-label">{{ $t('products.tax') }}</span>
					<span class="product-view__detail-value">{{ (product.itbis == '1') ? $t('messages.yes') : $t('messages.no') }}</span>
				</div>
				<div class="product-view__divider"></div>
				<div class="product-view__detail-row">
					<span class="product-view__detail-label">{{ $t('products.favorite_mark_message') }}</span>
					<span class="product-view__detail-value">{{ (product.favorite == '1') ? $t('messages.yes') : $t('messages.no') }}</span>
				</div>
				<div class="product-view__divider"></div>
				<div class="product-view__detail-row">
					<span class="product-view__detail-label">{{ $t('products.measurement_unit') }}</span>
					<span class="product-view__detail-value">{{ getMeasurementName(product.id_unit_measurement) || $t('messages.no') }}</span>
				</div>
			</div>
		</div>

		<div v-else-if="product.id_product == undefined && loading === false" class="product-view-page__empty">
			<empty-state
				icon="fa-magic"
				:title="$t('messages.nothing_to_display')"
			/>
		</div>

		<div v-if="product.id_product" class="product-view-page__footer">
			<v-btn outlined color="primary" class="product-view-page__footer-btn" @click="$router.push({ name: 'edit product', params: { id: product.id_product } })">
				{{ $t('call_action_buttons.edit') }}
			</v-btn>
			<v-btn outlined color="primary" class="product-view-page__footer-btn" @click="handleShowPurchaseHistory">
				{{ $t('products.purchaseHistory') }}
			</v-btn>
		</div>

		<v-dialog
			max-width="560px"
			:fullscreen="$vuetify.breakpoint.xsOnly"
			v-model="showPurchaseHistoryDialog"
			persistent
		>
			<v-card>
				<v-card-title class="text-subtitle-1 font-weight-medium">
					{{ $t('products.purchaseHistory') }}
					<v-spacer />
					<v-btn
						icon
						aria-label="Close"
						@click="showPurchaseHistoryDialog = false"
					>
						<v-icon>fa-window-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<div class="product-view__history-head">
						<div class="product-view__history-name">{{ product.name }}</div>
						<div class="num">{{currency.symbol}} {{product.price}}</div>
					</div>
					<v-divider class="my-4" />
					<template v-if="loadingPurchaseHistory">
						<div class="text-center">
							<v-progress-circular
								:size="50"
								color="primary"
								indeterminate
							/>
						</div>
					</template>
					<template v-else>
						<template v-if="purchaseHistory.length > 0">
							<div
								row
								wrap
								align-center
								v-for="(purchase,index) in purchaseHistory"
								:key="index"
							>
								<div class="mb-2">
									<span class="font-weight-bold">
										<v-icon size="small">fa-calendar</v-icon> {{getDate(purchase.create_at)}} | {{purchase.name_establishment}}
									</span>
								</div>
								<purchased-product :product="purchase" :currency="currency" />
								<v-divider class="my-4" />
							</div>
						</template>
						<template v-else>
							<empty-state
								inline
								icon="fa-shopping-cart"
								:title="$t('messages.nothing_to_display')"
							/>
						</template>
					</template>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import PurchasedProduct from '@/components/Products/PurchasedProduct';
import Formats from '@/mixins/miscellany/formats';
import EmptyState from '@/components/Interface/EmptyState';

export default {
	name: 'ProductView',
	mixins: [currencies, Formats],
	async mounted() {
		if (this.online) {
			this.loading = true;
			await this.requestCategories();
			await this.requestMeasurementUnit();
			await this.getProduct();
		} else {
			this.loading = false;
		}
		this.currency = await this.getPreferredCurrency();
	},
	data() {
		return {
			loading:false,
			product: [],
			currency: [],
			showPurchaseHistoryDialog: false,
			purchaseHistory: [],
			loadingPurchaseHistory: false,
		};
	},
	components: {
		Loading,
		PurchasedProduct,
		EmptyState
	},
	computed: {
		...mapState(['online']),
		avatarBg() {
			const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
			const index = (this.product.name.charCodeAt(0) || 0) % colors.length;
			return colors[index];
		}
	},
	methods: {
		...mapMutations(['setCategories']),
		getProduct() {
			this.$store.dispatch('products/get',{id:this.$route.params.id})
				.then(response => {
					this.product = response.data.data;
				})
				.catch(function(error) {
					console.log('TCL: requestProducts -> error', error);
				}).finally(()=>{
					this.loading = false
				})
		},
		getMeasurementName(id) {
			let value;
			this.$store.getters['measurementUnits/getAll'].forEach(unit => {
				if (unit.id_unit_measurement == id) {
					value = unit.name;
					return;
				}
			});
			return value;
		},
		getCategory(id) {
			let value;
			this.$store.getters['categories/getAll'].forEach(category => {
				if (category.id_category == id) {
					value = category.name;
					return;
				}
			});
			return value;
		},
		requestCategories() {
			this.$store
				.dispatch('categories/getAll')
				.then(response => {
					this.$store.commit('categories/SET', response.data.data);
				})
				.catch(error => {
					console.log(error);
				});
		},
				requestMeasurementUnit() {
			this.$store
				.dispatch('measurementUnits/getAll')
				.then(response => {
					this.$store.commit('measurementUnits/SET', response.data.data);
				})
				.catch(error => {
					console.log(error);
				});
		},
		handleShowPurchaseHistory () {
			this.showPurchaseHistoryDialog = true;
			this.loadingPurchaseHistory = true;

			this.$store.dispatch('products/getPurchaseHistory',{id:this.$route.params.id})
				.then(response => {
					this.purchaseHistory = response.data.data.purchases;
				})
				.catch(function(error) {
					console.log('TCL: requestProducts -> error', error);
				}).finally(()=>{
					this.loadingPurchaseHistory = false
				})
		}
	}
};
</script>
<style>
.product-view-page {
	padding: 16px;
	padding-bottom: 100px;
}

.product-view-page__header {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 24px;
}

.product-view-page__back {
	min-width: 32px;
	min-height: 32px;
	padding: 0;
}

.product-view-page__title {
	margin: 0;
	font-size: 24px;
	font-weight: 700;
	color: var(--text);
	line-height: 1.2;
}

.product-view-page__content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.product-view-page__empty {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 60vh;
}

.product-view__card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 20px;
}

.product-view__card--header {
	display: flex;
	align-items: center;
	gap: 16px;
}

.product-view__avatar {
	width: 56px;
	height: 56px;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: 700;
	color: var(--text);
	flex-shrink: 0;
}

.product-view__header-info {
	flex: 1;
	min-width: 0;
}

.product-view__name {
	font-size: 18px;
	font-weight: 700;
	color: var(--text);
	line-height: 1.3;
}

.product-view__brand {
	font-size: var(--fs-small);
	color: var(--muted);
	margin-top: 2px;
}

.product-view__price {
	font-size: 20px;
	font-weight: 700;
	color: var(--text);
	flex-shrink: 0;
}

.product-view__detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
}

.product-view__detail-label {
	font-size: var(--fs-body);
	color: var(--muted);
}

.product-view__detail-value {
	font-size: var(--fs-body);
	font-weight: 600;
	color: var(--text);
}

.product-view__divider {
	height: 1px;
	background: var(--border);
}

.product-view-page__footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 16px;
	padding-bottom: calc(16px + env(safe-area-inset-bottom));
	background: var(--surface);
	border-top: 1px solid var(--border);
	display: flex;
	gap: 12px;
	max-width: var(--canvas-max);
	margin: 0 auto;
}

.product-view-page__footer-btn {
	flex: 1;
	height: 52px;
	border-radius: var(--radius-card);
	font-size: var(--fs-body);
	font-weight: 600;
}

.product-view__history-head {
	font-size: var(--fs-section);
}

.product-view__history-name {
	font-weight: 600;
	color: var(--text);
}
</style>
