<template>
	<div>
		<v-row>
			<v-col cols="12">
				<form @submit.prevent="createMeasurementUnit">
					<v-text-field
						:name=" $t('measurement_unit.name') "
						:label=" $t('measurement_unit.name') "
						id="name"
						v-model="name"
						@keyup="uppercase"
						:placeholder=" $t('measurement_unit.measurement_placeholder') "
						autocomplete="off"
					></v-text-field>
					<v-btn type="submit" color="primary" :disabled="name.length == 0">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }}
					</v-btn>
				</form>
				<v-row>
					<v-col cols="12">
						<h4>{{ $t('measurement_unit.registered_measurement') }}</h4>
					</v-col>
					<v-col cols="12">
						<v-data-table
							mobile-breakpoint="xs"
							:headers="headers"
							:items="$store.getters['measurementUnits/getAll']"
						>
							<template v-slot:no-data>
								<v-alert
									:value="true"
									color="error"
									icon="fa-warning"
								>{{ $t('message.nothing_to_display') }}</v-alert>
							</template>
							<template v-slot:item.action="{item}">
								<td>
									<v-btn text color="error" class="ml-0 pl-0" @click="dispatchDeleteMesasurementUnit(item)">
										<v-icon class="mr-2" small>fa-trash</v-icon>
										{{ $t('call_action_buttons.delete') }}
									</v-btn>
								</td>
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<delete-dialog
			:show="showDialogDeleteMeasurementUnit"
			@cancel="showDialogDeleteMeasurementUnit = false"
			@confirm="deleteMeasurementUnit()"
		/>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import deleteDialog from '@/components/Interface/Dialogs/Delete';

export default {
	mounted() {
		if (this.online) {
			this.requestMeasurementUnits();
		}
	},
	data: function() {
		return {
			name: '',
			headers: [
				{ text: '#', value: 'index' },
				{ text: this.$t('measurement_unit.name'), value: 'name' },
				{ text: this.$t('call_action_buttons.action'), value: 'action' }
			],
			indexMeasurementUnitForDelete: '',
			showDialogDeleteMeasurementUnit: false
		};
	},
	components: {
		deleteDialog
	},
	computed: {
		...mapState(['measurement_units', 'online', 'apiDomain', 'user'])
	},
	methods: {
		...mapMutations([
			'addMeasurementUnit',
			'setMeasurementUnit',
			'removeMeasurementUnit'
		]),

		createMeasurementUnit() {
			if (this.online) {
				this.$store
					.dispatch('measurementUnits/create', { name: this.name })
					.then(response => {
						this.$store.commit('measurementUnits/ADD', response.data.data);
						this.name = '';
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.saved'),
							color: 'success',
							top: true
						});
					})
					.catch(function(error) {
						console.log('TCL: addMeasurementUnit -> error', error);
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
			}
		},
		dispatchDeleteMesasurementUnit(item) {
			this.showDialogDeleteMeasurementUnit = true;
			const index = this.$store.getters['measurementUnits/getAll'].findIndex(
				unit => unit.id_unit_measurement === item.id_unit_measurement
			);
			this.indexMeasurementUnitForDelete = index;
		},
		deleteMeasurementUnit() {
			if (this.online) {
				this.$store
					.dispatch('measurementUnits/delete', {
						id: this.$store.getters['measurementUnits/getAll'][
							this.indexMeasurementUnitForDelete
						].id_unit_measurement
					})
					.then(response => {
						this.$store.commit(
							'measurementUnits/REMOVE',
							this.indexMeasurementUnitForDelete
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
								message: this.$t('measurement_unit.forbiden_delete'),
								color: 'error',
								top: true
							});
						}
						console.log('TCL: deleteMeasurementUnit -> error', error);
					});
			} else {
				this.$store.commit('snackbar/setSnackbar', {
					show: true,
					message: this.$t('messages.intenet_required'),
					color: 'error',
					top: true
				});
			}
			this.showDialogDeleteMeasurementUnit = false;
		},
		uppercase() {
			this.name = this.name.toUpperCase();
		},
		requestMeasurementUnits() {
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