<template>
	<div>
		<page-header :title="$t('page_titles.view_product')" />
		<v-row>
			<v-col cols="12" v-if="product.id_product">
				<v-card flat>
					<v-card-text>
						<div class="product-view__actions">
							<v-btn
								outlined
								color="primary"
								@click="$router.push({ name: 'edit product', params: { id: product.id_product } })"
							>
								<v-icon class="mr-2">fa-edit</v-icon>
								{{ $t('call_action_buttons.edit') }}
							</v-btn>
							<v-btn
								outlined
								color="primary"
								@click="handleShowPurchaseHistory"
							>
								<v-icon class="mr-2">fa-list</v-icon>
								{{ $t('products.viewPurchaseHistory') }}
							</v-btn>
						</div>
						<dl class="detail-grid">
							<div class="detail-grid__row">
								<dt>{{ $t('products.name') }}</dt>
								<dd>{{product.name}}</dd>
							</div>
							<div class="detail-grid__row" v-if="product.brand">
								<dt>{{ $t('products.brand') }}</dt>
								<dd>{{product.brand}}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.price') }}</dt>
								<dd class="num">{{currency.symbol}} {{product.price}}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.measurement_unit') }}</dt>
								<dd>{{getMeasurementName(product.id_unit_measurement)}}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.category') }}</dt>
								<dd>{{getCategory(product.id_category)}}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.tax') }}</dt>
								<dd>{{ (product.itbis == '1')? $t('messages.yes'): $t('messages.no') }}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.favorite_mark_message') }}</dt>
								<dd>{{ (product.favorite == '1')? $t('messages.yes'): $t('messages.no') }}</dd>
							</div>
							<div class="detail-grid__row">
								<dt>{{ $t('products.description') }}</dt>
								<dd>{{product.description}}</dd>
							</div>
						</dl>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" v-else-if="product.id_product == undefined && loading === false">
				<empty-state
					icon="fa-magic"
					:title="$t('messages.nothing_to_display')"
				/>
			</v-col>
		</v-row>
		<loading :active.sync="loading" :can-cancel="false" :is-full-page="true"></loading>
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
import PageHeader from '@/components/Interface/PageHeader';
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
		PageHeader,
		EmptyState
	},
	computed: {
		...mapState(['online'])
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
.product-view__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 8px;
}

.product-view__history-head {
	font-size: var(--fs-section);
}

.product-view__history-name {
	font-weight: 600;
	color: var(--text);
}
</style>
