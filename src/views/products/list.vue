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
			<v-col v-if="loading" cols="12" class="text-center">
				<v-skeleton-loader 
					v-for="i in 10" 
					:key="i"
					class="mx-auto my-2"
					max-width="95%"
					max-height="150"
					type="card"
				/>
			</v-col>
			<v-col cols="12" v-else-if="filterProducts.length > 0">
				<v-virtual-scroll
          :bench="benched"
          :items="filterProducts"
          item-height="170"
					:height="screenHeightForProductContainer"
        >
					<template v-slot:default="{ item }">
						<list-product 
							:product="item"
							:currency="currency"
							@view-details="product => $router.push({ name: 'view_product', params: { id: product.id_product } })" 
							@on-edit="product => $router.push({ name: 'edit product', params: { id: product.id_product } })" 
							@on-delete="product => showDialogToDeleteProduct(product.id_product)"
							@toggle-favorite="product => toggleFavorite(product)"
							:loading-favorite="loadingFavorite"
						/>
					</template>
				</v-virtual-scroll>
			</v-col>
			<v-col v-else-if="filterProducts.length == 0" cols="12">
				<p class="headline mt-5 grey--text text-center font-weight-bold">{{ $t('products.empty_list') }}</p>
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
import ListProduct from '@/components/Products/ListProduct';

export default {
	name: 'products',
	mixins: [currencies],
	components: {
		deleteDialog,
		ListProduct
	},
	async mounted() {
		if (this.online) {
			this.loading = true;
			this.getTaxes();
			this.$store.dispatch('products/getAll').then(response => {
				this.$store.commit('products/SET', response.data.data);
				this.products = this.$store.getters['products/getAll'];
				this.requestMeasurementUnit();
				this.requestCategories();
			})
			.finally(() => {
				this.loading = false;
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
			showFavorites: false,
			dialog: false,
			deleteProductId: '',
			products: [],
			benched: 2,
			loading: false,
			loadingFavorite: false,
			currency: { symbol: '$' }
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
		},
		toggleFavorite(product) {
			if (!this.online) {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
				return;
			}
			this.loadingFavorite = true;

			this.$store
				.dispatch('products/update', {
					id: product.id_product,
					data: {
						favorite: product.favorite == '1' ? '0' : '1'
					}
				})
				.then(() => {
					const products = this.$store.getters['products/getAll'];
					const productIndex = products.findIndex(
						item => item.id_product === product.id_product
					);
					products[productIndex].favorite = product.favorite == '1' ? '0' : '1';
					this.$store.commit('products/SET', products);
				})
				.finally(() => {
					this.loadingFavorite = false;
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