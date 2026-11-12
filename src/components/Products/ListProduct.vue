<template>
<v-card outlined class="list-product mb-4">
	<v-card-text>
		<div class="list-product__top">
			<span
				@click="$emit('view-details', product)"
				text
				class="ma-0 pa-0 list-product__name"
			>{{product.name}}</span>
			<span class="float-right" v-if="product.favorite == '1' ">
        <v-btn
          icon
          color="accent"
					@click="$emit('toggle-favorite', product)"
					:loading="loadingFavorite"
					:aria-label="$t('products.favorite_mark_message')"
        >
          <v-icon>fa-star</v-icon>
        </v-btn>
			</span>
			<span class="float-right" v-else>
				<v-btn
        	icon
          color="grey"
					@click="$emit('toggle-favorite', product)"
					:loading="loadingFavorite"
					:aria-label="$t('products.favorite_mark_message')"
					>
					<v-icon>fa-star</v-icon>
				</v-btn>
			</span>
		</div>
		<div class="list-product__meta">
			<span>{{getMeasurementName(product.id_unit_measurement)}}</span>
			<span class="float-right">{{product.brand}}</span>
		</div>
		<div class="list-product__price num">{{currency.symbol}} {{product.price}}</div>
	</v-card-text>
	<v-card-actions>
		<v-btn
			outlined
			color="primary"
			@click="$emit('on-edit', product)"
			class="edit"
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
export default {
  name: 'listProduct',
  props: {
    product: {
      type: Object,
      required: true
    },
    currency: {
      type: Object,
      required: true,
      default: () => ({
        symbol: '$'
      })
    },
		loadingFavorite: {
			type: Boolean,
			required: true,
			default: false
		}
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
<style>
.list-product__name {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	cursor: pointer;
}

.list-product__name:hover {
	color: var(--accent-ink);
}

.list-product__meta {
	color: var(--muted);
	font-size: var(--fs-body);
}

.list-product__price {
	margin-top: 4px;
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
}
</style>
