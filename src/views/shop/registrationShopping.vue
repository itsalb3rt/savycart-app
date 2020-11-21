<template>
	<div>
		<v-row v-if="products.length > 0">
			<v-col cols="12">
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
			</v-col>
			<v-col cols="12" class="products-container">
				<v-virtual-scroll
          :bench="benched"
          :items="actualAvaliableProducts"
          item-height="220"
					:height="screenHeightForProductContainer"
        >				
					<template v-slot:default="{ item, index }">
						<v-card style="max-width:850px; margin:auto" class="mb-4">
							<v-card-text>
								<div
									class="primary--text font-weight-bold"
									@click="$router.push({ name: 'view_product', params: { id: item.id_product } })"
								>
									{{item.name}}
									<span v-if="item.favorite == '1' ">
										<v-icon small color="warning" class="ml-2">fa-star</v-icon>
									</span>
								</div>
								<div class="grey--text">
									<span>{{getMeasurementName(item.id_unit_measurement)}}</span>
									<span class="float-right">{{item.brand}}</span>
								</div>
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
												v-model.number="item.price"
												:disabled="isOnCar(item.id_product)"
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
												v-model.number="item.quantity"
												:disabled="isOnCar(item.id_product)"
											></v-text-field>
										</v-flex>
									</v-layout>
								</div>
							</v-card-text>
							<v-card-actions>
								<v-btn
									color="primary"
									class="ma-0"
									outlined
									v-if="!isOnCar(item.id_product)"
									@click="addItemToShoppingCar(index)"
								>{{ $t('shopping_car.add_to_shopping_car') }}</v-btn>
								<v-btn
									color="error"
									class="ma-0"
									outlined
									v-if="isOnCar(item.id_product)"
									@click="removeItemFromShoppingCar(item.id_product)"
								>{{ $t('shopping_car.remove_from_shopping_car') }}</v-btn>
							</v-card-actions>
						</v-card>
					</template>
				</v-virtual-scroll>
			</v-col>

			<v-col cols="12">
				<shop-resume
					:quantity="$store.getters['shoppingCar/getAll'].length"
					:sub-total="subTotal"
					:currency-symbol="currency.symbol"
					:total-tax="totalTax"
				></shop-resume>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<v-card flat>
					<v-card-text>
						<p class="headline grey--text">{{ $t('products.empty_list') }}</p>
						<v-btn color="primary" @click="$router.push('/product/add')">
							<v-icon class="mr-2">fa-plus-circle</v-icon>
							{{$t('call_action_buttons.create')}} {{ $t('products.product') }}
						</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
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
	mounted() {
		if (this.online) {
			this.isLoading = true;
			this.$store.dispatch('products/getAll').then(response => {
				this.$store.commit('products/SET', response.data.data);
				this.products = this.$store.getters['products/getAll'];
				this.isLoading = false;
			});
		} else {
			this.products = this.$store.getters['products/getAll'];
		}
		this.currency = this.getPreferredCurrency();
	},
	data() {
		return {
			searchProductName: '',
			currency: [],
			isLoading: false,
			showFavorites: false,
			products: [],
			benched: 2
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
			this.$store.getters['shoppingCar/getAll'].forEach(item => {
				total += parseFloat(item.price) * parseFloat(item.quantity);
			});
			return total;
		},
		totalTax() {
			let totalTax = 0;
			this.$store.getters['shoppingCar/getAll'].forEach(item => {
				totalTax +=
					parseFloat(item.price) *
					parseFloat(item.quantity) *
					(this.$store.getters['taxes/getAll'] / 100);
			});
			return totalTax;
		},
		screenHeightForProductContainer () {
			const reduce = screen.height > 736 ? 350 : 280
			return screen.height - reduce
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
			let result = this.$store.getters['shoppingCar/getAll'].find(
				item => item.id_product === idProduct
			);
			return result ? true : false;
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
			this.$store.commit(
				'shoppingCar/ADD',
				this.actualAvaliableProducts[index]
			);
		},
		removeItemFromShoppingCar(idProduct) {
			const indexInStore = this.$store.getters['shoppingCar/getAll'].findIndex(
				item => item.id_product === idProduct
			);
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
.products-container .v-virtual-scroll .v-virtual-scroll__item:last-child {
	padding-bottom: 130px;
}
</style>