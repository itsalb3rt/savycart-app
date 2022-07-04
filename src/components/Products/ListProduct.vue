<template>
<v-card outlined style="max-width:850px; margin:auto" class="mb-4">
	<v-card-text>
		<div>
			<span
				@click="$emit('view-details', product)"
				text
				class="ma-0 pa-0 primary--text font-weight-bold subheading"
			>{{product.name}}</span>
			<span v-if="product.favorite == '1' ">
				<v-icon color="warning" class="ml-2">fa-star</v-icon>
			</span>
		</div>
		<div class="grey--text">
			<span>{{getMeasurementName(product.id_unit_measurement)}}</span>
			<span class="float-right">{{product.brand}}</span>
		</div>
		<div class="font-weight-bold subheading">{{currency.symbol}} {{product.price}}</div>
	</v-card-text>
	<v-card-actions>
		<v-btn
			color="success"
			depressed
			outlined
			@click="$emit('on-edit', product)"
		>
			<v-icon class="mr-1">fa-edit</v-icon>
			{{ $t('call_action_buttons.edit') }}
		</v-btn>
		<v-spacer></v-spacer>
		<v-btn
			color="error"
			text
			class="ma-0 pa-0 right"
			@click="$emit('on-delete', product)"
		>
			<v-icon class="mr-1">fa-trash</v-icon>
			{{ $t('call_action_buttons.delete') }}
		</v-btn>
	</v-card-actions>
</v-card>
</template>
<script>
import currencies from '@/mixins/miscellany/currencies';

export default {
  name: 'listProduct',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  mixins: [currencies],
  data () {
    return {
			currency: [],
    }
  },
  async created () {
    this.currency = await this.getPreferredCurrency();
  },
  methods: {
		getMeasurementName(id) {
			let value;
			this.$store.getters['measurementUnits/getAll'].forEach(unit => {
				if (unit.id_unit_measurement == id) {
					value = unit.name;
					return;
				}
			});
			return value;
		}
  }
}
</script>