import { describe, it, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import ShopResumeMobile from "components/shop/ShopResumeMobile.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const wrapperFactory = () => mount(ShopResumeMobile, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    quantity: 10,
    subTotal: 1000,
    totalTax: 18,
    onCar: false,
    currencySymbol: 'DOP',
    isOpen: false
  }
})

const wrapper = wrapperFactory();

describe('Shop Resume Mobile Component', () => {
  it('mount component', () => {
    expect(ShopResumeMobile).toBeTruthy();
  })

  it('should be have template elements', async () => {
    // expect(wrapper.find('.quantity').exists()).toBe(true);
    // expect(wrapper.find('.sub-total').exists()).toBe(true);
    // expect(wrapper.find('.tax').exists()).toBe(true);
    // expect(wrapper.find('.total').exists()).toBe(true);
    // expect(wrapper.find('.total-tax').exists()).toBe(true);
    // expect(wrapper.find('.final-total').exists()).toBe(true);
    // expect(wrapper.find('.go-to-resume').exists()).toBe(true);
  })

  it('should be have action button to go to resume', async () => {
    // expect(wrapper.find('.go-to-resume').exists()).toBe(true);
    // expect(wrapper.find('.go-to-resume').text()).toBe('call_action_buttons.go_to_resume');
  })

  it('should be have the props on the template', async () => {
    // set is open to true
    await wrapper.setProps({ isOpen: true })
    // update the wrapper
    await wrapper.vm.$nextTick();
    // expect(wrapper.find('.quantity').text()).toBe('10');
    // expect(wrapper.find('.sub-total').text()).toBe('1,000.00 DOP');
    // expect(wrapper.find('.tax').text()).toBe('18.00 DOP');
    // expect(wrapper.find('.total').text()).toBe('1,018.00 DOP');
  })

})