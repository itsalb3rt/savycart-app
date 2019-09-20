<template>
  <div>
    <v-layout>
      <v-flex xs12 v-if="product.length == undefined">
        <v-card flat>
          <v-card-text>
            <v-btn
              small
              outline
              color="success"
              @click="$router.push({ name: 'edit product', params: { id: product.id_product } })"
              class="ml-0"
            >
              <v-icon class="mr-2" small>fa-edit</v-icon>{{ $t('call_action_buttons.edit') }}
            </v-btn>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.name') }}</div>
              <div>{{product.name}}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.price') }}</div>
              <div>{{currency.symbol}} {{product.price}}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.measurement_unit') }}</div>
              <div>{{getMeasurementName(product.id_unit_measurement)}}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.category') }}</div>
              <div>{{getCategory(product.id_category)}}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.tax') }}</div>
              <div>{{ (product.itbis == '1')? $t('messages.yes'): $t('messages.no') }}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.favorite_mark_message') }}</div>
              <div>{{ (product.favorite == '1')? $t('messages.yes'): $t('messages.no') }}</div>
            </div>
            <div>
              <div for="name" class="subheading font-weight-bold mt-4 mb-2">{{ $t('products.description') }}</div>
              <div>{{product.description}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 v-else>
        <div class="display-1 mt-5">
          <v-icon class="mr-2">fa-magic</v-icon>{{ $t('messages.nothing_to_display') }}
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from "@/mixins/miscellany/categories";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import currencies from "@/mixins/miscellany/currencies";

export default {
  mixins: [categories, measurementUnits, currencies],
  async mounted() {
    if (this.online) {
      await this.requestCategories();
      await this.requestMeasurementUnit();
      await this.getProduct();
    }
    this.currency = await this.getPreferredCurrency();
  },
  data() {
    return {
      product: [],
      currency: []
    };
  },
  components: {
    MenuComponent
  },
  computed: {
    ...mapState([
      "measurement_units",
      "categories",
      "user",
      "online",
      "apiDomain"
    ])
  },
  methods: {
    ...mapMutations(["setCategories", "setMeasurementUnit"]),
    getProduct() {
      this.axios
        .get(
          `${this.apiDomain}/products/products?idProduct=${this.$route.params.id}`
        )
        .then(response => {
          this.product = response.data;
        })
        .catch(function(error) {
          console.log("TCL: requestProducts -> error", error);
        });
    },
    getMeasurementName(id) {
      let value;
      this.measurement_units.forEach(unit => {
        if (unit.id_unit_measurement == id) {
          value = unit.name;
          return;
        }
      });
      return value;
    },
    getCategory(id) {
      let value;
      this.categories.forEach(category => {
        if (category.id_category == id) {
          value = category.name;
          return;
        }
      });
      return value;
    }
  }
};
</script>