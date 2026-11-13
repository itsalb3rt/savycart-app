<template>
  <div class="categories-page">
    <div class="categories-page__header">
      <button class="categories-page__back-btn" @click="$router.back()" type="button">
        <v-icon>fa-chevron-left</v-icon>
      </button>
      <h1 class="categories-page__title">{{ $t('page_titles.categories') }}</h1>
    </div>
    <p class="categories-page__subtitle">{{ $t('category.category_description_section') }}</p>

    <div v-if="categories.length > 0" class="categories-page__list">
      <div
        v-for="item in categories"
        :key="item.id"
        class="categories-page__card"
      >
        <span class="categories-page__card-name">{{ item.name }}</span>
        <button class="categories-page__delete-btn" @click="dispatchDeleteCategory(item)" type="button">
          <v-icon>fa-trash</v-icon>
        </button>
      </div>
    </div>

    <div v-else class="categories-page__empty">
      <empty-state
        icon="fa-list-ul"
        :title="$t('messages.nothing_to_display')"
      />
    </div>

    <div class="categories-page__footer">
      <button class="categories-page__add-btn" @click="handleOpenCreateForm()" type="button">
        {{ $t('call_action_buttons.addCategory') }}
      </button>
    </div>

    <v-dialog v-model="showCreateFormDialog" width="500">
      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-medium">
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
            <div class="dialog-actions">
              <v-btn text @click="showCreateFormDialog = false">
                {{ $t('call_action_buttons.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
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
import EmptyState from '@/components/Interface/EmptyState';

export default {
  name: 'categories',
  components: {
    deleteDialog,
    Loading,
    EmptyState,
  },
  mounted() {
    if (this.online) {
      this.requestCategories();
    }
  },
  data: function () {
    return {
      name: '',
      showDialogDeleteCategory: false,
      indexCategoryForDelete: '',
      isLoading: false,
      showCreateFormDialog: false,
    };
  },
  computed: {
    ...mapState(['online']),
    categories() {
      return this.$store.getters['categories/getAll'];
    }
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
          .catch(error => {
            this.$store.commit('snackbar/setSnackbar', {
              show: true,
              message: this.$t('messages.server_error'),
              color: 'error',
              top: true,
            });
            console.log('TCL: createCategory -> error', error);
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
            if (error.response?.status === 409) {
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

<style>
.categories-page {
  padding-bottom: 80px;
}

.categories-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.categories-page__back-btn {
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

.categories-page__title {
  font-size: var(--fs-title);
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.categories-page__subtitle {
  font-size: var(--fs-body);
  color: var(--muted);
  margin: 0 0 16px;
  line-height: 1.4;
}

.categories-page__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.categories-page__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 16px;
  transition: background 0.15s;
}

.categories-page__card-name {
  font-size: var(--fs-section);
  font-weight: 600;
  color: var(--text);
}

.categories-page__delete-btn {
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

.categories-page__delete-btn:hover {
  opacity: 1;
}

.categories-page__empty {
  padding: 32px 0;
}

.categories-page__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.categories-page__add-btn {
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

.categories-page__add-btn:hover {
  opacity: 0.9;
}
</style>
