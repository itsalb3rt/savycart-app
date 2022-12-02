<template>
  <v-bottom-sheet v-model="localShow" inset>
    <v-sheet style="border-radius: 8px" height="280px">
      <v-card-text class="pb-0 font-weight-bold"> Sort by </v-card-text>
      <v-card-text class="pt-0">
        <v-radio-group v-model="sortBy">
          <v-radio :label="$t('products.nameAsc')" value="nameAZ"> </v-radio>
          <v-radio :label="$t('products.nameDesc')" value="nameZA"> </v-radio>
          <v-radio :label="$t('products.oldToNew')" value="dateNew"> </v-radio>
          <v-radio :label="$t('products.newToOld')" value="dateOld"> </v-radio>
        </v-radio-group>
      </v-card-text>
      <div class="text-center">
        <v-btn @click="handleSort" tyle="margin:auto" color="success">
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
