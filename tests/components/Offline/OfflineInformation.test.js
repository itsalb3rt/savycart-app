import { describe, it, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';

import OfflineInformation from "components/Offline/OfflineInformation.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }


const wrapperFactory = () => mount(OfflineInformation, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    show: true,
  }
})

const wrapper = wrapperFactory();

describe('Offline Information Component', () => {
  it('mount component', () => {
    expect(OfflineInformation).toBeTruthy();
  })

  it('should be contain messages.internet_conection_lost', () => {
    expect(wrapper.text()).toContain('messages.internet_conection_lost');
  })

  it('should be contain messages.intenet_required', () => {
    expect(wrapper.text()).toContain('messages.intenet_required');
  })

})