import Vue from 'vue'
import Vuex from 'vuex'
import auth from './Modules/Auth/Auth'
import products from './Modules/Products';
import categories from './Modules/Categories';
import measurementUnits from './Modules/MeasurementUnits';
import taxes from './Modules/Taxes';
import shoppingCar from './Modules/ShoppingCar';
import shoppings from './Modules/Shoppings';

Vue.use(Vuex)
Vue.config.devtools = true
export default new Vuex.Store({
  modules: {
    auth,
    products,
    categories,
    measurementUnits,
    taxes,
    shoppingCar,
    shoppings
  },
  state: {
    initialized: false,
    isLoged: false,
    apiDomain: (process.env.NODE_ENV == 'development') ? 'http://localhost/sheiley_shop_api' : 'https://gibucket.a2hosted.com/sheiley_shop_api',
    user: [],
    itbis: 0,
    currencies: [],
    online: true,
    products: [],
    shoppingCar: [],
  },
  mutations: {
    setCurrency(state, currency) {
      state.currencies.push(currency);
    },
    setUser(state, user) {
      state.user = user;
    },
    setLoginState(state, loginState) {
      state.isLoged = loginState;
    },
    setOnline(state, value) {
      state.online = value;
    }
  },
  actions: {}
})