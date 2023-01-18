import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import vuetify from 'src/plugins/vuetify'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';
import Vuex from 'vuex';
import Auth from '../../src/store/Modules/Auth/Auth.js'


import TheMenu from "components/TheMenu.vue";

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }
config.stubs['router-link'] = { template: "<div></div> " }

const localVue = createLocalVue()

localVue.use(Vuex)

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
      meta: {}
    }
  },
  propsData: {
    show: true,
  },
  data() {
    drawer: true
  }
})

const wrapper = wrapperFactory();

describe('The Menu Component', () => {
  it('mount component', () => {
    expect(TheMenu).toBeTruthy();
  })

  it('should be contain menu elements', () => {
    console.log(wrapper.html())
    expect(wrapper.find('.nav.my_list').exists()).toBe(true);
  })

})