<template>
	<div class="product-form-page">
		<div class="product-form-page__header">
			<v-btn text class="product-form-page__back" @click="$router.push('/product/list')">
				<v-icon>fa-arrow-left</v-icon>
			</v-btn>
			<h1 class="product-form-page__title">{{ $t('page_titles.add_product') }}</h1>
		</div>
		<v-form @submit.prevent="createProduct" ref="createProduct" class="product-form">
			<div class="product-form__field">
				<label class="product-form__label">{{ $t('products.name') }}</label>
				<v-text-field
					id="name"
					v-model="name"
					@keyup="uppercase"
					autocomplete="off"
					:placeholder=" $t('products.product_name_placeholder') "
					hide-details
					required
					class="product-form__input"
				></v-text-field>
			</div>
			<div class="product-form__row">
				<div class="product-form__field product-form__field--half">
					<label class="product-form__label">{{ $t('products.price') }}</label>
					<v-text-field
						type="number"
						v-model="price"
						value="1"
						min="1"
						step="0.01"
						hide-details
						required
						class="product-form__input"
					></v-text-field>
				</div>
				<div class="product-form__field product-form__field--half">
					<label class="product-form__label">{{ $t('products.measurement_unit') }}</label>
					<v-select
						v-model="measurementUnit"
						:items="$store.getters['measurementUnits/getAll']"
						item-text="name"
						item-value="id_unit_measurement"
						:placeholder="$t('products.measurement_unit')"
						:rules="[v => !!v || $t('messages.required_item_selection') ]"
						required
						hide-details
						class="product-form__input"
					></v-select>
				</div>
			</div>
			<div class="product-form__field">
				<label class="product-form__label">{{ $t('products.brand') }}</label>
				<v-combobox
					v-model.trim="brand"
					:items="$store.getters['products/getBrands']"
					:placeholder="$t('messages.select_or_add_brand')"
					hide-details
					class="product-form__input"
				></v-combobox>
			</div>
			<div class="product-form__field">
				<label class="product-form__label">{{ $t('products.category') }}</label>
				<v-select
					v-model="category"
					:items="$store.getters['categories/getAll']"
					item-text="name"
					item-value="id_category"
					:placeholder="$t('products.category')"
					:rules="[v => !!v || $t('messages.required_item_selection') ]"
					required
					hide-details
					class="product-form__input"
				></v-select>
			</div>
			<div class="product-form__toggle-row">
				<div class="product-form__toggle-card">
					<span class="product-form__toggle-label">{{ $t('products.tax') }} {{ taxQuantity }}%</span>
					<v-switch
						color="primary"
						v-model="tax"
						true-value="1"
						false-value="0"
						class="product-form__toggle"
					></v-switch>
				</div>
			</div>
			<div class="product-form__toggle-row">
				<div class="product-form__toggle-card">
					<span class="product-form__toggle-label">{{ $t('products.favorite_mark_message') }}</span>
					<v-switch
						color="primary"
						v-model.number="favorite"
						true-value.number="1"
						false-value.number="0"
						class="product-form__toggle"
					></v-switch>
				</div>
			</div>
			<div class="product-form__field">
				<label class="product-form__label">{{ $t('products.description') }}</label>
				<v-textarea
					rows="3"
					v-model="description"
					:placeholder=" $t('products.description_message') "
					hide-details
					class="product-form__input"
				></v-textarea>
			</div>
		</v-form>
		<div class="product-form-page__footer">
			<v-btn color="primary" type="submit" @click="createProduct" :disabled="name.length == 0 || isLoading" class="product-form-page__save">
				{{ $t('products.save_product') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	async mounted() {
		if (this.online) {
			this.requestCategories();
			this.requestMeasurementUnit();
			this.taxQuantity = this.$store.getters['taxes/getAll'];
			this.$store.dispatch('products/getAllBrands').then(response => {
				this.$store.commit('products/SET_BRANDS', response.data.data);
			});
		}

		if(this.$store.getters['measurementUnits/getAll'].length > 0){
			this.measurementUnit = this.$store.getters['measurementUnits/getAll'][0].id_unit_measurement;
		}

		if(this.$store.getters['categories/getAll'].length > 0){
			this.category = this.$store.getters['categories/getAll'][0].id_category;
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
			taxQuantity: 0,
			brand: ''
		};
	},
	components: {},
	computed: {
		...mapState(['online'])
	},
	methods: {
		createProduct() {
			if (!this.$refs.createProduct.validate()) {
				return false;
			}

			this.isLoading = true;

			let product = {
				name: this.name,
				price: this.price,
				id_unit_measurement: this.measurementUnit,
				id_category: this.category,
				include_tax: this.tax,
				description: this.description,
				favorite: this.favorite,
				brand: (this.brand)? this.brand.toUpperCase() : this.brand
			};

			if (this.online) {
				this.$store
					.dispatch('products/create', product)
					.then(response => {
						product.id_product = response.data.data.id_product;
						this.$store.commit('products/ADD', response.data.data);
						this.name = '';
						this.price = 1;
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('call_action_buttons.saved'),
							color: 'success',
							top: true
						});
						this.$router.push('/product/list')
					})
					.catch(error => {
						if (error.response?.status === 409) {
							this.$store.commit('snackbar/setSnackbar', {
								show: true,
								message: this.$t('messages.item_already_exists'),
								color: 'error',
								top: true
							});
						}
						console.log('TCL: createCategory -> error', error);
					})
					.finally(() => {
						this.isLoading = false;
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
			}
		},
		uppercase() {
			this.name = this.name.toUpperCase();
		},
		toUpperCaseBrand(){
			this.brand = this.brand.toUpperCase();
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

<style>
.product-form-page {
  padding: 16px;
  padding-bottom: 100px;
}

.product-form-page__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.product-form-page__back {
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}

.product-form-page__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-form__label {
  font-size: var(--fs-small);
  font-weight: 500;
  color: var(--muted);
}

.product-form__input .v-input__control {
  min-height: 48px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
}

.product-form__input .v-text-field__slot,
.product-form__input .v-select__slot {
  padding: 8px 16px;
}

.product-form__input .v-text-field__slot input,
.product-form__input .v-select__slot input {
  color: var(--text);
}

.product-form__input .v-icon {
  color: var(--muted);
}

.product-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.product-form__toggle-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-form__toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
}

.product-form__toggle-label {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text);
}

.product-form__toggle {
  margin: 0;
}

.product-form-page__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: var(--surface);
  border-top: 1px solid var(--border);
  max-width: var(--canvas-max);
  margin: 0 auto;
}

.product-form-page__save {
  width: 100%;
  height: 52px;
  border-radius: var(--radius-card);
  font-size: var(--fs-body);
  font-weight: 600;
}
</style>
