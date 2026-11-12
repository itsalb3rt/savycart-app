<template>
	<div>
		<page-header :title="$t('page_titles.shopping_history')" />
		<v-row v-if="shoppingHistory.length > 0">
			<v-col cols="12">
				<v-text-field
					type="search"
					:label=" $t('products.search') "
					v-model="search"
					prepend-inner-icon="fa-search"
					hide-details
				></v-text-field>
				<p class="text-muted shopping-history__hint">{{ $t('shop.ux_shopping_details_view_instructions') }}</p>
				<v-divider></v-divider>
				<v-data-table
					class="shopping-history-table"
					mobile-breakpoint="xs"
					:headers="headers"
					:items="shoppingHistory"
					:search="search"
				>
					<template v-slot:no-data>
						<v-alert :value="true" color="error" icon="fa-warning">{{ $t('messages.nothing_to_display') }}</v-alert>
					</template>
					<template v-slot:no-results>
						<v-alert
							:value="true"
							color="error"
							icon="fa-warning"
						>{{ $t('messages.no_match_found') }} "{{ search }}"</v-alert>
					</template>
					<template v-slot:item.names_establishments="{ item }">
						<router-link
								:to="{ name: 'purchase_details', params: { id: item.id_purchase } }"
								class="history-link"
							>{{item.names_establishments}}</router-link>
					</template>
          <template v-slot:item.create_at="{ item }">
						{{ item.create_at.substring(0, 10) }}
					</template>
					<template v-slot:item.total="{item}">
						<router-link
							:to="{ name: 'purchase_details', params: { id: item.id_purchase } }"
							class="history-link"
						>{{currency.symbol}} {{createNumberFormat(item.total)}}</router-link>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<empty-state
					icon="fa-history"
					:title="$t('messages.nothing_to_display')"
				/>
			</v-col>
		</v-row>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import PageHeader from '@/components/Interface/PageHeader';
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
		PageHeader,
		EmptyState
	},
	data() {
		return {
			shoppingHistory: [],
			currency: [],
			search: '',
			selected: [],
			headers: [
				{
					text: this.$t('shop.place'),
					align: 'left',
					value: 'names_establishments'
				},
				{ text: this.$t('messages.date'), align: 'left', value: 'create_at' },
				{ text: this.$t('messages.total'), align: 'left', value: 'total' }
			],
			isLoading: false
		};
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
		}
	}
};
</script>

<style>
.shopping-history__hint {
	margin: 8px 0 16px;
	font-size: var(--fs-body);
}

html .v-application a.history-link {
	color: var(--accent-ink);
	font-weight: 600;
	text-decoration: none;
}

html .v-application a.history-link:hover {
	text-decoration: underline;
}

.shopping-history-table th:nth-child(3),
.shopping-history-table td:nth-child(3) {
	text-align: right;
}
</style>