<template>
	<div>
		<v-row>
			<v-col cols="12" v-if="product.id_product">
				<v-card flat>
					<v-card-text>
						<v-btn
							outlined
							color="success"
							@click="$router.push({ name: 'edit product', params: { id: product.id_product } })"
							class="ml-0"
						>
							<v-icon class="mr-2">fa-edit</v-icon>
							{{ $t('call_action_buttons.edit') }}
						</v-btn>
						<div>
							<div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.name') }}</div>
							<div>{{product.name}}</div>
						</div>
						<div>
							<div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.price') }}</div>
							<div>{{currency.symbol}} {{product.price}}</div>
						</div>
						<div>
							<div
								for="name"
								class="subheading font-weight-bold mt-4 mb-2"
							>{{ $t('products.measurement_unit') }}</div>
							<div>{{getMeasurementName(product.id_unit_measurement)}}</div>
						</div>
						<div>
							<div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.category') }}</div>
							<div>{{getCategory(product.id_category)}}</div>
						</div>
						<div>
							<div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.tax') }}</div>
							<div>{{ (product.itbis == '1')? $t('messages.yes'): $t('messages.no') }}</div>
						</div>
						<div>
							<div
								for="name"
								class="subheading font-weight-bold mt-4 mb-2"
							>{{ $t('products.favorite_mark_message') }}</div>
							<div>{{ (product.favorite == '1')? $t('messages.yes'): $t('messages.no') }}</div>
						</div>
						<div>
							<div
								for="name"
								class="subheading font-weight-bold mt-4 mb-2"
							>{{ $t('products.description') }}</div>
							<div>{{product.description}}</div>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" v-else-if="product.id_product == undefined && loading === false">
				<div class="display-1 mt-5">
					<v-icon class="mr-2">fa-magic</v-icon>
					{{ $t('messages.nothing_to_display') }}
				</div>
			</v-col>
		</v-row>
		<loading :active.sync="loading" :can-cancel="false" :is-full-page="true"></loading>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';

export default {
	mixins: [currencies],
	async mounted() {
		if (this.online) {
			this.loading = true;
			await this.requestCategories();
			await this.requestMeasurementUnit();
			await this.getProduct();
		}
		this.currency = await this.getPreferredCurrency();
	},
	data() {
		return {
			loading:false,
			product: [],
			currency: []
		};
	},
	components: {
		Loading
	},
	computed: {
		...mapState(['user', 'online', 'apiDomain'])
	},
	methods: {
		...mapMutations(['setCategories']),
		getProduct() {
			this.$store.dispatch('products/get',{id:this.$route.params.id})
				.then(response => {
					this.product = response.data.data;
				})
				.catch(function(error) {
					console.log('TCL: requestProducts -> error', error);
				}).finally(()=>{
					this.loading = false
				})
		},
		getMeasurementName(id) {
			let value;
			this.$store.getters['measurementUnits/getAll'].forEach(unit => {
				if (unit.id_unit_measurement == id) {
					value = unit.name;
					return;
				}
			});
			return value;
		},
		getCategory(id) {
			let value;
			this.$store.getters['categories/getAll'].forEach(category => {
				if (category.id_category == id) {
					value = category.name;
					return;
				}
			});
			return value;
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