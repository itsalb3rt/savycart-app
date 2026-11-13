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

const wrapperFactory = (isSubDir = false) => mount(TheMenu, {
  store,
  localVue,
  vuetify,
  mocks: {
    $t: (msg) => msg,
    $route: {
      meta: {
        isSubDir: isSubDir
      },
      path: '/product/list'
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

  it('should render BottomNavigation for main screens', () => {
    const mainWrapper = wrapperFactory(false);
    expect(mainWrapper.findComponent({ name: 'BottomNavigation' }).exists()).toBe(true);
  })

  it('should not render BottomNavigation for sub directories', () => {
    const subWrapper = wrapperFactory(true);
    expect(subWrapper.findComponent({ name: 'BottomNavigation' }).exists()).toBe(false);
  })

})