<template>
  <div class="log-purchase-page">
    <div class="log-purchase-page__header">
      <h1 class="log-purchase-page__title">{{ $t('page_titles.logger_purchase') }}</h1>
      <p class="log-purchase-page__subtitle">{{ $t('shopping_car.pick_what_you_bought') }}</p>
    </div>

    <div v-if="products.length > 0" class="log-purchase-page__content">
      <div class="log-purchase-page__store-field">
        <label class="log-purchase-page__store-label">{{ $t('shopping_car.store_label') }}</label>
        <input
          type="text"
          class="log-purchase-page__input"
          v-model="nameEstablishment"
          :placeholder="$t('shopping_car.name_establishment_placeholder')"
        />
      </div>

      <div class="log-purchase-page__search">
        <v-text-field
          ref="searchInputRef"
          prepend-inner-icon="fa-search"
          v-model="searchProductName"
          :label="$t('products.search')"
          clearable
          hide-details
          class="log-purchase-page__search-input"
          @click:clear="$refs.searchInputRef.blur()"
        ></v-text-field>
      </div>

      <div class="log-purchase-page__list">
        <v-virtual-scroll
          :bench="benched"
          :items="actualAvaliableProducts"
          item-height="72"
          :height="screenHeightForProductContainer"
        >
          <template v-slot:default="{ item, index }">
            <purchase-product
              :product="item"
              :currency="currency"
              :is-on-car="isOnCar(item.id_product)"
              @change-quantity="value => item.quantity = value"
              @view-details="
                (product) =>
                  $router.push({
                    name: 'view_product',
                    params: { id: product.id_product },
                  })
              "
              @add-to-car="addItemToShoppingCar(index)"
              @remove-from-car="
                (product) => removeItemFromShoppingCar(product.id_product)
              "
            />
          </template>
        </v-virtual-scroll>
      </div>
    </div>

    <div v-else class="log-purchase-page__empty">
      <empty-state
        icon="fa-box-open"
        :title="$t('products.empty_list')"
      >
        <template v-slot:action>
          <v-btn color="primary" @click="$router.push('/product/add')">
            <v-icon class="mr-2">fa-plus-circle</v-icon>
            {{ $t('call_action_buttons.create') }}
            {{ $t('products.product') }}
          </v-btn>
        </template>
      </empty-state>
    </div>

    <!-- Fixed bottom bar -->
    <div v-if="$store.getters['shoppingCar/getAll'].length > 0" class="log-purchase-page__bottom-bar">
      <div class="log-purchase-page__bar-info">
        <span class="log-purchase-page__bar-count">{{ $store.getters['shoppingCar/getAll'].length }} {{ $t('shopping_car.items_count') }}</span>
        <span class="log-purchase-page__bar-total">{{ currency.symbol }}{{ numberFormat(subTotal) }}</span>
      </div>
      <v-btn color="primary" class="log-purchase-page__bar-btn" @click="$router.push('/shop/shopping_car')">
        {{ $t('shopping_car.review_cart') }}
      </v-btn>
    </div>

    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
    <product-filter :show="showFilters" @filter="handleFilter" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import PurchaseProduct from '@/components/Products/PurchaseProduct';
import ProductFilter from '@/components/Products/Filter';
import EmptyState from '@/components/Interface/EmptyState';

