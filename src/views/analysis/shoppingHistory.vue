<template>
	<div>
		<v-row v-if="shoppingHistory.length > 0">
			<v-col cols="12">
				<v-text-field
					type="search"
					:label=" $t('products.search') "
					v-model="search"
					prepend-inner-icon="fa-search"
				></v-text-field>
				<p>{{ $t('shop.ux_shopping_details_view_instructions') }}</p>
				<v-divider></v-divider>
				<v-data-table
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
								class="primary--text font-weight-bold"
							>{{item.names_establishments}}</router-link>
					</template>
          <template v-slot:item.create_at="{ item }">
						{{ item.create_at.substring(0, 10) }}
					</template>
					<template v-slot:item.total="{item}">
						<td>
							<router-link
								:to="{ name: 'purchase_details', params: { id: item.id_purchase } }"
								class="primary--text font-weight-bold"
							>{{currency.symbol}} {{createNumberFormat(item.total)}}</router-link>
						</td>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12">
				<h1 class="empty-history-information">
					<v-icon large class="mr-2">fa-history</v-icon>
					{{ $t('messages.nothing_to_display') }}
				</h1>
			</v-col>
		</v-row>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	mixins: [currencies],
	async mounted() {
		this.isLoading = true;
		this.requestShoppingHistory();
		this.currency = await this.getPreferredCurrency();
	},
	components: {
		Loading
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
	computed: {
		...mapState(['user'])
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
.empty-history-information {
	margin: 40% auto 50px;
	color: var(--grey);
}
</style>