import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import ShoppingCar from "components/Shop/ShoppingCar.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const wrapperFactory = () => mount(ShoppingCar, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    count: 0
  }
})

const wrapper = wrapperFactory();

describe('Shopping Car Component', () => {
  it('mount component', () => {
    expect(ShoppingCar).toBeTruthy();
  })

  it('should be have template elements', async () => {
    await wrapper.setProps({ count: 2 })

    expect(wrapper.find('.car').exists()).toBe(true);
    expect(wrapper.find('.count').exists()).toBe(true);
    expect(wrapper.find('.count').text()).toBe('2');
  })

})