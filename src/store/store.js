import Vue from 'vue'
import Vuex from 'vuex'
import cache from '../plugins/cache';
import sync from '../plugins/sync';
import auth from './Modules/Auth/Auth'
import products from './Modules/Products';
import categories from './Modules/Categories';

Vue.use(Vuex)
export default new Vuex.Store({
  plugins: [cache, sync],
  modules: {
    auth,
    products,
    categories
  },
  state: {
    initialized: false,
    isLoged: false,
    apiDomain: (process.env.NODE_ENV == 'development') ? 'http://localhost/sheiley_shop_api' : 'https://gibucket.a2hosted.com/sheiley_shop_api',
    user: [],
    measurement_units: [],
    itbis: 0,
    currencies: [],
    online: '',
    products: [],
    shoppingCar: [],
  },
  mutations: {
    addMeasurementUnit(state, unit) {
      /*
       * unit => {id:1,name:bar}
       */
      state.measurement_units.push(unit);
    },
    setMeasurementUnit(state, units) {
      state.measurement_units = units;
    },
    removeMeasurementUnit(state, index) {
      state.measurement_units.splice(index, 1);
    },
    setCurrency(state, currency) {
      state.currencies.push(currency);
    },
    addProduct(state, product) {
      /*
       * product => {id_product:1,name:bar, ...}
       */
      state.products.push(product);
    },
    setProducts(state, products) {
      state.products = products;
    },
    removeProduct(state, index) {
      state.products.splice(index, 1);
    },
    setUser(state, user) {
      state.user = user;
    },
    setLoginState(state, loginState) {
      state.isLoged = loginState;
    },
    setOnline(state, value) {
      state.online = value;
    },
    loadFromCache(state, cached) {
      if (cached) {
        /* 
         * Object.assign se cambio el primer parametro para guardar 
         * todo lo que este vacio como array, por defecto estaba como
         * objeto
         * de {} a []
         */
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign(state[key], cached[key]);
        });
      }

      state.initialized = true;
    },
  },
  actions: {

  }
})