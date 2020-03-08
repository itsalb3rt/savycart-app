import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import './plugins/fontawesome';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './registerServiceWorker';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../node_modules/nprogress/nprogress.css';
import { VueHammer } from 'vue2-hammer';
import i18n from './i18n'

Vue.use(VueAxios, axios)
Vue.use(VueHammer)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
