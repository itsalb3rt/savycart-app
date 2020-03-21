<template>
	<v-form @submit.prevent="createProduct" ref="createProduct">
		<v-row>
			<v-col cols="12">
				<v-text-field
					id="name"
					v-model="name"
					:label=" $t('products.name') "
					@keyup="uppercase"
					autocomplete="off"
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
				<v-select
					v-model="measurementUnit"
					:items="$store.getters['measurementUnits/getAll']"
					:label=" $t('products.measurement_unit') "
					item-text="name"
					item-value="id_unit_measurement"
					append-outer-icon="fa-plus"
					@click:append-outer="$router.push('/measurement_units')"
					:rules="[v => !!v || $t('messages.required_item_selection') ]"
					required
				></v-select>
				<v-select
					v-model="category"
					:items="$store.getters['categories/getAll']"
					:label=" $t('products.category') "
					item-text="name"
					item-value="id_category"
					append-outer-icon="fa-plus"
					@click:append-outer="$router.push('/categories')"
					:rules="[v => !!v || $t('messages.required_item_selection') ]"
					required
				></v-select>
				<v-switch
					color="primary"
					v-model="tax"
					:label="` ${$t('products.tax')} ${taxQuantity}% : ${(tax == '1')? $t('messages.yes') : $t('messages.no') }`"
					true-value="1"
					false-value="0"
				></v-switch>
				<p class="grey--text">{{ $t('products.tax_info') }}</p>
				<v-divider></v-divider>
				<v-switch
					color="primary"
					v-model.number="favorite"
					:label="`${$t('products.favorite_mark_message')}: ${(favorite == 1)? $t('messages.yes') : $t('messages.no') }`"
					true-value.number="1"
					false-value.number="0"
				></v-switch>
				<v-divider></v-divider>
				<v-textarea
					:label=" $t('products.description') "
					v-model="description"
					:placeholder=" $t('products.description_message') "
				></v-textarea>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn  color="primary" type="submit" :disabled="name.length == 0 || isLoading">
					<v-icon class="mr-2">fa-save</v-icon>
					{{ $t('call_action_buttons.save') }}
				</v-btn>
				<v-btn  outlined color="error" @click="$router.push('/product/list')" class="float-right">
					<v-icon class="mr-2">fa-window-close</v-icon>
					{{ $t('call_action_buttons.cancel') }}
				</v-btn>
			</v-col>
		</v-row>
		<v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
			{{snackbarMessage}}
			<v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
		</v-snackbar>
	</v-form>
</template>

<script>
import { mapState } from 'vuex';
import MenuComponent from '@/components/TheMenu.vue';

export default {
	async mounted() {
		if (this.online) {
			this.requestCategories();
			this.requestMeasurementUnit();
			this.taxQuantity = this.$store.getters['taxes/getAll'];
		}
	},
	data() {
		return {
			isLoading: false,
			name: '',
			price: 1,
			measurementUnit: '',
			category: '',
			tax: '1',
			description: '',
			favorite: 0,
			snackbarShow: false,
			snackbarMessage: '',
			snackbarColor: '',
			snackbarMultiLine: true,
			taxQuantity: 0
		};
	},
	components: {
		MenuComponent
	},
	computed: {
		...mapState(['online'])
	},
	methods: {
		createProduct() {
			if (!this.$refs.createProduct.validate()) {
				return false;
			}

			this.isLoading = true;
			let formData = new FormData();

			let product = {
				name: this.name,
				price: this.price,
				id_unit_measurement: this.measurementUnit,
				id_category: this.category,
				include_tax: this.tax,
				description: this.description,
				favorite: this.favorite
			};

			if (this.online) {
				this.$store
					.dispatch('products/create', product)
					.then(response => {
						product.id_product = response.data.data.id_product;
						this.$store.commit('products/ADD', response.data.data);
						this.snackbarShow = true;
						this.snackbarMessage = this.$t('messages.save');
						this.snackbarColor = 'success';
						this.name = '';
						this.price = 1;
						document.querySelector('#name').focus();
					})
					.catch(error => {
						if (error.response.status === 409) {
							this.snackbarShow = true;
							this.snackbarMessage = `${this.$t(
								'messages.item_already_exists'
							)}`;
							this.snackbarColor = 'error';
						}
						console.log('TCL: createCategory -> error', error);
					})
					.finally(() => {
						this.isLoading = false;
					});
			} else {
				this.snackbarShow = true;
				this.snackbarMessage = this.$t('messages.intenet_required');
				this.snackbarColor = 'error';
			}
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