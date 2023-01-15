import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import PurchasedProduct from "components/Products/PurchasedProduct.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const wrapperFactory = () => mount(PurchasedProduct, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    product: {
      id: 1,
      name: 'Test product',
      favorite: false,
      brand: 'Foo',
      price: 10,
      unit_price: 10,
      quantity: 2
    },
    loadingFavorite: false,
    currency: {
      symbol: 'R$',
    }
  }
})

const wrapper = wrapperFactory();

describe('Purchased Product Component', () => {
  it('mount component', () => {
    expect(PurchasedProduct).toBeTruthy();
  })

  it('should be have product', async () => {
    expect(wrapper.vm.product).toBeTruthy();

    expect(wrapper.vm.product.id).toBe(1);
    expect(wrapper.vm.product.name).toBe('Test product');
    expect(wrapper.vm.product.favorite).toBe(false);
    expect(wrapper.vm.product.brand).toBe('Foo');
    expect(wrapper.vm.product.price).toBe(10);
    expect(wrapper.vm.product.unit_price).toBe(10);
    expect(wrapper.vm.product.quantity).toBe(2);
  })

  it('should be have currency', async () => {
    expect(wrapper.vm.currency).toBeTruthy();

    expect(wrapper.vm.currency.symbol).toBe('R$');
  })

  it('should be have template elements', async () => {
    expect(wrapper.find('.name').exists()).toBe(true);
    expect(wrapper.find('.quantity').exists()).toBe(true);
    expect(wrapper.find('.measurement-unit').exists()).toBe(true);
    expect(wrapper.find('.price-container').exists()).toBe(true);
  })

})