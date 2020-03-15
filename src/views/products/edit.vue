<template>
	<div>
		<v-layout row wrap>
			<v-flex xs12 class="edit-form" v-if="online">
				<v-container class="white">
					<v-form @submit.prevent="updateProduct">
						<v-layout row wrap>
							<v-flex xs12>
								<v-text-field
									id="name"
									v-model="name"
									:label=" $t('products.name') "
									@keyup="uppercase"
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
									required
								></v-select>
								<v-select
									v-model="category"
									:items="$store.getters['categories/getAll']"
									:label=" $t('products.category') "
									item-text="name"
									item-value="id_category"
									required
								></v-select>
								<v-switch
									color="primary"
									v-model="itbis"
									:label="`${$t('products.tax')}: ${(itbis == '1')? $t('messages.yes') : $t('messages.no') }`"
									true-value="1"
									false-value="0"
								></v-switch>
								<p class="grey--text">{{ $t('products.tax_info') }}</p>
								<v-divider></v-divider>
								<v-switch
									color="primary"
									v-model="favorite"
									:label="`${$t('products.favorite_mark_message')}: ${(favorite == '1')? $t('messages.yes') : $t('messages.no') }`"
									true-value="1"
									false-value="0"
								></v-switch>
								<v-divider></v-divider>
								<v-textarea
									:label=" $t('products.description') "
									v-model="description"
									:placeholder=" $t('products.description_message') "
								></v-textarea>
							</v-flex>
						</v-layout>
						<v-layout align-center>
							<v-flex xs6>
								<v-btn small color="success" :disabled="name.length == 0" type="submit" class="ml-0">
									<v-icon small class="mr-2">fa-save</v-icon>
									{{ $t('call_action_buttons.save') }}
								</v-btn>
							</v-flex>
							<v-flex xs6 text-xs-right>
								<v-btn small outline color="error" @click="$router.push('/product/list')" class="mr-0">
									<v-icon small class="mr-2">fa-window-close</v-icon>
									{{ $t('call_action_buttons.cancel') }}
								</v-btn>
							</v-flex>
						</v-layout>
					</v-form>
				</v-container>
			</v-flex>
			<v-flex xs12 v-else>
				<offline-infomation></offline-infomation>
			</v-flex>
		</v-layout>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
		<v-snackbar v-model="snackbarShow" :color="snackbarColor">
			{{snackbarMessage}}
			<v-btn dark flat @click="snackbarShow = false">{{ $t('call_action_buttons.close') }}</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import MenuComponent from '@/components/TheMenu.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import OfflineInfomation from '@/components/Offline/OfflineInformation';
import { setTimeout } from 'timers';

export default {
	mounted() {
		if (this.online) {
			this.requestCategories();
			this.requestMeasurementUnit();
			this.getProduct();
			this.isLoading = true;
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
			snackbarShow: false,
			snackbarMessage: '',
			snackbarColor: ''
		};
	},
	components: {
		MenuComponent,
		Loading,
		OfflineInfomation
	},
	computed: {
		...mapState(['user', 'online', 'apiDomain'])
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
				favorite: this.favorite
			};

			if (this.online) {
				this.$store
					.dispatch('products/update', {
						id: this.product.id_product,
						data: product
					})
					.then(response => {
						this.snackbarShow = true;
						this.snackbarMessage = this.$t('messages.save');
						this.snackbarColor = 'success';

						setTimeout(() => {
							this.$router.go(-1);
						}, 1000);
						this.isLoading = false;
					})
					.catch(function(error) {
						console.log('TCL: createCategory -> error', error);
					});
			} else {
				this.isLoading = false;
				this.snackbarShow = true;
				this.snackbarMessage = this.$t('messages.intenet_required');
				this.snackbarColor = 'error';
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
					this.include_tax = this.product.include_tax;
					this.description = this.product.description;
					this.isLoading = false;
					this.favorite = this.product.favorite;
				})
				.catch(function(error) {
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
					this.$store.commit(
						'measurementUnits/SET',
						response.data.data
					);
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>