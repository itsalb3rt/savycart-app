<template>
  <v-card outlined class="purchase-product mb-4">
    <v-card-text>
      <div class="purchase-product__top">
        <span
          class="purchase-product__name"
          @click="$emit('view-details', product)"
        >
          {{ product.name }}
        </span>
        <span class="float-right" v-if="product.favorite == '1'">
          <v-icon small color="accent">fa-star</v-icon>
        </span>
      </div>
      <div class="purchase-product__meta">
        <span>{{ getMeasurementName(product.id_unit_measurement) }}</span>
        <span class="float-right">{{ product.brand }}</span>
      </div>
      <div>
        <v-row>
          <v-col cols="5" class="mr-8 ml-2">
            <v-text-field
              :prefix="currency.symbol"
              type="number"
              name="price"
              id="price"
              step="0.01"
              min="1"
              placeholder="1"
              v-model.number="product.price"
              :disabled="isOnCar"
            >
            </v-text-field>
          </v-col>
          <v-col cols="5" class="ml-1">
            <v-text-field
              append-outer-icon="fa fa-plus"
              @click:append-outer="increment"
              prepend-icon="fa fa-minus"
              @click:prepend="decrement"
              ref="quantity"
              :label="$t('products.quantity')"
              type="number"
              name="quantity"
              id="quantity"
              value="1"
              min="1"
              placeholder="1"
              v-model.number="localQuantity"
              @change="val => $emit('change-quantity', val)"
              :disabled="isOnCar"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        class="ma-0"
        v-if="!isOnCar"
        @click="$emit('add-to-car')"
        >{{ $t('shopping_car.add_to_shopping_car') }}</v-btn
      >
      <v-btn
        color="error"
        class="ma-0"
        outlined
        v-if="isOnCar"
        @click="$emit('remove-from-car', product)"
        >{{ $t('shopping_car.remove_from_shopping_car') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'purchaseProduct',
  props: {
    product: {
      type: Object,
      required: true,
    },
    isOnCar: {
      type: Boolean,
      required: true,
    },
    currency: {
      type: Object,
      required: true,
      default: () => ({
        symbol: '$',
      }),
    },
  },
  onMounted() {
    this.localQuantity = this.product.quantity;
  },
  data() {
    return {
      localQuantity: 1,
    };
  },
  methods: {
    getMeasurementName(id) {
      let value;
      this.$store.getters['measurementUnits/getAll'].forEach((unit) => {
        if (unit.id_unit_measurement == id) {
          value = unit.name;
          return;
        }
      });
      return value;
    },
    increment() {
      this.localQuantity++;
      this.$emit('change-quantity', this.localQuantity);
    },
    decrement() {
      if (this.localQuantity > 1) {
        this.localQuantity--;
        this.$emit('change-quantity', this.localQuantity);
      }
    },
  },
};
</script>
<style>
/* Chrome shrink-to-fit: the price/qty row inside the bare wrapper div
   collapses to max-content instead of filling, stacking the cols at narrow
   widths and blowing past the 220px virtual-scroll pitch. calc() compensates
   the .row -12px side margins. */
.purchase-product .row {
  width: calc(100% + 24px);
}

.purchase-product__name {
  font-size: var(--fs-section);
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
}

.purchase-product__name:hover {
  color: var(--accent-ink);
}

.purchase-product__meta {
  color: var(--muted);
  font-size: var(--fs-body);
}
</style>
