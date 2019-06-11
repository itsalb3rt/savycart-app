import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiDomain:'http://localhost/sheiley_shop_api',
    products:[

    ],
    user:[]
  },
  mutations: {
    setProduct(state,product){
      state.products.push(product);
    },
    setUser(state,user){
      state.user = user;
    },
  },
  actions: {

  }
})
