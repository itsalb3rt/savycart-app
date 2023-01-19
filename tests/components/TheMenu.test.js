import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';
import Vuex from 'vuex';
import Auth from '../../src/store/Modules/Auth/Auth.js'
import { VueHammer } from 'vue2-hammer';

import TheMenu from "components/TheMenu.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }
config.stubs['router-link'] = { template: "<div></div> " }

const localVue = createLocalVue()

localVue.use(Vuex);
localVue.use(VueHammer);

let store = new Vuex.Store({
  modules: {
    auth: {
      ...Auth,
      namespaced: true
    }
  }
})

const wrapperFactory = () => mount(TheMenu, {
  store,
  localVue,
  vuetify,
  mocks: {
    $t: (msg) => msg,
    $route: {
      meta: {
        isSubDir: true
      }
    }
  },
  propsData: {
    title: 'test'
  },
})

const wrapper = wrapperFactory();

describe('The Menu Component', () => {
  it('mount component', () => {
    expect(TheMenu).toBeTruthy();
  })

  it('should be contain title', () => {
    expect(wrapper.find('.v-toolbar__title').text()).toBe('test')
  })

})