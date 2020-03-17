<template>
	<div>
		<v-layout row wrap>
			<v-flex xs12>
				<v-card flat>
					<v-card-text>
						<v-flex xs12 >
							<v-text-field
								prepend-inner-icon="fa-search"
								v-model="searchProductName"
								:label=" $t('products.search') + '...' "
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
						<v-flex xs12 class="mt-3" v-if="filterProducts.length > 0">
							<v-layout class="mt-2 mb-2" row wrap v-for="(product,index) in filterProducts" :key="index">
								<v-flex xs12>
									<v-card>
										<v-card-text>
											<v-flex xs12>
												<div>
													<span
														@click="$router.push({ name: 'view_product', params: { id: product.id_product } })"
														flat
														small
														class="ma-0 pa-0 primary--text font-weight-bold subheading"
													>{{product.name}}</span>
													<span v-if="product.favorite == '1' ">
														<v-icon small color="warning" class="ml-2">fa-star</v-icon>
													</span>
												</div>
												<div class="grey--text">{{getMeasurementName(product.id_unit_measurement)}}</div>
												<div class="font-weight-bold subheading">{{currency.symbol}} {{product.price}}</div>
											</v-flex>
										</v-card-text>
										<v-card-actions>
											<v-btn
												color="success"
												small
												depressed
												outline
												class="ma-0 pa-0 right"
												@click="$router.push({name:'edit product', params:{id: product.id_product} })"
											>
												<v-icon small class="mr-1">fa-edit</v-icon>
												{{ $t('call_action_buttons.edit') }}
											</v-btn>
											<v-spacer></v-spacer>
											<v-btn
												color="error"
												small
												flat
												class="ma-0 pa-0 right"
												@click="showDialogToDeleteProduct(product.id_product)"
											>
												<v-icon small class="mr-1">fa-trash</v-icon>
												{{ $t('call_action_buttons.delete') }}
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-flex>
							</v-layout>
						</v-flex>
						<v-flex v-if="filterProducts.length == 0" xs12>
							<p class="headline mt-5 grey--text font-weight-bold">{{ $t('products.empty_list') }}</p>
						</v-flex>
						<v-btn
							color="primary"
							dark
							fixed
							right
							bottom
							fab
							@click="$router.push({path:'/product/add'})"
						>
							<v-icon>fa-plus</v-icon>
						</v-btn>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row justify-center>
			<delete-dialog :show="dialog" @cancel="dialog = false" @confirm="deleteProduct()" />
		</v-layout>
		<v-snackbar v-model="successDeleteProduct" color="success">
			{{ $t('products.product_removed') }}
			<v-btn dark flat @click="successDeleteProduct = false">{{ $t('call_action_buttons.close') }}</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
import deleteDialog from '@/components/Interface/Dialogs/Delete';

import { mapState, mapMutations } from 'vuex';

import currencies from '@/mixins/miscellany/currencies';

export default {
	mixins: [currencies],
	components: {
		deleteDialog
	},
	async mounted() {
		
		this.products = this.$store.getters['products/getProducts'];

		if (this.online) {
			this.getTaxes();
			this.$store.dispatch('products/getAll').then(response => {
				this.$store.commit('products/SET', response.data.data);
				this.products = this.$store.getters['products/getProducts'];
				this.requestMeasurementUnit();
				this.requestCategories();
			});
		}
		this.currency = await this.getPreferredCurrency();
	},
	data() {
		return {
			searchProductName: '',
			currency: [],
			showFavorites: false,
			dialog: false,
			deleteProductId: '',
			successDeleteProduct: false,
			products: []
		};
	},
	computed: {
		...mapState(['user', 'online']),
		filterProducts() {
			if (this.searchProductName == null) {
				this.searchProductName = '';
			}
			let filteredProducts = this.products.filter(item =>
				item.name
					.toUpperCase()
					.includes(this.searchProductName.toUpperCase())
			);

			if (this.showFavorites) {
				filteredProducts = filteredProducts.filter(
					product => product.favorite == '1'
				);
			}

			return filteredProducts;
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
		showDialogToDeleteProduct(idProduct) {
			this.dialog = true;
			this.deleteProductId = idProduct;
		},
		deleteProduct() {
			/**
			 * Delete the product from store, local copy and database
			 */
			this.$store
				.dispatch('products/delete', { id: this.deleteProductId })
				.then(response => {
					this.dialog = false;
					const productIndexInStore = this.$store.getters[
						'products/getProducts'
					].findIndex(
						product => product.id_product === this.deleteProductId
					);
					const productIndexInView = this.products.findIndex(
						product => product.id_product === this.deleteProductId
					);
					this.$store.commit('products/REMOVE', productIndexInStore);
					this.products.splice(productIndexInView, 1);
					this.successDeleteProduct = true;
					//Reset the search
					this.searchProductName = '';
				})
				.catch(function(error) {
					console.log('TCL: deleteCategory -> error', error);
				});
		},
		getTaxes() {
			this.$store.dispatch('taxes/getAll').then(response => {
				this.tax = response.data.data.quantity;
			});
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
					this.$store.commit(
						'measurementUnits/SET',
						response.data.data
					);
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>
<style lang="css">
.right {
	float: right !important;
}
</style>