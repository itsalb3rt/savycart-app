<template>
  <v-bottom-sheet v-model="localShow" inset>
    <v-sheet style="border-radius: 8px" height="200px">
      <v-card outlined>
        <v-card-text> Sort by </v-card-text>
        <v-card-text>
          <v-btn-toggle v-model="sortBy" color="primary" group mandatory shaped>
            <v-btn value="nameAZ">Name AZ</v-btn>
            <v-btn value="nameZA">Name ZA</v-btn>
            <v-btn value="dateNew">Date New</v-btn>
            <v-btn value="dateOld">Date Old</v-btn>
          </v-btn-toggle>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="handleSort" tyle="margin:auto" color="success">
            <v-icon class="mr-1">fa-check</v-icon>
            {{ $t('call_action_buttons.done') }}
          </v-btn>
        </v-card-actions>
      </v-card>
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
      sortBy: 'name',
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
