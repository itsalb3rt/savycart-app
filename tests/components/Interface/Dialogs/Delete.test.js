import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from '../../../mocks/DataAppElement';

import DeleteDialog from "components/Interface/Dialogs/Delete.vue";

addElemWithDataAppToBody();

const wrapperFactory = () => mount(DeleteDialog, {
  vuetify,
  mocks: {
    $t: (msg) => msg
  },
  propsData: {
    show: true,
  }
})

const wrapper = wrapperFactory();

describe('Delete dialog', () => {
  it('mount component', () => {
    expect(DeleteDialog).toBeTruthy();
  })

  it('should render button to with text call_action_buttons.delete', () => {
    expect(wrapper.find('.v-btn.delete').text()).toBe('call_action_buttons.delete');
  })

  it('should render button to with text products.keep_item', () => {
    expect(wrapper.find('.v-btn.cancel').text()).toBe('products.keep_item');
  })

})