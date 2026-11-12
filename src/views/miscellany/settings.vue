<template>
	<div>
		<page-header :title="$t('page_titles.settings')" />
		<div>
			<section class="settings-section">
				<div class="settings-section__label">
					<h2 class="settings-section__title">
						{{ $t('settings.currency') }}
					</h2>
					<p class="settings-section__desc">
						{{ $t('settings.currency_description') }}
					</p>
				</div>
				<div class="settings-section__panel">
					<v-select
						v-model="preferredCurrencyCode"
						:items="currenciesArray"
						:label=" $t('settings.currency') "
						item-text="symbol"
						item-value="code"
						required
					></v-select>
					<v-btn color="primary" @click="saveCurrency">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }} {{ $t('settings.currency') }}
					</v-btn>
				</div>
			</section>

			<section class="settings-section">
				<div class="settings-section__label">
					<h2 class="settings-section__title">
						{{ $t('settings.tax') }}
					</h2>
					<p class="settings-section__desc">
						{{ $t('settings.tax_description') }}
					</p>
				</div>
				<div class="settings-section__panel">
					<v-text-field
						type="number"
						v-model.number="tax"
						name="name"
						:label=" $t('settings.tax') "
						id="tax_quantity"
					></v-text-field>
					<v-btn color="primary" @click="saveTax()">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }} {{ $t('settings.tax') }}
					</v-btn>
				</div>
			</section>

			<section class="settings-section">
				<div class="settings-section__label">
					<h2 class="settings-section__title">
						{{ $t('settings.language') }}
					</h2>
				</div>
				<div class="settings-section__panel">
					<v-select
						v-model="language"
						:items="languageList"
						:label=" $t('settings.language') "
						item-text="name"
						item-value="value"
						required
					></v-select>
					<v-btn color="primary" @click="saveLanguage">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }} {{ $t('settings.language') }}
					</v-btn>
				</div>
			</section>
		</div>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" />
	</div>
</template>

<script>
import MenuComponent from '@/components/TheMenu';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import PageHeader from '@/components/Interface/PageHeader';

export default {
	name: 'Settings',
	mixins: [currencies],
	async mounted() {
		this.isLoading = true;
		try {
			const localStorageLanguage =  window.localStorage.getItem('language');

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
		MenuComponent,
		Loading,
		PageHeader
	},
	data() {
		return {
			tax: 1,
			db: [],
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
					this.$store.commit('taxes/SET',response.data.data.quantity);
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
		saveTax() {
			this.$store
				.dispatch('taxes/update', { quantity: this.tax })
				.then(response => {
					this.$store.commit('taxes/SET', this.tax);
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('call_action_buttons.saved'),
						color: 'success',
						top: true
					});
				})
				.catch(error => {
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
					console.log('TCL: saveTax -> e', error);
				});
		},
		saveCurrency() {
			this.setPreferredCurrency(
				this.currencies[this.preferredCurrencyCode]
			).then(() => {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('call_action_buttons.saved'),
					color: 'success',
					top: true
				});
			}).catch(error => {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.server_error'),
					color: 'error',
					top: true
				});
				console.log('TCL: saveCurrency -> error', error);
			});
		},
		saveLanguage() {
			window.localStorage.setItem('language', this.language);
			this.$i18n.locale = this.language;
			this.$store.commit('snackbar/setSnackbar', {
				show: true,
				message: this.$t('call_action_buttons.saved'),
				color: 'success',
				top: true
			});
			location.reload();
		}
	}
};
</script>