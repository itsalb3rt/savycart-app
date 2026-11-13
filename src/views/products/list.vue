<template>
  <div class="product-list-page">
    <div class="product-list-page__header">
      <div class="product-list-page__title">{{ $t('page_titles.my_list') }}</div>
      <div class="product-list-page__count">{{ filterProducts.length }} {{ $t('products.products_count') }}</div>
    </div>
    <div class="product-list-page__search-row">
      <v-text-field
        ref="searchInputRef"
        v-model="searchProductName"
        :placeholder="$t('products.search')"
        clearable
        hide-details
        class="product-list-page__search"
        @click:clear="$refs.searchInputRef.blur()"
        prepend-inner-icon="fa-search"
      ></v-text-field>
    </div>
    <div class="product-list-page__tabs">
      <button
        :class="['product-list-page__tab', { 'product-list-page__tab--active': !showFavorites }]"
        @click="showFavorites = false"
      >
        <v-icon small class="product-list-page__tab-icon">fa-list</v-icon>
        {{ $t('products.all') }} {{ !showFavorites ? filterProducts.length : '' }}
      </button>
      <button
        :class="['product-list-page__tab', { 'product-list-page__tab--active': showFavorites }]"
        @click="showFavorites = true"
      >
        <v-icon small class="product-list-page__tab-icon">fa-star</v-icon>
        {{ $t('products.favorites') }}
      </button>
    </div>
    <div v-if="loading" class="product-list-page__loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else-if="filterProducts.length > 0" class="product-list-page__list">
      <v-virtual-scroll
        :bench="benched"
        :items="filterProducts"
        item-height="72"
        :height="screenHeightForProductContainer"
      >
        <template v-slot:default="{ item }">
          <list-product
            :product="item"
            :currency="currency"
            @view-details="
              (product) =>
                $router.push({
                  name: 'view_product',
                  params: { id: product.id_product },
                })
            "
            @on-edit="
              (product) =>
                $router.push({
                  name: 'edit product',
                  params: { id: product.id_product },
                })
            "
            @on-delete="
              (product) => showDialogToDeleteProduct(product.id_product)
            "
            @toggle-favorite="(product) => toggleFavorite(product)"
            :loading-favorite="loadingFavorite"
          />
        </template>
      </v-virtual-scroll>
    </div>
    <div v-else-if="filterProducts.length == 0" class="product-list-page__empty">
      <empty-state
        icon="fa-box-open"
        :title="$t('products.empty_list')"
      />
    </div>
    <v-btn
      color="primary"
      class="product-list-page__fab"
      @click="$router.push({ path: '/product/add' })"
    >
      <v-icon left>fa-plus</v-icon>
      {{ $t('products.add_product') }}
    </v-btn>
    <delete-dialog
      :show="dialog"
      @cancel="dialog = false"
      @confirm="deleteProduct()"
    />
    <product-filter :show="showFilters" @filter="handleFilter" />
  </div>
</template>

<script>
import deleteDialog from '@/components/Interface/Dialogs/Delete';
import EmptyState from '@/components/Interface/EmptyState';
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import ListProduct from '@/components/Products/ListProduct';
import ProductFilter from '@/components/Products/Filter';

