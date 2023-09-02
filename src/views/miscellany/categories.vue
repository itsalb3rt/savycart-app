<template>
  <div>
    <v-row>
      <v-col cols="12">
        <p>{{ $t('category.category_description_section') }}</p>
      </v-col>
      <v-col cols="12" v-if="$store.getters['categories/getAll'].length === 0">
        <v-alert type="info">
          {{ $t('messages.nothing_to_display') }}
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-btn @click="handleOpenCreateForm()" color="primary">
          <v-icon class="mr-2">fa-plus</v-icon>
          {{ $t('call_action_buttons.addCategory') }}
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        v-for="item in $store.getters['categories/getAll']"
        :key="item.id"
      >
        {{ item.name }}
        <v-btn
          class="float-right"
          text
          color="error"
          @click="dispatchDeleteCategory(item)"
        >
          <v-icon class="mr-2" small>fa-trash</v-icon>
          {{ $t('call_action_buttons.delete') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showCreateFormDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('call_action_buttons.addCategory') }}
        </v-card-title>

        <v-card-text>
          <form @submit.prevent="createCategory">
            <v-text-field
              ref="categoryNameRef"
              name="name"
              :label="$t('category.category')"
              id="name"
              v-model="name"
              :placeholder="$t('category.category_placeholder')"
              autocomplete="off"
              @keyup="uppercase"
            ></v-text-field>
            <div class="text-center">
              <v-btn
                color="primary"
                type="submit"
                class="ml-0"
                :disabled="name.length == 0"
              >
                <v-icon class="mr-2">fa-save</v-icon>
                {{ $t('call_action_buttons.save') }}
              </v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <delete-dialog
      :show="showDialogDeleteCategory"
      :header-message="$t('call_action_buttons.delete_category')"
      :body-message="$t('messages.delete_category')"
      :cancel-message="$t('call_action_buttons.no_go_back')"
      @cancel="showDialogDeleteCategory = false"
      @confirm="deleteCategory()"
    />
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import deleteDialog from '@/components/Interface/Dialogs/Delete';
import Loading from 'vue-loading-overlay';

export default {
  name: 'categories',
  components: {
    deleteDialog,
    Loading,
  },
  mounted() {
    if (this.online) {
      this.requestCategories();
    }
  },
  data: function () {
    return {
      name: '',
      headers: [
        { text: this.$t('category.name'), value: 'name' },
        { text: this.$t('call_action_buttons.action'), value: 'action' },
      ],
      showDialogDeleteCategory: false,
      indexCategoryForDelete: '',
      isLoading: false,
      showCreateFormDialog: false,
    };
  },
  computed: {
    ...mapState(['online']),
  },
  methods: {
    createCategory() {
      if (this.online) {
        this.isLoading = true;
        this.$store
          .dispatch('categories/create', { name: this.name })
          .then((response) => {
            this.$store.commit('categories/ADD', response.data.data);
            this.name = '';
            this.$store.commit('snackbar/setSnackbar', {
              show: true,
              message: this.$t('messages.saved'),
              color: 'success',
              top: true,
            });
						this.showCreateFormDialog = false
          })
          .catch(function (error) {
            console.log('TCL: createCategory -> error', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.intenet_required'),
          color: 'success',
          top: true,
        });
      }
    },
    dispatchDeleteCategory(item) {
      this.showDialogDeleteCategory = true;
      const index = this.$store.getters['categories/getAll'].findIndex(
        (category) => category.id_category === item.id_category
      );
      this.indexCategoryForDelete = index;
    },
    deleteCategory() {
      if (this.online) {
        this.$store
          .dispatch('categories/delete', {
            id: this.$store.getters['categories/getAll'][
              this.indexCategoryForDelete
            ].id_category,
          })
          .then((response) => {
            this.$store.commit(
              'categories/REMOVE',
              this.indexCategoryForDelete
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
                message: this.$t('category.forbiden_delete'),
                color: 'error',
                top: true,
              });
            }
            console.log('TCL: deleteCategory -> error', error);
          });
      } else {
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.intenet_required'),
          color: 'error',
          top: true,
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
        .then((response) => {
          this.$store.commit('categories/SET', response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleOpenCreateForm() {
      this.showCreateFormDialog = true;
      setTimeout(() => {
        this.$refs.categoryNameRef.focus();
      }, 500);
    },
  },
};
</script>
