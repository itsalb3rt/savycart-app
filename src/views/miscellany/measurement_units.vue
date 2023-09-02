<template>
  <div>
    <v-row>
      <v-col cols="12">
        <p>{{ $t('messages.measurement_units_description') }}</p>
      </v-col>
      <v-col cols="12">
        <v-btn @click="handleOpenCreateForm()" color="primary">
          <v-icon class="mr-2">fa-plus</v-icon>
          {{ $t('call_action_buttons.addMeasurementUnit') }}
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col
        cols="12"
        v-if="$store.getters['measurementUnits/getAll'].length === 0"
      >
        <v-alert type="info">
          {{ $t('messages.nothing_to_display') }}
        </v-alert>
      </v-col>
      <v-col
        cols="12"
        v-for="item in $store.getters['measurementUnits/getAll']"
        :key="item.id"
      >
        {{ item.name }}
        <v-btn
          class="float-right"
          text
          color="error"
          @click="dispatchDeleteMesasurementUnit(item)"
        >
          <v-icon class="mr-2" small>fa-trash</v-icon>
          {{ $t('call_action_buttons.delete') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showCreateFormDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('call_action_buttons.addMeasurementUnit') }}
        </v-card-title>

        <v-card-text>
          <form @submit.prevent="createMeasurementUnit">
            <v-text-field
              ref="measurementUnitNameRef"
              :name="$t('measurement_unit.name')"
              :label="$t('measurement_unit.name')"
              id="name"
              v-model="name"
              @keyup="uppercase"
              :placeholder="$t('measurement_unit.measurement_placeholder')"
              autocomplete="off"
            />
            <div class="text-center">
              <v-btn type="submit" color="primary" :disabled="name.length == 0">
                <v-icon class="mr-2">fa-save</v-icon>
                {{ $t('call_action_buttons.save') }}
              </v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <delete-dialog
      :show="showDialogDeleteMeasurementUnit"
      :header-message="$t('call_action_buttons.delete_measurement_unit')"
      :body-message="$t('messages.delete_measurement_unit')"
      :cancel-message="$t('call_action_buttons.no_go_back')"
      @cancel="showDialogDeleteMeasurementUnit = false"
      @confirm="deleteMeasurementUnit()"
    />
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import deleteDialog from '@/components/Interface/Dialogs/Delete';
import Loading from 'vue-loading-overlay';

export default {
  name: 'MeasurementUnits',
  mounted() {
    if (this.online) {
      this.requestMeasurementUnits();
    }
  },
  data: function () {
    return {
      name: '',
      headers: [
        { text: '#', value: 'index' },
        { text: this.$t('measurement_unit.name'), value: 'name' },
        { text: this.$t('call_action_buttons.action'), value: 'action' },
      ],
      indexMeasurementUnitForDelete: '',
      showDialogDeleteMeasurementUnit: false,
      isLoading: false,
      showCreateFormDialog: false,
    };
  },
  components: {
    deleteDialog,
    Loading,
  },
  computed: {
    ...mapState(['online']),
  },
  methods: {
    ...mapMutations([
      'addMeasurementUnit',
      'setMeasurementUnit',
      'removeMeasurementUnit',
    ]),

    createMeasurementUnit() {
      if (this.online) {
        this.isLoading = true;
        this.$store
          .dispatch('measurementUnits/create', { name: this.name })
          .then((response) => {
            this.$store.commit('measurementUnits/ADD', response.data.data);
            this.name = '';
            this.$store.commit('snackbar/setSnackbar', {
              show: true,
              message: this.$t('messages.saved'),
              color: 'success',
              top: true,
            });
            this.showCreateFormDialog = false;
          })
          .catch(function (error) {
            console.log('TCL: addMeasurementUnit -> error', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.intenet_required'),
          color: 'error',
          top: true,
        });
      }
    },
    dispatchDeleteMesasurementUnit(item) {
      this.showDialogDeleteMeasurementUnit = true;
      const index = this.$store.getters['measurementUnits/getAll'].findIndex(
        (unit) => unit.id_unit_measurement === item.id_unit_measurement
      );
      this.indexMeasurementUnitForDelete = index;
    },
    deleteMeasurementUnit() {
      if (this.online) {
        this.$store
          .dispatch('measurementUnits/delete', {
            id: this.$store.getters['measurementUnits/getAll'][
              this.indexMeasurementUnitForDelete
            ].id_unit_measurement,
          })
          .then((response) => {
            this.$store.commit(
              'measurementUnits/REMOVE',
              this.indexMeasurementUnitForDelete
            );
            this.$store.commit('snackbar/setSnackbar', {
              show: true,
              message: this.$t('call_action_buttons.deleted'),
              color: 'success',
              top: true,
            });
          })
          .catch((error) => {
            if (error.response.status === 409) {
              this.$store.commit('snackbar/setSnackbar', {
                show: true,
                message: this.$t('measurement_unit.forbiden_delete'),
                color: 'error',
                top: true,
              });
            }
            console.log('TCL: deleteMeasurementUnit -> error', error);
          });
      } else {
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.intenet_required'),
          color: 'error',
          top: true,
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
        .then((response) => {
          this.$store.commit('measurementUnits/SET', response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleOpenCreateForm() {
      this.showCreateFormDialog = true;
      setTimeout(() => {
        this.$refs.measurementUnitNameRef.focus();
      }, 500);
    },
  },
};
</script>
