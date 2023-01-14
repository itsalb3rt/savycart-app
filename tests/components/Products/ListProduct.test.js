import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';
import Vuex from 'vuex';
import MeasurementUnitsModule from '../../../src/store/Modules/MeasurementUnits.js'

import ListProduct from "components/Products/ListProduct.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const localVue = createLocalVue()

localVue.use(Vuex)

let store = new Vuex.Store({
  modules: {
    measurementUnits: {
      ...MeasurementUnitsModule,
      namespaced: true
    }
  }
})

const wrapperFactory = () => mount(ListProduct, {
  store, 
  localVue,
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
      price: 10
    },
    loadingFavorite: false,
    currency: {
      symbol: 'R$',
    }
  }
})

const wrapper = wrapperFactory();

describe('List Product Component', () => {
  it('mount component', () => {
    expect(ListProduct).toBeTruthy();
  })

  it('should be have product', async () => {
    expect(wrapper.props().product).toBeTruthy()

    expect(wrapper.props().product.id).toBe(1)
    expect(wrapper.props().product.name).toBe('Test product')
    expect(wrapper.props().product.favorite).toBe(false)
    expect(wrapper.props().product.brand).toBe('Foo')
    expect(wrapper.props().product.price).toBe(10)
  })

  it('should be have loadingFavorite', async () => {
    expect(wrapper.props().loadingFavorite).toBe(false)
    await wrapper.setProps({ loadingFavorite: true })
    expect(wrapper.props().loadingFavorite).toBe(true)
  })

  it('should be have currency', async () => {
    expect(wrapper.props().currency).toBeTruthy()
    expect(wrapper.props().currency.symbol).toBe('R$')
  })

})