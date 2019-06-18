import Vue from 'vue'
import Vuex from 'vuex'
import cache from './plugins/cache';
import sync from './plugins/sync';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initialized: false,
    apiDomain:'http://localhost/sheiley_shop_api',
    products:[

    ],
    user:[],
    isLoged:false
  },
  mutations: {
    setProduct(state,product){
      state.products.push(product);
    },
    setUser(state,user){
      state.user = user;
    },
    setLoginState(state,loginState){
      state.isLoged = loginState;
    },
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign({}, state[key], cached[key]);
        });
      }

      state.initialized = true;
    },
  },
  actions: {

  },
  plugins: [cache, sync],
})
