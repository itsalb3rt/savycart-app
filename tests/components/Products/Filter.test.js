import { describe, it, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import FilterComponent from "components/Products/Filter.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }


const wrapperFactory = () => mount(FilterComponent, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    show: false,
  }
})

const wrapper = wrapperFactory();

describe('Filter Component', () => {
  it('mount component', () => {
    expect(FilterComponent).toBeTruthy();
  })

  it('should be contain titles', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.text()).toContain('Sort by')
  })

})