export default {
  mixins: [currencies],
  async mounted() {
    this.products = this.$store.getters['products/getAll'];

    if (this.online) {

      if(this.products.length === 0) {
       this.isLoading = true;
      }
    
      this.$store.dispatch('products/getAll').then((response) => {
        this.$store.commit('products/SET', response.data.data);
        this.products = this.$store.getters['products/getAll'];
        this.isLoading = false;
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('snackbar/setSnackbar', {
          show: true,
          message: this.$t('messages.server_error'),
          color: 'error',
          top: true
        });
        console.log('TCL: getAll products -> error', error);
      });
    }
    
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      searchProductName: '',
      currency: {},
      isLoading: false,
      showFavorites: false,
      products: [],
      benched: 2,
      isMobile: false,
      openShopResumeMobile: false,
      showFilters: false,
      sortBy: 'nameAZ', // can be nameAZ, nameZA, dateNew, dateOld
      nameEstablishment: '',
    };
  },
  components: {
    Loading,
    PurchaseProduct,
    ProductFilter,
    EmptyState,
  },
  computed: {
    ...mapState(['online']),
    actualAvaliableProducts() {
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
    subTotal() {
      let total = 0;
      this.$store.getters['shoppingCar/getAll'].forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.quantity);
      });
      return total;
    },
    totalTax() {
      let totalTax = 0;
      this.$store.getters['shoppingCar/getAll'].forEach((item) => {
        totalTax +=
          parseFloat(item.price) *
          parseFloat(item.quantity) *
          (this.$store.getters['taxes/getAll'] / 100);
      });
      return totalTax;
    },
    screenHeightForProductContainer() {
      const reduce = screen.height > 736 ? 350 : 280;
      return screen.height - reduce;
    },
    viewPort() {
      const viewPortWidth = this.$vuetify.breakpoint.width;
      if (viewPortWidth > 960) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      return this.isMobile;
    },
  },
  methods: {
    isOnCar(idProduct) {
      let result = this.$store.getters['shoppingCar/getAll'].find(
        (item) => item.id_product === idProduct
      );
      return result ? true : false;
    },
    numberFormat(number) {
      let l10nEN = new Intl.NumberFormat('en-US');
      return l10nEN.format(number);
    },
    addItemToShoppingCar(index) {
      this.actualAvaliableProducts[index].onCar = true;
      if (!this.actualAvaliableProducts[index].quantity) {
        this.actualAvaliableProducts[index].quantity = 1;
      }

      // check if the first article to open the shop resume mobile
      if (this.$store.getters['shoppingCar/getAll'].length === 0) {
        this.openShopResumeMobile = 0;
      }

      setTimeout(() => {
        this.openShopResumeMobile = false;
      }, 3000);

      this.$store.commit(
        'shoppingCar/ADD',
        this.actualAvaliableProducts[index]
      );
    },
    removeItemFromShoppingCar(idProduct) {
      const indexInStore = this.$store.getters['shoppingCar/getAll'].findIndex(
        (item) => item.id_product === idProduct
      );
      this.$store.commit('shoppingCar/REMOVE', indexInStore);
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
.log-purchase-page {
  padding: 16px;
  padding-bottom: 100px;
}

.log-purchase-page__header {
  margin-bottom: 20px;
}

.log-purchase-page__title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.log-purchase-page__subtitle {
  margin: 4px 0 0;
  font-size: var(--fs-body);
  color: var(--muted);
}

.log-purchase-page__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-purchase-page__store-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-purchase-page__store-label {
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.log-purchase-page__input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-body);
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.log-purchase-page__input:focus {
  border-color: var(--primary);
}

.log-purchase-page__search-input .v-input__control {
  min-height: auto;
}

.log-purchase-page__search-input .v-text-field__slot {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
}

.log-purchase-page__search-input .v-text-field__slot .v-text-field__prefix,
.log-purchase-page__search-input .v-text-field__slot .v-text-field__slot {
  font-size: var(--fs-body);
}

.log-purchase-page__list {
  flex: 1;
}

.log-purchase-page__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* Fixed bottom bar */
.log-purchase-page__bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--on-surface);
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: var(--canvas-max);
  margin: 0 auto;
  z-index: 10;
}

.log-purchase-page__bar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.log-purchase-page__bar-count {
  font-size: var(--fs-small);
  color: #fff;
  opacity: 0.8;
}

.log-purchase-page__bar-total {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.log-purchase-page__bar-btn {
  height: 44px;
  padding: 0 24px;
  border-radius: var(--radius-card);
  font-size: var(--fs-body);
  font-weight: 600;
  background: #fff;
  color: var(--on-surface);
  text-transform: none;
  flex-shrink: 0;
}

.log-purchase-page__bar-btn:hover {
  background: #f0f0f0;
  color: var(--on-surface);
}
</style>
