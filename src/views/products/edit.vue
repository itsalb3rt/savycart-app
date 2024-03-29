<template>
	<div>
		<v-row>
			<v-col cols="12" v-if="online">
				<v-form @submit.prevent="updateProduct">
					<v-row>
						<v-col cols="12">
							<v-text-field
								id="name"
								v-model="name"
								:label=" $t('products.name') "
								@keyup="uppercase"
								:placeholder=" $t('products.product_name_placeholder') "
								required
							></v-text-field>
							<v-text-field
								type="number"
								v-model="price"
								:label=" $t('products.price') "
								value="1"
								min="1"
								step="0.01"
								required
							></v-text-field>
							<v-combobox
								v-model.trim="brand"
								:items="$store.getters['products/getBrands']"
								:label="$t('messages.select_or_add_brand')"
							></v-combobox>
							<v-select
								v-model="measurementUnit"
								:items="$store.getters['measurementUnits/getAll']"
								:label=" $t('products.measurement_unit') "
								item-text="name"
								item-value="id_unit_measurement"
								required
							></v-select>
							<v-select
								v-model="category"
								:items="$store.getters['categories/getAll']"
								:label=" $t('products.category') "
								item-text="name"
								item-value="id_category"
								required
							></v-select>
							<v-switch
								color="primary"
								v-model="itbis"
								:label="`${$t('products.tax')}: ${(itbis == '1')? $t('messages.yes') : $t('messages.no') }`"
								true-value="1"
								false-value="0"
							></v-switch>
							<p class="grey--text">{{ $t('products.tax_info') }}</p>
							<v-divider></v-divider>
							<v-switch
								color="primary"
								v-model="favorite"
								:label="`${$t('products.favorite_mark_message')}: ${(favorite == '1')? $t('messages.yes') : $t('messages.no') }`"
								true-value="1"
								false-value="0"
							></v-switch>
							<v-divider></v-divider>
							<v-textarea
								rows="3"
								:label=" $t('products.description') "
								v-model="description"
								:placeholder=" $t('products.description_message') "
							></v-textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-btn color="success" :disabled="name.length == 0" type="submit">
								<v-icon class="mr-2">fa-save</v-icon>
								{{ $t('call_action_buttons.save') }}
							</v-btn>
							<v-btn outlined color="error" @click="$router.push('/product/list')" class="float-right">
								<v-icon class="mr-2">fa-window-close</v-icon>
								{{ $t('call_action_buttons.cancel') }}
							</v-btn>
						</v-col>
					</v-row>
				</v-form>
			</v-col>
			<v-col cols="12" v-else>
				<offline-infomation></offline-infomation>
			</v-col>
		</v-row>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
import OfflineInfomation from '@/components/Offline/OfflineInformation';
import { setTimeout } from 'timers';

export default {
	name: 'ProductEdit',
	mounted() {
		if (this.online) {
			this.requestCategories();
			this.requestMeasurementUnit();
			this.getProduct();
			this.isLoading = true;
			this.$store.dispatch('products/getAllBrands').then(response => {
				this.$store.commit('products/SET_BRANDS', response.data.data);
			});
		}
	},
	data() {
		return {
			name: '',
			price: 1,
			measurementUnit: '',
			category: '',
			itbis: '1',
			description: '',
			product: [],
			isLoading: false,
			favorite: '1',
			brand: ''
		};
	},
	components: {
		Loading,
		OfflineInfomation
	},
	computed: {
		...mapState(['online'])
	},
	methods: {
		updateProduct() {
			this.isLoading = true;
			let product = {
				name: this.name,
				price: this.price,
				id_unit_measurement: this.measurementUnit,
				id_category: this.category,
				include_tax: this.itbis,
				description: this.description,
				favorite: this.favorite,
				brand: (this.brand)? this.brand.toUpperCase() : this.brand
			};

			if (this.online) {
				this.$store
					.dispatch('products/update', {
						id: this.product.id_product,
						data: product
					})
					.then(response => {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('call_action_buttons.saved'),
							color: 'success',
							top: true
						});

						setTimeout(() => {
							this.$router.go(-1);
						}, 1000);
						this.isLoading = false;
					})
					.catch(function(error) {
						console.log('TCL: createCategory -> error', error);
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
				this.isLoading = false;
			}
		},
		getProduct() {
			this.$store
				.dispatch('products/get', { id: this.$route.params.id })
				.then(response => {
					this.product = response.data.data;

					this.name = this.product.name;
					this.price = this.product.price;
					this.measurementUnit = this.product.id_unit_measurement;
					this.category = this.product.id_category;
					this.include_tax = this.product.include_tax;
					this.description = this.product.description;
					this.isLoading = false;
					this.favorite = this.product.favorite;
					this.brand = this.product.brand;
				})
				.catch(function(error) {
					console.log('TCL: requestProducts -> error', error);
				});
		},
		uppercase() {
			this.name = this.name.toUpperCase();
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