<template>
	<div>
		<page-header :title="$t('page_titles.shopping_car')" />
		<v-row v-if="shoppingCar.length > 0" class="products-container">
			<v-col cols="12">
				<v-text-field
					name="name_establishment"
					:label=" $t('shopping_car.name_establishment') "
					v-model="nameEstablishment"
					id="name_establishment"
					:placeholder=" $t('shopping_car.name_establishment_placeholder') "
					hide-details
				></v-text-field>
				<v-btn class="ml-0 mt-3" color="primary" @click="saveShop" :disabled="disabledSubmitButton">
					<v-icon small class="mr-2">fa-save</v-icon>
					{{ $t('call_action_buttons.save') }}
				</v-btn>
				<v-divider class="mt-3 mb-3"></v-divider>
			</v-col>
			<v-col cols="12" v-for="(product,index) in shoppingCar" :key="index">
				<v-card outlined class="shopping-car-item mb-2">
					<v-card-text>
						<v-row>
							<v-col cols="12" class="reduce-20-margin-bottom">
								<span class="shopping-car-item__name">{{product.name}}</span>
							</v-col>
							<v-col cols="12" class="reduce-20-margin-bottom">
								<div class="text-muted shopping-car-item__meta">
									<span>{{getMeasurementName(product.id_unit_measurement)}}</span>
									<span class="float-right">{{product.brand}}</span>
								</div>
							</v-col>
							<v-col cols="12" class="reduce-20-margin-bottom">
								<strong class="num">{{currency.symbol}} {{product.price * product.quantity}}</strong>
							</v-col>
							<v-col cols="12" class="reduce-20-margin-bottom">
								<v-text-field
									type="number"
									min="1"
									name="quantity"
									:label=" $t('products.quantity') "
									id="quantity"
									v-model="product.quantity"
									hide-details
								></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn
							color="error"
							outlined
							@click="removeItemFromShoppingCar(product.id_product)"
						>{{ $t('shopping_car.remove_from_shopping_car') }}</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<empty-state
					icon="fa-shopping-cart"
					:title="$t('shopping_car.empty_car')"
				>
					<template v-slot:action>
						<v-btn text href="#" class="primary--text ml-0" @click="$router.push('/shop/registation')">
							<v-icon class="mr-2">fa-plus-circle</v-icon>
							{{ $t('shopping_car.go_to_logger_purchase') }}
						</v-btn>
					</template>
				</empty-state>
			</v-col>
		</v-row>
		<ShopResume
			:quantity="shoppingCar.length"
			:sub-total="subTotal"
			onCar="true"
			:currency-symbol="currency.symbol"
			:total-tax="totalTax"
		></ShopResume>
	</div>
</template>

<script>
import PageHeader from '@/components/Interface/PageHeader';
import EmptyState from '@/components/Interface/EmptyState';
import ShopResume from '@/components/shop/ShopResume';
import { mapState, mapMutations } from 'vuex';

import currencies from '@/mixins/miscellany/currencies';

export default {
	mixins: [currencies],
	mounted() {
		this.shoppingCar = this.$store.getters['shoppingCar/getAll'];
		this.currency = this.getPreferredCurrency();
	},
	components: {
		ShopResume,
		PageHeader,
		EmptyState
	},
	data() {
		return {
			shoppingCar: [],
			nameEstablishment: '',
			disabledSubmitButton: false,
			currency: []
		};
	},
	computed: {
		...mapState(['online']),
		subTotal() {
			let total = 0;
			this.shoppingCar.forEach(item => {
				total += parseInt(item.price) * parseInt(item.quantity);
			});
			return total;
		},
		totalTax() {
			let totalTax = 0;
			this.shoppingCar.forEach(item => {
				totalTax +=
					parseFloat(item.price) *
					parseFloat(item.quantity) *
					(this.$store.getters['taxes/getAll'] / 100);
			});
			return totalTax;
		}
	},
	methods: {
		getMeasurementName(id) {
			let value = this.$store.getters['measurementUnits/getAll'].find(
				unit => unit.id_unit_measurement === id
			);
			return value.name;
		},
		async saveShop() {
			this.disabledSubmitButton = true;

			if (this.online) {
				if (this.nameEstablishment.length > 0) {
					await this.setMeasurementNameToProductOnShoppinCar();
					await this.setCategoryNameToProductOnShoppinCar();

					const details = {
						shoppingCar: this.shoppingCar,
						nameEstablishment: this.nameEstablishment
					};

					this.$store
						.dispatch('shoppings/create', details)
						.then(response => {
							this.$store.commit('snackbar/setSnackbar', {
								show: true,
								message: `${this.$t('shop.purchase')} ${this.$t(
									'messages.saved'
								)}`,
								color: 'success',
								top: true
							});
							this.$store.commit('shoppingCar/SET', []);
							setTimeout(() => {
								this.$router.push('/product/list');
							}, 1000);
						})
						.catch(error => {
							if (error.response.status === 500) {
								this.$store.commit('snackbar/setSnackbar', {
									show: true,
									message: this.$t('message.server_error'),
									color: 'error',
									top: true
								});
							}
							this.disabledSubmitButton = false;
							console.log('TCL: createCategory -> error', error);
						});
				} else {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('shopping_car.name_establishment'),
						color: 'error',
						top: true
					});
					this.disabledSubmitButton = false;
				}
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
				this.disabledSubmitButton = false;
			}
		},
		setMeasurementNameToProductOnShoppinCar() {
			this.shoppingCar.forEach(product => {
				this.$store.getters['measurementUnits/getAll'].forEach(unit => {
					if (product.id_unit_measurement == unit.id_unit_measurement) {
						product.measurementUnitName = unit.name;
						return;
					}
				});
			});
		},
		setCategoryNameToProductOnShoppinCar() {
			this.shoppingCar.forEach(product => {
				this.$store.getters['categories/getAll'].forEach(category => {
					if (product.id_category == category.id_category) {
						product.categoryName = category.name;
						return;
					}
				});
			});
		},
		removeItemFromShoppingCar(idProduct) {
			const indexInStore = this.shoppingCar.findIndex(
				item => item.id_product === idProduct
			);
			const indexInView = this.shoppingCar.findIndex(
				item => item.id_product === idProduct
			);

			this.shoppingCar.splice(indexInView, 1);
			this.$store.commit('shoppingCar/REMOVE', indexInStore);
		}
	}
};
</script>

<style>
.shopping-car-item__name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
}

.shopping-car-item__meta {
	font-size: var(--fs-body);
}

.reduce-20-margin-bottom {
	margin-bottom: -20px !important;
}
.products-container {
	margin-bottom: var(--resume-bar-h);
	padding-bottom: 20px;
}

</style>
