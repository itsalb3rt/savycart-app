<template>
	<div>
		<v-row>
			<v-col cols="12">
				<form @submit.prevent="createCategory">
					<p>{{ $t('category.category_description_section') }}</p>
					<v-text-field
						name="name"
						:label=" $t('category.category') "
						id="name"
						v-model="name"
						:placeholder=" $t('category.category_placeholder') "
						autocomplete="off"
						@keyup="uppercase"
					></v-text-field>
					<v-btn color="primary" type="submit" class="ml-0" :disabled="name.length == 0">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }}
					</v-btn>
				</form>
			</v-col>
			<v-col cols="12">
				<h4>{{ $t('category.registered_categories') }}</h4>
			</v-col>
			<v-col cols="12">
				<v-data-table
					mobile-breakpoint="xs"
					:headers="headers"
					:items="$store.getters['categories/getAll']"
				>
					<template v-slot:no-data>
						<v-alert :value="true" color="error" icon="fa-warning">{{ $t('messages.nothing_to_display') }}</v-alert>
					</template>
					<template v-slot:item.action="{item}">
						<v-btn text color="error" class="ml-0 pl-0" @click="dispatchDeleteCategory(item)">
							<v-icon class="mr-2" small>fa-trash</v-icon>
							{{ $t('call_action_buttons.delete') }}
						</v-btn>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
		<delete-dialog
			:show="showDialogDeleteCategory"
			@cancel="showDialogDeleteCategory = false"
			@confirm="deleteCategory()"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import deleteDialog from '@/components/Interface/Dialogs/Delete';

export default {
	components: {
		deleteDialog
	},
	mounted() {
		if (this.online) {
			this.requestCategories();
		}
	},
	data: function() {
		return {
			name: '',
			headers: [
				{ text: this.$t('category.name'), value: 'name' },
				{ text: this.$t('call_action_buttons.action'), value: 'action' }
			],
			showDialogDeleteCategory: false,
			indexCategoryForDelete: ''
		};
	},
	computed: {
		...mapState(['online', 'user'])
	},
	methods: {
		createCategory() {
			if (this.online) {
				this.$store
					.dispatch('categories/create', { name: this.name })
					.then(response => {
						this.$store.commit('categories/ADD', response.data.data);
						this.name = '';
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.saved'),
							color: 'success',
							top: true
						});
					})
					.catch(function(error) {
						console.log('TCL: createCategory -> error', error);
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'success',
					top: true
				});
			}
		},
		dispatchDeleteCategory(item) {
			this.showDialogDeleteCategory = true;
			const index = this.$store.getters['categories/getAll'].findIndex(
				category => category.id_category === item.id_category
			);
			this.indexCategoryForDelete = index;
		},
		deleteCategory() {
			if (this.online) {
				this.$store
					.dispatch('categories/delete', {
						id: this.$store.getters['categories/getAll'][
							this.indexCategoryForDelete
						].id_category
					})
					.then(response => {
						this.$store.commit(
							'categories/REMOVE',
							this.indexCategoryForDelete
						);
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('call_action_buttons.deleted'),
							color: 'success',
							top: true
						});
					})
					.catch(error => {
						if (error.response.status === 409) {
							this.$store.commit('snackbar/setSnackbar', {
								show: true,
								message: this.$t('category.forbiden_delete'),
								color: 'error',
								top: true
							});
						}
						console.log('TCL: deleteCategory -> error', error);
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
			}
			this.showDialogDeleteCategory = false;
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
		}
	}
};
</script>