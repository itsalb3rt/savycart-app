<template>
	<div class="shopping-history-page">
		<div class="shopping-history-page__header">
			<h1 class="shopping-history-page__title">{{ $t('page_titles.shopping_history') }}</h1>
			<p class="shopping-history-page__subtitle">{{ shoppingHistory.length }} {{ $t('shopping_history.purchases_count') }}</p>
		</div>

		<div v-if="shoppingHistory.length > 0" class="shopping-history-page__content">
			<div class="shopping-history-page__total-card">
				<span class="shopping-history-page__total-label">{{ $t('shopping_history.total_spent') }}</span>
				<span class="shopping-history-page__total-value">{{ currency.symbol }}{{ createNumberFormat(totalSpent) }}</span>
			</div>

			<div class="shopping-history-page__search">
				<v-text-field
					type="search"
					:label="$t('shopping_history.search_purchases')"
					v-model="search"
					prepend-inner-icon="fa-search"
					hide-details
					class="shopping-history-page__search-input"
				></v-text-field>
			</div>

			<div class="shopping-history-page__list">
				<div
					v-for="item in filteredHistory"
					:key="item.id_purchase"
					class="shopping-history-page__item"
					@click="$router.push({ name: 'purchase_details', params: { id: item.id_purchase } })"
				>
					<div class="shopping-history-page__item-avatar" :style="{ background: getAvatarBg(item.names_establishments) }">
						{{ item.names_establishments.charAt(0).toUpperCase() }}
					</div>
					<div class="shopping-history-page__item-info">
						<div class="shopping-history-page__item-name">{{ item.names_establishments }}</div>
						<div class="shopping-history-page__item-date">{{ formatDate(item.create_at) }}</div>
					</div>
					<div class="shopping-history-page__item-total">{{ currency.symbol }}{{ createNumberFormat(item.total) }}</div>
					<v-icon class="shopping-history-page__item-chevron" small>fa-chevron-right</v-icon>
				</div>
			</div>
		</div>

		<div v-else class="shopping-history-page__empty">
			<empty-state
				icon="fa-history"
				:title="$t('messages.nothing_to_display')"
			/>
		</div>

		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import EmptyState from '@/components/Interface/EmptyState';

export default {
	mixins: [currencies],
	async mounted() {
		this.isLoading = true;
		this.requestShoppingHistory();
		this.currency = await this.getPreferredCurrency();
	},
	components: {
		Loading,
		EmptyState
	},
	data() {
		return {
			shoppingHistory: [],
			currency: [],
			search: '',
			isLoading: false
		};
	},
	computed: {
		totalSpent() {
			return this.shoppingHistory.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
		},
		filteredHistory() {
			if (!this.search) {
				return this.shoppingHistory;
			}
			const q = this.search.toLowerCase();
			return this.shoppingHistory.filter(item =>
				item.names_establishments.toLowerCase().includes(q)
			);
		}
	},
	methods: {
		requestShoppingHistory() {
			this.$store
				.dispatch('shoppings/getAll')
				.then(response => {
					this.shoppingHistory = response.data.data;
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
					console.log(error);
				});
		},
		createNumberFormat(number) {
			let l10nEN = new Intl.NumberFormat('en-US');
			return l10nEN.format(number);
		},
		formatDate(dateStr) {
			if (!dateStr) return '';
			const date = new Date(dateStr);
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		},
		getAvatarBg(name) {
			const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
			const index = (name.charCodeAt(0) || 0) % colors.length;
			return colors[index];
		}
	}
};
</script>

<style>
.shopping-history-page {
	padding-bottom: 16px;
}

.shopping-history-page__header {
	margin-bottom: 16px;
}

.shopping-history-page__title {
	font-size: var(--fs-title);
	font-weight: 700;
	color: var(--text);
	margin: 0 0 4px;
}

.shopping-history-page__subtitle {
	font-size: var(--fs-body);
	color: var(--muted);
	margin: 0;
}

.shopping-history-page__content {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.shopping-history-page__total-card {
	background: var(--primary);
	border-radius: var(--radius-card);
	padding: 20px;
	color: #fff;
}

.shopping-history-page__total-label {
	display: block;
	font-size: var(--fs-small);
	opacity: 0.9;
	margin-bottom: 4px;
}

.shopping-history-page__total-value {
	display: block;
	font-size: var(--fs-kpi);
	font-weight: 700;
}

.shopping-history-page__search {
	margin: 0;
}

.shopping-history-page__search-input >>> .v-input__control {
	padding: 0;
}

.shopping-history-page__search-input >>> .v-text-field__slot {
	margin: 0;
}

.shopping-history-page__search-input >>> input {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-control);
}

.shopping-history-page__list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.shopping-history-page__item {
	display: flex;
	align-items: center;
	gap: 12px;
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	padding: 12px 16px;
	cursor: pointer;
	transition: background 0.15s;
}

.shopping-history-page__item:hover {
	background: var(--surface-hover, transparent);
}

.shopping-history-page__item-avatar {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 700;
	color: var(--primary);
	flex-shrink: 0;
}

.shopping-history-page__item-info {
	flex: 1;
	min-width: 0;
}

.shopping-history-page__item-name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.shopping-history-page__item-date {
	font-size: var(--fs-small);
	color: var(--muted);
	margin-top: 2px;
}

.shopping-history-page__item-total {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	flex-shrink: 0;
}

.shopping-history-page__item-chevron {
	color: var(--faint);
	flex-shrink: 0;
}

.shopping-history-page__empty {
	padding: 32px 0;
}
</style>