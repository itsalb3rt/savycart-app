import { describe, it, expect, vi } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';
import Vuex from 'vuex';
import MeasurementUnitsModule from '../../../src/store/Modules/MeasurementUnits.js'

import PurchaseProduct from "components/Products/PurchaseProduct.vue";

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

const wrapperFactory = () => mount(PurchaseProduct, {
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
    isOnCar: false,
    currency: {
      symbol: 'R$',
    }
  }
})

const wrapper = wrapperFactory();

describe('Purchase Product Component', () => {
  it('mount component', () => {
    expect(PurchaseProduct).toBeTruthy();
  })

  it('should be have product', async () => {
    expect(wrapper.props().product).toBeTruthy()

    expect(wrapper.props().product.id).toBe(1)
    expect(wrapper.props().product.name).toBe('Test product')
    expect(wrapper.props().product.favorite).toBe(false)
    expect(wrapper.props().product.brand).toBe('Foo')
    expect(wrapper.props().product.price).toBe(10)
  })

  it('should be have isOnCar', async () => {
    expect(wrapper.props().isOnCar).toBe(false)
    await wrapper.setProps({ isOnCar: true })
    expect(wrapper.props().isOnCar).toBe(true)
  })

  it('should be have currency', async () => {
    expect(wrapper.props().currency).toBeTruthy()
    expect(wrapper.props().currency.symbol).toBe('R$')
  })

  it("should test increment method",()=>{
    wrapper.vm.localQuantity = 0
    const incrementSpy = vi.spyOn(wrapper.vm, "increment");
    wrapper.vm.increment()
    expect(incrementSpy).toHaveBeenCalled()
    expect(wrapper.vm.localQuantity).toEqual(1)
  });

  it("should test decrement method", async() => {
    wrapper.vm.localQuantity = 2;
    const decrementSpy = vi.spyOn(wrapper.vm, "decrement");
    wrapper.vm.decrement();
    await wrapper.vm.$nextTick()
    expect(decrementSpy).toHaveBeenCalled();
    expect(wrapper.vm.localQuantity).toEqual(1);
  });

})