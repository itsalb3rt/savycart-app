<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-text-field
					prepend-inner-icon="fa-search"
					v-model="searchProductName"
					:label=" $t('products.search') + '...' "
					clearable
				></v-text-field>
				<v-tabs fixed-tabs>
					<v-tab @click="showFavorites = false">
						<v-icon class="mr-2">fa-list</v-icon>
						{{ $t('products.all') }} {{!showFavorites ? filterProducts.length : null}}
					</v-tab>
					<v-tab @click="showFavorites = true">
						<v-icon class="mr-2">fa-star</v-icon>
						{{ $t('products.favorites') }} {{showFavorites ? filterProducts.length : null}}
					</v-tab>
				</v-tabs>
			</v-col>
			<v-col cols="12" v-if="filterProducts.length > 0">
				<v-virtual-scroll
          :bench="benched"
          :items="filterProducts"
          item-height="170"
					:height="screenHeightForProductContainer"
        >
					<template v-slot:default="{ item }">
						<v-card style="max-width:850px; margin:auto" class="mb-4">
							<v-card-text>
								<div>
									<span
										@click="$router.push({ name: 'view_product', params: { id: item.id_product } })"
										text
										class="ma-0 pa-0 primary--text font-weight-bold subheading"
									>{{item.name}}</span>
									<span v-if="item.favorite == '1' ">
										<v-icon color="warning" class="ml-2">fa-star</v-icon>
									</span>
								</div>
								<div class="grey--text">
									<span>{{getMeasurementName(item.id_unit_measurement)}}</span>
									<span class="float-right">{{item.brand}}</span>
								</div>
								<div class="font-weight-bold subheading">{{currency.symbol}} {{item.price}}</div>
							</v-card-text>
							<v-card-actions>
								<v-btn
									color="success"
									depressed
									outlined
									@click="$router.push({name:'edit product', params:{id: item.id_product} })"
								>
									<v-icon class="mr-1">fa-edit</v-icon>
									{{ $t('call_action_buttons.edit') }}
								</v-btn>
								<v-spacer></v-spacer>
								<v-btn
									color="error"
									text
									class="ma-0 pa-0 right"
									@click="showDialogToDeleteProduct(item.id_product)"
								>
									<v-icon class="mr-1">fa-trash</v-icon>
									{{ $t('call_action_buttons.delete') }}
								</v-btn>
							</v-card-actions>
						</v-card>
					</template>
				</v-virtual-scroll>
			</v-col>
			<v-col v-if="filterProducts.length == 0" cols="12">
				<p class="headline mt-5 grey--text font-weight-bold">{{ $t('products.empty_list') }}</p>
			</v-col>
		</v-row>
		<v-btn color="primary" dark fixed right bottom fab @click="$router.push({path:'/product/add'})">
			<v-icon>fa-plus</v-icon>
		</v-btn>
		<delete-dialog :show="dialog" @cancel="dialog = false" @confirm="deleteProduct()" />
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
		if (this.online) {
			this.getTaxes();
			this.$store.dispatch('products/getAll').then(response => {
				this.$store.commit('products/SET', response.data.data);
				this.products = this.$store.getters['products/getAll'];
				this.requestMeasurementUnit();
				this.requestCategories();
			});
			this.$store.dispatch('products/getAllBrands').then(response => {
				this.$store.commit('products/SET_BRANDS', response.data.data);
			});
		} else {
			this.products = this.$store.getters['products/getAll'];
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
			products: [],
			benched: 2
		};
	},
	computed: {
		...mapState(['user', 'online']),
		filterProducts() {
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
						'products/getAll'
					].findIndex(product => product.id_product === this.deleteProductId);
					const productIndexInView = this.products.findIndex(
						product => product.id_product === this.deleteProductId
					);
					this.$store.commit('products/REMOVE', productIndexInStore);
					this.products.splice(productIndexInView, 1);
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('products.product_removed'),
						color: 'success',
						top: true
					});
					//Reset the search
					this.searchProductName = '';
				})
				.catch(error => {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
					console.log('TCL: deleteCategory -> error', error);
				});
		},
		getTaxes() {
			this.$store.dispatch('taxes/getAll').then(response => {
				this.$store.commit('taxes/SET', response.data.data.quantity);
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
					this.$store.commit('measurementUnits/SET', response.data.data);
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