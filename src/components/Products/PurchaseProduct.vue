<template>
  <v-card outlined style="max-width: 850px; margin: auto" class="mb-4">
    <v-card-text>
      <div
        class="primary--text font-weight-bold"
        @click="$emit('view-details', product)"
      >
        {{ product.name }}
        <span class="float-right" v-if="product.favorite == '1'">
          <v-icon small color="warning">fa-star</v-icon>
        </span>
      </div>
      <div class="grey--text">
        <span>{{ getMeasurementName(product.id_unit_measurement) }}</span>
        <span class="float-right">{{ product.brand }}</span>
      </div>
      <div>
        <v-layout row wrap>
          <v-flex xs5 class="mr-8 ml-2">
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
          </v-flex>
          <v-flex xs5 class="ml-1">
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
          </v-flex>
        </v-layout>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        class="ma-0"
        outlined
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
