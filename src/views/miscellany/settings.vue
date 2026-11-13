<template>
	<div class="settings-page">
		<div class="settings-page__header">
			<button class="settings-page__back-btn" @click="$router.back()" type="button">
				<v-icon>fa-chevron-left</v-icon>
			</button>
			<h1 class="settings-page__title">{{ $t('page_titles.settings') }}</h1>
		</div>

		<div class="settings-page__form">
			<div class="settings-page__field">
				<label class="settings-page__label">{{ $t('settings.currency_symbol') }}</label>
				<select class="settings-page__select" v-model="preferredCurrencyCode">
					<option v-for="currency in currenciesArray" :key="currency.code" :value="currency.code">
						{{ currency.symbol }}
					</option>
				</select>
			</div>

			<div class="settings-page__field">
				<label class="settings-page__label">{{ $t('settings.tax_rate') }}</label>
				<input
					class="settings-page__input"
					type="number"
					v-model.number="tax"
					id="tax_quantity"
				>
			</div>

			<div class="settings-page__field">
				<label class="settings-page__label">{{ $t('settings.language') }}</label>
				<select class="settings-page__select" v-model="language">
					<option v-for="lang in languageList" :key="lang.value" :value="lang.value">
						{{ lang.name }}
					</option>
				</select>
			</div>

			<p class="settings-page__hint">{{ $t('settings.tax_hint') }}</p>
		</div>

		<div class="settings-page__footer">
			<button class="settings-page__save-btn" @click="saveAll" :disabled="isLoading" type="button">
				{{ $t('products.save_changes') }}
			</button>
		</div>

		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" />
	</div>
</template>

<script>
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';

export default {
	name: 'Settings',
	mixins: [currencies],
	async mounted() {
		this.isLoading = true;
		try {
			const localStorageLanguage = window.localStorage.getItem('language');

			if (localStorageLanguage) {
				this.language = localStorageLanguage;
			} else {
				const userLanguage = navigator.language;

				if (userLanguage.includes('es')) {
					this.language = 'es';
				} else {
					this.language = 'en';
				}
			}

			this.getTax();
			const resp = await this.getCurrencies();
			if (resp) {
				this.currencies = resp;
				for (let key in resp) {
					this.currenciesArray.push({
						code: resp[key].code,
						symbol: resp[key].symbol,
						name: resp[key].name
					});
				}
			}
			this.preferredCurrency = await this.getPreferredCurrency();
			this.preferredCurrencyCode = this.preferredCurrency.code;
		} catch (error) {
			console.log('TCL: mounted -> error', error);
		} finally {
			this.isLoading = false;
		}
	},
	components: {
		Loading
	},
	data() {
		return {
			tax: 1,
			currencies: [],
			preferredCurrency: [],
			preferredCurrencyCode: '',
			currenciesArray: [],
			language: '',
			languageList: [
				{ name: 'Español', value: 'es' },
				{ name: 'English', value: 'en' }
			],
			isLoading: false
		};
	},
	methods: {
		getTax() {
			this.$store
				.dispatch('taxes/getAll')
				.then(response => {
					this.tax = response.data.data.quantity;
					this.$store.commit('taxes/SET', response.data.data.quantity);
				})
				.catch(error => {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
					console.log(error);
				});
		},
		saveAll() {
			this.isLoading = true;
			const promises = [
				this.$store.dispatch('taxes/update', { quantity: this.tax }),
				this.setPreferredCurrency(this.currencies[this.preferredCurrencyCode])
			];

			Promise.all(promises)
				.then(() => {
					this.$store.commit('taxes/SET', this.tax);
					window.localStorage.setItem('language', this.language);
					this.$i18n.locale = this.language;
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('call_action_buttons.saved'),
						color: 'success',
						top: true
					});
					this.isLoading = false;
					location.reload();
				})
				.catch(error => {
					this.isLoading = false;
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
					console.log('TCL: saveAll -> error', error);
				});
		}
	}
};
</script>

<style>
.settings-page {
	padding-bottom: 80px;
}

.settings-page__header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 24px;
}

.settings-page__back-btn {
	width: 36px;
	height: 36px;
	border: none;
	background: transparent;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text);
	border-radius: 10px;
}

.settings-page__title {
	font-size: var(--fs-title);
	font-weight: 700;
	color: var(--text);
	margin: 0;
}

.settings-page__form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.settings-page__field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.settings-page__label {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
}

.settings-page__input,
.settings-page__select {
	width: 100%;
	padding: 14px 16px;
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-control);
	font-size: var(--fs-body);
	color: var(--text);
	outline: none;
	transition: border-color 0.15s;
	appearance: none;
	-webkit-appearance: none;
}

.settings-page__select {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 16px center;
	padding-right: 40px;
}

.settings-page__input:focus,
.settings-page__select:focus {
	border-color: var(--primary);
}

.settings-page__hint {
	font-size: var(--fs-body);
	color: var(--muted);
	margin: 0;
	line-height: 1.4;
}

.settings-page__footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 16px;
	background: var(--surface);
	border-top: 1px solid var(--border);
}

.settings-page__save-btn {
	width: 100%;
	padding: 14px 24px;
	background: var(--primary);
	color: #fff;
	border: none;
	border-radius: var(--radius-control);
	font-size: var(--fs-body);
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.15s;
}

.settings-page__save-btn:hover {
	opacity: 0.9;
}

.settings-page__save-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>