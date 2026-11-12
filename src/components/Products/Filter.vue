<template>
  <v-bottom-sheet v-model="localShow" inset>
    <v-sheet class="product-filter" height="280px">
      <v-card-text class="pb-0 product-filter__title">
        {{ $t('products.sort_by') }}
      </v-card-text>
      <v-card-text class="pt-0">
        <v-radio-group v-model="sortBy">
          <v-radio :label="$t('products.nameAsc')" value="nameAZ"> </v-radio>
          <v-radio :label="$t('products.nameDesc')" value="nameZA"> </v-radio>
          <v-radio :label="$t('products.oldToNew')" value="dateNew"> </v-radio>
          <v-radio :label="$t('products.newToOld')" value="dateOld"> </v-radio>
        </v-radio-group>
      </v-card-text>
      <div class="text-center">
        <v-btn @click="handleSort" color="primary">
          <v-icon class="mr-1">fa-check</v-icon>
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
	padding-bottom: 16px;
}

.product-filter__title {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
}
</style>
