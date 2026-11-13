<template>
  <v-bottom-sheet v-model="localShow" inset>
    <v-sheet class="product-filter">
      <div class="product-filter__header">
        <span class="product-filter__title">{{ $t('products.sort_by') }}</span>
        <v-btn text @click="localShow = false" class="product-filter__close">
          <v-icon>fa-times</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="product-filter__options">
        <div
          :class="['product-filter__option', { 'product-filter__option--active': sortBy === 'nameAZ' }]"
          @click="sortBy = 'nameAZ'"
        >
          <v-icon small class="product-filter__option-icon">{{ sortBy === 'nameAZ' ? 'fa-check-circle' : 'fa-circle' }}</v-icon>
          <span class="product-filter__option-label">{{ $t('products.nameAsc') }}</span>
        </div>
        <div
          :class="['product-filter__option', { 'product-filter__option--active': sortBy === 'nameZA' }]"
          @click="sortBy = 'nameZA'"
        >
          <v-icon small class="product-filter__option-icon">{{ sortBy === 'nameZA' ? 'fa-check-circle' : 'fa-circle' }}</v-icon>
          <span class="product-filter__option-label">{{ $t('products.nameDesc') }}</span>
        </div>
        <div
          :class="['product-filter__option', { 'product-filter__option--active': sortBy === 'dateNew' }]"
          @click="sortBy = 'dateNew'"
        >
          <v-icon small class="product-filter__option-icon">{{ sortBy === 'dateNew' ? 'fa-check-circle' : 'fa-circle' }}</v-icon>
          <span class="product-filter__option-label">{{ $t('products.oldToNew') }}</span>
        </div>
        <div
          :class="['product-filter__option', { 'product-filter__option--active': sortBy === 'dateOld' }]"
          @click="sortBy = 'dateOld'"
        >
          <v-icon small class="product-filter__option-icon">{{ sortBy === 'dateOld' ? 'fa-check-circle' : 'fa-circle' }}</v-icon>
          <span class="product-filter__option-label">{{ $t('products.newToOld') }}</span>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="product-filter__footer">
        <v-btn @click="handleSort" color="primary" class="product-filter__done">
          <v-icon left>fa-check</v-icon>
          {{ $t('call_action_buttons.done') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script>
export default {
  name: 'filterProduct',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localShow: this.show,
      sortBy: 'nameAZ',
    };
  },
  methods: {
    handleSort() {
      this.$emit('filter', { sortBy: this.sortBy });
      this.localShow = false;
    },
  },
  watch: {
    show(val) {
      this.localShow = val;
    },
  },
};
</script>
<style>
.product-filter {
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  padding: 0;
  background: var(--surface);
  max-height: 70vh;
}

.product-filter__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.product-filter__title {
  font-size: var(--fs-section);
  font-weight: 600;
  color: var(--text);
}

.product-filter__close {
  min-width: 32px;
  min-height: 32px;
}

.product-filter__options {
  padding: 8px 0;
}

.product-filter__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.product-filter__option:hover {
  background: var(--surface-hover);
}

.product-filter__option--active {
  background: var(--primary-light);
}

.product-filter__option-icon {
  font-size: 18px;
  color: var(--muted);
}

.product-filter__option--active .product-filter__option-icon {
  color: var(--primary);
}

.product-filter__option-label {
  font-size: var(--fs-body);
  color: var(--text);
}

.product-filter__option--active .product-filter__option-label {
  color: var(--primary);
  font-weight: 600;
}

.product-filter__footer {
  padding: 16px;
  text-align: center;
}

.product-filter__done {
  width: 100%;
  border-radius: var(--radius-control);
  height: 48px;
  font-weight: 600;
}
</style>
