<template>
	<div>
		<v-layout row wrap v-if="products.length > 0">
			<v-flex xs12>
				<v-card flat>
					<v-card-text>
						<v-flex xs12>
							<v-text-field
								prepend-inner-icon="fa-search"
								v-model="searchProductName"
								:label=" $t('products.search') "
								clearable
							></v-text-field>
							<v-tabs fixed-tabs>
								<v-tab @click="showFavorites = false">
									<v-icon class="mr-2">fa-list</v-icon>
									{{ $t('products.all') }}
								</v-tab>
								<v-tab @click="showFavorites = true">
									<v-icon class="mr-2">fa-star</v-icon>
									{{ $t('products.favorites') }}
								</v-tab>
							</v-tabs>
						</v-flex>

						<v-flex xs12 class="products-container">
							<v-layout
								class="mt-2 mb-2"
								row
								wrap
								v-for="(product,index) in actualAvaliableProducts"
								:key="index"
							>
								<v-flex xs12>
									<v-card>
										<v-card-text>
											<div
												class="primary--text font-weight-bold"
												@click="$router.push({ name: 'view_product', params: { id: product.id_product } })"
											>
												{{product.name}}
												<span v-if="product.favorite == '1' ">
													<v-icon small color="warning" class="ml-2">fa-star</v-icon>
												</span>
											</div>
											<div class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</div>
											<div>
												<v-layout row wrap>
													<v-flex xs5 class="mr-1 ml-2">
														<v-text-field
															:label="currency.symbol"
															type="number"
															name="price"
															id="price"
															step="0.01"
															min="1"
															placeholder="1"
															v-model.number="product.price"
															:disabled="isOnCar(product.id_product)"
														></v-text-field>
													</v-flex>
													<v-flex xs5 class="ml-1">
														<v-text-field
															:label=" $t('products.quantity') "
															type="number"
															name="quantity"
															id="quantity"
															value="1"
															min="1"
															placeholder="1"
															v-model.number="product.quantity"
															:disabled="isOnCar(product.id_product)"
														></v-text-field>
													</v-flex>
												</v-layout>
											</div>
										</v-card-text>
										<v-card-actions>
											<v-btn
												color="primary"
												class="ma-0"
												outline
												v-if="!isOnCar(product.id_product)"
												@click="addItemToShoppingCar(index)"
											>{{ $t('shopping_car.add_to_shopping_car') }}</v-btn>
											<v-btn
												color="error"
												class="ma-0"
												outline
												v-if="isOnCar(product.id_product)"
												@click="removeItemFromShoppingCar(product.id_product)"
											>{{ $t('shopping_car.remove_from_shopping_car') }}</v-btn>
										</v-card-actions>
									</v-card>
								</v-flex>
							</v-layout>
						</v-flex>

						<v-flex xs12>
							<shop-resume
								:quantity="shoppingCar.length"
								:sub-total="subTotal"
								:currency-symbol="currency.symbol"
								:total-tax="totalTax"
							></shop-resume>
						</v-flex>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row wrap v-else>
			<v-flex xs12>
				<v-card flat>
					<v-card-text>
						<v-flex xs12>
							<p class="headline grey--text">{{ $t('products.empty_list') }}</p>
							<v-btn class="ml-0" color="primary" @click="$router.push('/product/add')">
								<v-icon class="mr-2">fa-plus-circle</v-icon>
							</v-btn>
						</v-flex>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import ShopResume from '@/components/shop/ShopResume';
import currencies from '@/mixins/miscellany/currencies';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	mixins: [currencies],
	async mounted() {
		if (this.online) {
			this.isLoading = true;
			this.$store.dispatch('products/getAll').then(response => {
				this.products = response.data.data;
				this.isLoading = false;
			});
			this.shoppingCar = this.$store.getters['shoppingCar/getAll'];
		}
		this.currency = await this.getPreferredCurrency();
	},
	data() {
		return {
			searchProductName: '',
			shoppingCar: [],
			currency: [],
			isLoading: false,
			showFavorites: false,
			products: []
		};
	},
	components: {
		ShopResume,
		Loading
	},
	computed: {
		...mapState(['user', 'online']),
		actualAvaliableProducts() {
			if (this.searchProductName == null) {
				this.searchProductName = '';
			}
			let filteredProducts = this.products.filter(item =>
				item.name.toUpperCase().includes(this.searchProductName.toUpperCase())
			);

			if (this.showFavorites) {
				filteredProducts = filteredProducts.filter(
					product => product.favorite == '1'
				);
			}

			return filteredProducts;
		},
		subTotal() {
			let total = 0;
			this.shoppingCar.forEach(item => {
				total += parseFloat(item.price) * parseFloat(item.quantity);
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
			let value;
			this.$store.getters['measurementUnits/getAll'].forEach(unit => {
				if (unit.id_unit_measurement == id) {
					value = unit.name;
					return;
				}
			});
			return value;
		},
		isOnCar(idProduct) {
			let result;
			this.shoppingCar.forEach(item => {
				if (item.id_product == idProduct) {
					result = true;
					return;
				}
			});
			return result;
		},
		numberFormat(number) {
			let l10nEN = new Intl.NumberFormat('en-US');
			return l10nEN.format(number);
		},
		addItemToShoppingCar(index) {
			this.actualAvaliableProducts[index].onCar = true;
			if (!this.actualAvaliableProducts[index].quantity) {
				this.actualAvaliableProducts[index].quantity = 1;
			}

			this.shoppingCar.push(this.actualAvaliableProducts[index]);
			this.$store.commit(
				'shoppingCar/ADD',
				this.actualAvaliableProducts[index]
			);
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
.product-main-container {
	margin-top: 20px;
	margin-bottom: 115px;
}
.add-remove-from-card-label {
	margin: 10px auto;
}
.products-container {
	margin-bottom: 130px;
}
</style>