export default {
  name: 'products',
  mixins: [currencies],
  components: {
    deleteDialog,
    EmptyState,
    ListProduct,
    ProductFilter,
  },
  async mounted() {
		this.products = this.$store.getters['products/getAll'];

    if (this.online) {
      if (this.$store.getters['taxes/getAll'].length == 0) {
        this.loading = true;
      }
      this.getTaxes();
      this.$store
        .dispatch('products/getAll')
        .then((response) => {
          this.$store.commit('products/SET', response.data.data);
          this.products = this.$store.getters['products/getAll'];
          this.requestMeasurementUnit();
          this.requestCategories();
        })
        .finally(() => {
          this.loading = false;
        });

      this.$store.dispatch('products/getAllBrands').then((response) => {
        this.$store.commit('products/SET_BRANDS', response.data.data);
      });
    }
		
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      searchProductName: '',
      showFavorites: false,
      dialog: false,
      deleteProductId: '',
      products: [],
      benched: 2,
      loading: false,
      loadingFavorite: false,
      currency: { symbol: '$' },
      showFilters: false,
      sortBy: 'nameAZ', // can be nameAZ, nameZA, dateNew, dateOld
    };
  },
  computed: {
    ...mapState(['online']),
    filterProducts() {
      if (this.searchProductName == null) {
        this.searchProductName = '';
      }
      let filteredProducts = this.products.filter((item) => {
        const searchParams = ['brand', 'name'];
        const search = this.searchProductName.toUpperCase();
        return searchParams.some((searchParam) =>
          item[searchParam].toUpperCase().includes(search)
        );
      });
      if (this.showFavorites) {
        filteredProducts = filteredProducts.filter(
          (product) => product.favorite == '1'
        );
      }

      if (this.sortBy == 'nameAZ') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      } else if (this.sortBy == 'nameZA') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
          if (a.name < b.name) {
            return 1;
          }
          return 0;
        });
      } else if (this.sortBy == 'dateNew') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return -1;
          }
          if (a.created_at < b.created_at) {
            return 1;
          }
          return 0;
        });
      } else if (this.sortBy == 'dateOld') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (a.created_at < b.created_at) {
            return -1;
          }
          if (a.created_at > b.created_at) {
            return 1;
          }
          return 0;
        });
      }

      return filteredProducts;
    },
    screenHeightForProductContainer() {
      const reduce = screen.height > 736 ? 350 : 280;
      return screen.height - reduce;
    },
  },
  methods: {
    showDialogToDeleteProduct(idProduct) {
      this.dialog = true;
      this.deleteProductId = idProduct;
    },
    deleteProduct() {
      /**
       * Delete the product from store, local copy and database
       */
      this.$store
        .dispatch('products/delete', { id: this.deleteProductId })
        .then((response) => {
          this.dialog = false;
          const productIndexInStore = this.$store.getters[
            'products/getAll'
          ].findIndex((product) => product.id_product === this.deleteProductId);
          const productIndexInView = this.products.findIndex(
            (product) => product.id_product === this.deleteProductId
          );
          this.$store.commit('products/REMOVE', productIndexInStore);
          this.products.splice(productIndexInView, 1);
          this.$store.commit('snackbar/setSnackbar', {
            show: true,
            message: this.$t('products.product_removed'),
            color: 'success',
            top: true,
          });
          //Reset the search
          this.searchProductName = '';
        })
        .catch((error) => {
          this.$store.commit('snackbar/setSnackbar', {
            show: true,
            message: this.$t('messages.server_error'),
            color: 'error',
            top: true,
          });
          console.log('TCL: deleteCategory -> error', error);
        });
    },
    getTaxes() {
      this.$store.dispatch('taxes/getAll').then((response) => {
        this.$store.commit('taxes/SET', response.data.data.quantity);
      });
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
    requestMeasurementUnit() {
      this.$store
        .dispatch('measurementUnits/getAll')
        .then((response) => {
          this.$store.commit('measurementUnits/SET', response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toggleFavorite(product) {
      if (!this.online) {
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.intenet_required'),
          color: 'error',
          top: true,
        });
        return;
      }
      this.loadingFavorite = true;

      this.$store
        .dispatch('products/update', {
          id: product.id_product,
          data: {
            favorite: product.favorite == '1' ? '0' : '1',
          },
        })
        .then(() => {
          const products = this.$store.getters['products/getAll'];
          const productIndex = products.findIndex(
            (item) => item.id_product === product.id_product
          );
          products[productIndex].favorite = product.favorite == '1' ? '0' : '1';
          this.$store.commit('products/SET', products);
        })
        .finally(() => {
          this.loadingFavorite = false;
        });
    },
    handleShowFilters() {
      this.showFilters = !this.showFilters;
    },
    handleFilter({ sortBy }) {
      this.showFilters = false;
      this.sortBy = sortBy;
    },
    hasFilters() {
      return this.sortBy !== 'nameAZ';
    },
    handleClearFilters() {
      this.showFilters = false;
      this.sortBy = 'nameAZ';
    },
  },
};
</script>
<style>
.product-list-page {
  padding: 16px;
  padding-bottom: 80px;
}

.product-list-page__header {
  margin-bottom: 16px;
}

.product-list-page__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.product-list-page__count {
  font-size: var(--fs-body);
  color: var(--muted);
  margin-top: 4px;
}

.product-list-page__search-row {
  margin-bottom: 16px;
}

.product-list-page__search {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
}

.product-list-page__search .v-input__control {
  min-height: 48px;
}

.product-list-page__search .v-text-field__slot {
  padding: 8px 16px;
}

.product-list-page__search .v-text-field__slot input {
  color: var(--text);
}

.product-list-page__search .v-icon {
  color: var(--muted);
}

.product-list-page__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.product-list-page__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.product-list-page__tab--active {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}

.product-list-page__tab-icon {
  font-size: 14px;
}

.product-list-page__loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.product-list-page__list {
  padding: 0;
}

.product-list-page__empty {
  padding: 32px 0;
}

.product-list-page__fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  border-radius: 999px;
  padding: 12px 24px;
  min-height: 48px;
  font-weight: 600;
  font-size: var(--fs-body);
  box-shadow: var(--shadow-float);
  z-index: 10;
}
</style>
