<template>
	<div class="product-form-page">
		<div class="product-form-page__header">
			<v-btn text class="product-form-page__back" @click="$router.push('/product/list')">
				<v-icon>fa-arrow-left</v-icon>
			</v-btn>
			<h1 class="product-form-page__title">{{ $t('page_titles.edit_product') }}</h1>
		</div>
		<div v-if="online">
			<v-form @submit.prevent="updateProduct" class="product-form">
				<div class="product-form__field">
					<label class="product-form__label">{{ $t('products.name') }}</label>
					<v-text-field
						id="name"
						v-model="name"
						@keyup="uppercase"
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
						required
						hide-details
						class="product-form__input"
					></v-select>
				</div>
				<div class="product-form__toggle-row">
					<div class="product-form__toggle-card">
						<span class="product-form__toggle-label">{{ $t('products.tax') }}</span>
						<v-switch
							color="primary"
							v-model="itbis"
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
							v-model="favorite"
							true-value="1"
							false-value="0"
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
				<v-btn color="primary" :disabled="name.length == 0" @click="updateProduct" class="product-form-page__save">
					{{ $t('products.save_changes') }}
				</v-btn>
				<v-btn text @click="$router.push('/product/list')" class="product-form-page__cancel">
					{{ $t('call_action_buttons.cancel') }}
				</v-btn>
			</div>
		</div>
		<div v-else>
			<offline-infomation></offline-infomation>
		</div>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
import OfflineInfomation from '@/components/Offline/OfflineInformation';

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
 				.catch(error => {
 					this.isLoading = false;
 					this.$store.commit('snackbar/setSnackbar', {
 						show: true,
 						message: this.$t('messages.server_error'),
 						color: 'error',
 						top: true
 					});
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
 				this.itbis = this.product.include_tax;
					this.description = this.product.description;
					this.isLoading = false;
					this.favorite = this.product.favorite;
					this.brand = this.product.brand;
				})
				.catch(error => {
					this.isLoading = false;
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
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
  display: flex;
  gap: 12px;
}

.product-form-page__save {
  flex: 1;
  height: 52px;
  border-radius: var(--radius-card);
  font-size: var(--fs-body);
  font-weight: 600;
}

.product-form-page__cancel {
  height: 52px;
  border-radius: var(--radius-card);
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text);
  border: 1px solid var(--border);
}
</style>
