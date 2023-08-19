<template>
  <div>
    <v-row v-if="products.length > 0">
      <v-col cols="10">
        <v-text-field
          prepend-inner-icon="fa-search"
          v-model="searchProductName"
          :label="$t('products.search')"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-badge color="red" dot left :value="hasFilters()" style="margin-top: 18px">
          <v-btn
            @click="handleShowFilters"
            icon
            :color="hasFilters() ? 'primary' : 'grey'"
          >
            <v-icon>fa-filter</v-icon>
          </v-btn>
        </v-badge>
      </v-col>
      <v-col cols="12">
        <v-tabs fixed-tabs>
          <v-tab @click="showFavorites = false">
            <v-icon class="mr-2">fa-list</v-icon>
            {{ $t('products.all') }}
            {{ !showFavorites ? actualAvaliableProducts.length : null }}
          </v-tab>
          <v-tab @click="showFavorites = true">
            <v-icon class="mr-2">fa-star</v-icon>
            {{ $t('products.favorites') }}
            {{ showFavorites ? actualAvaliableProducts.length : null }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" class="products-container">
        <v-virtual-scroll
          :bench="benched"
          :items="actualAvaliableProducts"
          item-height="220"
          :height="screenHeightForProductContainer"
        >
          <template v-slot:default="{ item, index }">
            <purchase-product
              :product="item"
              :currency="currency"
              :is-on-car="isOnCar(item.id_product)"
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
      </v-col>
      <template v-if="$store.getters['shoppingCar/getAll'].length > 0">
        <v-col cols="12" v-if="viewPort">
          <shop-resume
            :quantity="$store.getters['shoppingCar/getAll'].length"
            :sub-total="subTotal"
            :currency-symbol="currency.symbol"
            :total-tax="totalTax"
          />
        </v-col>
        <v-col
          cols="12"
          v-else
          justify="center"
          class="shop-resume-bar-container-mobile"
        >
          <ShopResumeMobile
            :quantity="$store.getters['shoppingCar/getAll'].length"
            :sub-total="subTotal"
            :currency-symbol="currency.symbol"
            :total-tax="totalTax"
            :is-open="openShopResumeMobile"
          />
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card flat>
          <v-card-text>
            <p class="headline grey--text">{{ $t('products.empty_list') }}</p>
            <v-btn color="primary" @click="$router.push('/product/add')">
              <v-icon class="mr-2">fa-plus-circle</v-icon>
              {{ $t('call_action_buttons.create') }}
              {{ $t('products.product') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
import ShopResume from '@/components/shop/ShopResume';
import ShopResumeMobile from '@/components/shop/ShopResumeMobile';
import currencies from '@/mixins/miscellany/currencies';
import Loading from 'vue-loading-overlay';
import PurchaseProduct from '@/components/Products/PurchaseProduct';
import ProductFilter from '@/components/Products/Filter';

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
    };
  },
  components: {
    ShopResume,
    Loading,
    PurchaseProduct,
    ShopResumeMobile,
    ProductFilter,
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
.product-main-container {
  margin-top: 20px;
  margin-bottom: 115px;
}

.add-remove-from-card-label {
  margin: 10px auto;
}

.products-container .v-virtual-scroll .v-virtual-scroll__item:last-child {
  padding-bottom: 130px;
}
</style>
