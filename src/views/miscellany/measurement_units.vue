<template>
  <div class="measurement-units-page">
    <div class="measurement-units-page__header">
      <button class="measurement-units-page__back-btn" @click="$router.back()" type="button">
        <v-icon>fa-chevron-left</v-icon>
      </button>
      <h1 class="measurement-units-page__title">{{ $t('page_titles.measurement_units') }}</h1>
    </div>
    <p class="measurement-units-page__subtitle">{{ $t('messages.measurement_units_description') }}</p>

    <div v-if="units.length > 0" class="measurement-units-page__list">
      <div
        v-for="item in units"
        :key="item.id"
        class="measurement-units-page__card"
      >
        <span class="measurement-units-page__card-name">{{ item.name }}</span>
        <button class="measurement-units-page__delete-btn" @click="dispatchDeleteMeasurementUnit(item)" type="button">
          <v-icon>fa-trash</v-icon>
        </button>
      </div>
    </div>

    <div v-else class="measurement-units-page__empty">
      <div class="measurement-units-page__empty-icon">
        <v-icon large>fa-balance-scale</v-icon>
      </div>
      <h2 class="measurement-units-page__empty-title">{{ $t('measurement_unit.no_units_yet') }}</h2>
      <p class="measurement-units-page__empty-subtitle">{{ $t('measurement_unit.add_your_first_one') }}</p>
      <div class="measurement-units-page__quick-add">
        <button
          class="measurement-units-page__quick-pill"
          v-for="preset in presets"
          :key="preset"
          @click="quickAdd(preset)"
          type="button"
        >
          {{ preset }}
        </button>
      </div>
    </div>

    <div class="measurement-units-page__footer">
      <button class="measurement-units-page__add-btn" @click="handleOpenCreateForm()" type="button">
        {{ $t('call_action_buttons.addMeasurementUnit') }}
      </button>
    </div>

    <v-dialog v-model="showCreateFormDialog" width="500">
      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-medium">
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
            <div class="dialog-actions">
              <v-btn text @click="showCreateFormDialog = false">
                {{ $t('call_action_buttons.cancel') }}
              </v-btn>
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
import EmptyState from '@/components/Interface/EmptyState';

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
      presets: ['Unit', 'Pack', 'Box'],
      indexMeasurementUnitForDelete: '',
      showDialogDeleteMeasurementUnit: false,
      isLoading: false,
      showCreateFormDialog: false,
    };
  },
  components: {
    deleteDialog,
    Loading,
    EmptyState,
  },
  computed: {
    ...mapState(['online']),
    units() {
      return this.$store.getters['measurementUnits/getAll'];
    }
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
          .catch(error => {
            this.$store.commit('snackbar/setSnackbar', {
              show: true,
              message: this.$t('messages.server_error'),
              color: 'error',
              top: true,
            });
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
    dispatchDeleteMeasurementUnit(item) {
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
            if (error.response?.status === 409) {
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
    quickAdd(preset) {
      this.name = preset;
      this.createMeasurementUnit();
    },
  },
};
</script>

<style>
.measurement-units-page {
  padding-bottom: 80px;
}

.measurement-units-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.measurement-units-page__back-btn {
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

.measurement-units-page__title {
  font-size: var(--fs-title);
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.measurement-units-page__subtitle {
  font-size: var(--fs-body);
  color: var(--muted);
  margin: 0 0 16px;
  line-height: 1.4;
}

.measurement-units-page__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.measurement-units-page__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 16px;
  transition: background 0.15s;
}

.measurement-units-page__card-name {
  font-size: var(--fs-section);
  font-weight: 600;
  color: var(--text);
}

.measurement-units-page__delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--negative, #e53935);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.15s;
}

.measurement-units-page__delete-btn:hover {
  opacity: 1;
}

.measurement-units-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.measurement-units-page__empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-light, #e8f5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--primary);
}

.measurement-units-page__empty-title {
  font-size: var(--fs-title);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
  text-align: center;
}

.measurement-units-page__empty-subtitle {
  font-size: var(--fs-body);
  color: var(--muted);
  margin: 0 0 24px;
  text-align: center;
  line-height: 1.4;
}

.measurement-units-page__quick-add {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.measurement-units-page__quick-pill {
  padding: 10px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s;
}

.measurement-units-page__quick-pill:hover {
  background: var(--surface-hover, transparent);
}

.measurement-units-page__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.measurement-units-page__add-btn {
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

.measurement-units-page__add-btn:hover {
  opacity: 0.9;
}
</style>
