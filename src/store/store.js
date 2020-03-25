import Vue from 'vue'
import Vuex from 'vuex'
import auth from './Modules/Auth/Auth'
import products from './Modules/Products';
import categories from './Modules/Categories';
import measurementUnits from './Modules/MeasurementUnits';
import taxes from './Modules/Taxes';
import shoppingCar from './Modules/ShoppingCar';
import shoppings from './Modules/Shoppings';
import snackbar from './Modules/Snackbar';

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
    shoppings,
    snackbar
  },
  state: {
    isLoged: false,
    user: [],
    currencies: [],
    online: true,
  },
  mutations: {
    setCurrency(state, currency) {
      state.currencies.push(currency);
    },
    setUser(state, user) {
      state.user = user;
    },
    setOnline(state, value) {
      state.online = value;
    }
  },
  actions: {}
})