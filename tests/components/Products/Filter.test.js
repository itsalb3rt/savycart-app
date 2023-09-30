import { describe, it, expect, vi } from 'vitest'
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

  it('should be prop show true', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.props().show).toBe(true)
  })

  it('should test handleSort method', ()=>{
    const handleSortSpy = vi.spyOn(wrapper.vm, "handleSort");
    wrapper.vm.handleSort()
    expect(handleSortSpy).toHaveBeenCalled()
    expect(wrapper.emitted('filter')).toBeTruthy();
    expect(wrapper.vm.localShow).toBe(false);
  })
})