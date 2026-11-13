<template>
  <div class="purchase-product" @click="$emit('view-details', product)">
    <div class="purchase-product__avatar" :style="{ background: avatarBg }">
      {{ product.name.charAt(0).toUpperCase() }}
    </div>
    <div class="purchase-product__info">
      <div class="purchase-product__name">{{ product.name }}</div>
      <div class="purchase-product__meta">
        <span v-if="product.brand">{{ product.brand }}</span>
        <span v-if="product.brand" class="purchase-product__separator">·</span>
        <span class="purchase-product__price">{{ currency.symbol }}{{ product.price }}</span>
      </div>
    </div>
    <div class="purchase-product__actions">
      <template v-if="isOnCar">
        <div class="purchase-product__qty-control">
          <button class="purchase-product__qty-btn" @click.stop="decrement" type="button">
            <v-icon small>fa-minus</v-icon>
          </button>
          <span class="purchase-product__qty-value">{{ localQuantity }}</span>
          <button class="purchase-product__qty-btn purchase-product__qty-btn--plus" @click.stop="increment" type="button">
            <v-icon small>fa-plus</v-icon>
          </button>
        </div>
      </template>
      <template v-else>
        <v-btn outlined color="primary" class="purchase-product__add-btn" @click.stop="$emit('add-to-car')">
          {{ $t('shopping_car.add_to_shopping_car') }}
        </v-btn>
      </template>
    </div>
  </div>
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
  data() {
    return {
      localQuantity: 1,
    };
  },
  mounted() {
    this.localQuantity = this.product.quantity || 1;
  },
  computed: {
    avatarBg() {
      const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
      const index = (this.product.name.charCodeAt(0) || 0) % colors.length;
      return colors[index];
    }
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
      return value || '';
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
.purchase-product {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.purchase-product:hover {
  background: var(--surface-hover, transparent);
}

.purchase-product__avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}

.purchase-product__info {
  flex: 1;
  min-width: 0;
}

.purchase-product__name {
  font-size: var(--fs-section);
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-product__meta {
  font-size: var(--fs-small);
  color: var(--muted);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.purchase-product__separator {
  color: var(--muted);
}

.purchase-product__price {
  font-weight: 500;
}

.purchase-product__actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.purchase-product__add-btn {
  min-width: 80px;
  height: 36px;
  border-radius: 18px;
  font-size: var(--fs-body);
  font-weight: 600;
}

.purchase-product__qty-control {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--border);
  border-radius: 22px;
  padding: 2px;
}

.purchase-product__qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--surface);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s;
}

.purchase-product__qty-btn:hover {
  background: var(--surface-hover, transparent);
}

.purchase-product__qty-btn--plus {
  background: var(--primary);
  color: #fff;
}

.purchase-product__qty-btn--plus:hover {
  opacity: 0.9;
}

.purchase-product__qty-value {
  min-width: 28px;
  text-align: center;
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text);
}
</style>
