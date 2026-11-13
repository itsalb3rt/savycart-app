<template>
  <div class="list-product" @click="$emit('view-details', product)">
    <div class="list-product__avatar">{{ getInitial(product.name) }}</div>
    <div class="list-product__info">
      <div class="list-product__name">{{ product.name }}</div>
      <div class="list-product__brand">{{ product.brand }}</div>
    </div>
    <div class="list-product__right">
      <div class="list-product__price">{{ currency.symbol }}{{ product.price }}</div>
      <v-btn
        icon
        x-small
        class="list-product__favorite"
        @click.stop="$emit('toggle-favorite', product)"
        :loading="loadingFavorite"
        :aria-label="$t('products.favorite_mark_message')"
      >
        <v-icon :class="{ 'list-product__favorite--active': product.favorite == '1' }">
          {{ product.favorite == '1' ? 'fa-star' : 'fa-star-o' }}
        </v-icon>
      </v-btn>
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        offset-x
        bottom
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            class="list-product__more"
            v-bind="attrs"
            v-on="on"
            @click.stop
          >
            <v-icon>fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-card class="list-product__menu">
          <v-list dense>
            <v-list-item @click="$emit('on-edit', product)">
              <v-list-item-icon>
                <v-icon small>fa-edit</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('call_action_buttons.edit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('on-delete', product)">
              <v-list-item-icon>
                <v-icon small color="error">fa-trash</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="list-product__menu-delete">{{ $t('call_action_buttons.delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </div>
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
  data() {
    return {
      menu: false
    };
  },
  methods: {
		getInitial(name) {
			return (name || '').charAt(0).toUpperCase();
		}
  }
}
</script>
<style>
.list-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: background 0.2s;
}

.list-product:hover {
  background: var(--surface-hover);
}

.list-product__avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.list-product__info {
  flex: 1;
  min-width: 0;
}

.list-product__name {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-product__brand {
  font-size: var(--fs-small);
  color: var(--muted);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-product__right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.list-product__price {
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--text);
  margin-right: 4px;
}

.list-product__favorite {
  min-width: 36px;
  min-height: 36px;
}

.list-product__favorite v-icon {
  font-size: 18px;
  color: var(--muted);
}

.list-product__favorite--active {
  color: var(--positive) !important;
}

.list-product__more {
  min-width: 36px;
  min-height: 36px;
}

.list-product__more v-icon {
  font-size: 16px;
  color: var(--muted);
}

.list-product__menu {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  min-width: 160px;
  box-shadow: var(--shadow-float);
}

.list-product__menu-delete {
  color: var(--negative);
}
</style>
