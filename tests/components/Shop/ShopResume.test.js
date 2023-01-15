import { describe, it, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import ShopResume from "components/Shop/ShopResume.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const wrapperFactory = () => mount(ShopResume, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    quantity: 10,
    subTotal: 1000,
    totalTax: 18,
    onCar: false,
    currencySymbol: 'DOP'
  }
})

const wrapper = wrapperFactory();

describe('Shop Resume Component', () => {
  it('mount component', () => {
    expect(ShopResume).toBeTruthy();
  })

  it('should be have template elements', async () => {
    expect(wrapper.find('.quantity').exists()).toBe(true);
    expect(wrapper.find('.sub-total').exists()).toBe(true);
    expect(wrapper.find('.tax').exists()).toBe(true);
    expect(wrapper.find('.total').exists()).toBe(true);
    expect(wrapper.find('.total-tax').exists()).toBe(true);
    expect(wrapper.find('.final-total').exists()).toBe(true);
    expect(wrapper.find('.go-to-resume').exists()).toBe(true);
  })

  it('should be have action button to go to resume', async () => {
    expect(wrapper.find('.go-to-resume').exists()).toBe(true);
    expect(wrapper.find('.go-to-resume').text()).toBe('call_action_buttons.go_to_resume');
  })

})