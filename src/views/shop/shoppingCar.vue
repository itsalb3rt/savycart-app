<template>
	<div class="shopping-car-page">
		<div class="shopping-car-page__header">
			<v-btn text class="shopping-car-page__back" @click="$router.push('/shop/registation')">
				<v-icon>fa-arrow-left</v-icon>
			</v-btn>
			<h1 class="shopping-car-page__title">{{ $t('page_titles.shopping_car') }}</h1>
		</div>

		<div v-if="shoppingCar.length > 0" class="shopping-car-page__content">
			<div class="shopping-car-page__store-field">
				<label class="shopping-car-page__store-label">{{ $t('shopping_car.store_label') }}</label>
				<input
					type="text"
					class="shopping-car-page__input"
					v-model="nameEstablishment"
					:placeholder="$t('shopping_car.name_establishment_placeholder')"
				/>
			</div>

			<div class="shopping-car-page__items">
				<div v-for="(product,index) in shoppingCar" :key="index" class="shopping-car-item">
					<div class="shopping-car-item__avatar" :style="{ background: getAvatarBg(product.name) }">
						{{ product.name.charAt(0).toUpperCase() }}
					</div>
					<div class="shopping-car-item__info">
						<div class="shopping-car-item__name">{{ product.name }}</div>
						<div class="shopping-car-item__meta">
							<span>{{ getMeasurementName(product.id_unit_measurement) }}</span>
							<span v-if="product.brand" class="shopping-car-item__separator">·</span>
							<span v-if="product.brand">{{ product.brand }}</span>
						</div>
					</div>
					<div class="shopping-car-item__right">
						<div class="shopping-car-item__price">{{ currency.symbol }}{{ (product.price * product.quantity).toFixed(2) }}</div>
						<div class="shopping-car-item__qty-control">
							<button class="shopping-car-item__qty-btn" @click="decrementQty(product)" type="button">
								<v-icon small>fa-minus</v-icon>
							</button>
							<span class="shopping-car-item__qty-value">{{ product.quantity }}</span>
							<button class="shopping-car-item__qty-btn shopping-car-item__qty-btn--plus" @click="incrementQty(product)" type="button">
								<v-icon small>fa-plus</v-icon>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Summary card -->
			<div class="shopping-car-page__summary">
				<div class="shopping-car-page__summary-row">
					<span class="shopping-car-page__summary-label">{{ $t('messages.sub_total') }}</span>
					<span class="shopping-car-page__summary-value">{{ currency.symbol }}{{ numberFormat(subTotal) }}</span>
				</div>
				<div class="shopping-car-page__summary-row">
					<span class="shopping-car-page__summary-label">{{ $t('products.tax') }}</span>
					<span class="shopping-car-page__summary-value">{{ currency.symbol }}{{ numberFormat(totalTax) }}</span>
				</div>
				<div class="shopping-car-page__divider"></div>
				<div class="shopping-car-page__summary-row shopping-car-page__summary-row--total">
					<span class="shopping-car-page__summary-label">{{ $t('messages.total') }}</span>
					<span class="shopping-car-page__summary-value">{{ currency.symbol }}{{ numberFormat(subTotal + totalTax) }}</span>
				</div>
			</div>

			<!-- Fixed bottom save button -->
			<div class="shopping-car-page__footer">
				<v-btn color="primary" class="shopping-car-page__save-btn" @click="saveShop" :disabled="disabledSubmitButton">
					{{ $t('call_action_buttons.save') }}
				</v-btn>
			</div>
		</div>

		<div v-else class="shopping-car-page__empty">
			<div class="shopping-car-page__empty-icon">
				<v-icon large color="primary">fa-shopping-cart</v-icon>
			</div>
			<h2 class="shopping-car-page__empty-title">{{ $t('shopping_car.empty_car') }}</h2>
			<p class="shopping-car-page__empty-subtitle">{{ $t('shopping_car.empty_car_subtitle') }}</p>
			<v-btn color="primary" class="shopping-car-page__empty-btn" @click="$router.push('/shop/registation')">
				{{ $t('shopping_car.start_logging') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';

export default {
	mixins: [currencies],
	mounted() {
		this.shoppingCar = this.$store.getters['shoppingCar/getAll'];
		this.currency = this.getPreferredCurrency();
	},
	components: {},
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
		getAvatarBg(name) {
			const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
			const index = (name.charCodeAt(0) || 0) % colors.length;
			return colors[index];
		},
		getMeasurementName(id) {
			let value = this.$store.getters['measurementUnits/getAll'].find(
				unit => unit.id_unit_measurement === id
			);
			return value ? value.name : '';
		},
		numberFormat(number) {
			let l10nEN = new Intl.NumberFormat('en-US');
			return l10nEN.format(number);
		},
		incrementQty(product) {
			if (product.quantity < 999) {
				product.quantity++;
			}
		},
		decrementQty(product) {
			if (product.quantity > 1) {
				product.quantity--;
			} else {
				this.removeItemFromShoppingCar(product.id_product);
			}
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
							if (error.response?.status === 500) {
								this.$store.commit('snackbar/setSnackbar', {
									show: true,
  							message: this.$t('messages.server_error'),
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
.shopping-car-page {
	padding: 16px;
	padding-bottom: 80px;
}

.shopping-car-page__header {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 20px;
}

.shopping-car-page__back {
	min-width: 32px;
	min-height: 32px;
	padding: 0;
}

.shopping-car-page__title {
	margin: 0;
	font-size: 24px;
	font-weight: 700;
	color: var(--text);
	line-height: 1.2;
}

.shopping-car-page__content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.shopping-car-page__store-field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.shopping-car-page__store-label {
	font-size: var(--fs-small);
	font-weight: 600;
	color: var(--muted);
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.shopping-car-page__input {
	width: 100%;
	height: 48px;
	padding: 0 16px;
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	background: var(--surface);
	color: var(--text);
	font-size: var(--fs-body);
	outline: none;
	transition: border-color 0.15s;
	box-sizing: border-box;
}

.shopping-car-page__input:focus {
	border-color: var(--primary);
}

.shopping-car-page__items {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.shopping-car-item {
	display: flex;
	align-items: center;
	gap: 12px;
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 12px 16px;
}

.shopping-car-item__avatar {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 700;
	color: var(--text);
	flex-shrink: 0;
}

.shopping-car-item__info {
	flex: 1;
	min-width: 0;
}

.shopping-car-item__name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	line-height: 1.3;
}

.shopping-car-item__meta {
	font-size: var(--fs-small);
	color: var(--muted);
	margin-top: 2px;
	display: flex;
	align-items: center;
	gap: 4px;
}

.shopping-car-item__separator {
	color: var(--muted);
}

.shopping-car-item__right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 6px;
	flex-shrink: 0;
}

.shopping-car-item__price {
	font-size: var(--fs-body);
	font-weight: 600;
	color: var(--text);
}

.shopping-car-item__qty-control {
	display: flex;
	align-items: center;
	gap: 4px;
	background: var(--border);
	border-radius: 22px;
	padding: 2px;
}

.shopping-car-item__qty-btn {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	border: none;
	background: var(--surface);
	color: var(--text);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	padding: 0;
}

.shopping-car-item__qty-btn--plus {
	background: var(--primary);
	color: #fff;
}

.shopping-car-item__qty-value {
	min-width: 24px;
	text-align: center;
	font-size: var(--fs-body);
	font-weight: 600;
	color: var(--text);
}

/* Summary card */
.shopping-car-page__summary {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 16px 20px;
}

.shopping-car-page__summary-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 0;
}

.shopping-car-page__summary-label {
	font-size: var(--fs-body);
	color: var(--muted);
}

.shopping-car-page__summary-value {
	font-size: var(--fs-body);
	font-weight: 600;
	color: var(--text);
}

.shopping-car-page__summary-row--total {
	padding-top: 10px;
}

.shopping-car-page__summary-row--total .shopping-car-page__summary-label {
	font-weight: 600;
	color: var(--text);
}

.shopping-car-page__summary-row--total .shopping-car-page__summary-value {
	font-size: 18px;
	font-weight: 700;
}

.shopping-car-page__divider {
	height: 1px;
	background: var(--border);
	margin: 4px 0;
}

/* Fixed bottom footer */
.shopping-car-page__footer {
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

.shopping-car-page__save-btn {
	width: 100%;
	height: 52px;
	border-radius: var(--radius-card);
	font-size: var(--fs-body);
	font-weight: 600;
}

/* Empty state */
.shopping-car-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 70vh;
	gap: 12px;
	text-align: center;
}

.shopping-car-page__empty-icon {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background: var(--primary-light);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8px;
}

.shopping-car-page__empty-title {
	margin: 0;
	font-size: 22px;
	font-weight: 700;
	color: var(--text);
}

.shopping-car-page__empty-subtitle {
	margin: 0;
	font-size: var(--fs-body);
	color: var(--muted);
	max-width: 280px;
	line-height: 1.5;
}

.shopping-car-page__empty-btn {
	margin-top: 8px;
	height: 52px;
	min-width: 200px;
	border-radius: var(--radius-card);
	font-size: var(--fs-body);
	font-weight: 600;
}
</style>
