import '@babel/polyfill';
import Vue from 'vue';
import vuetify from './plugins/vuetify';
import './styles/tokens.css';
import './styles/vuetify-overrides.css';
import './styles/shared.css';
import './plugins/fontawesome';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './registerServiceWorker';
import axios from 'axios';
import VueAxios from 'vue-axios';
import '@fortawesome/fontawesome-free/css/all.css';
import '../node_modules/nprogress/nprogress.css';
import { VueHammer } from 'vue2-hammer';
import i18n from './i18n'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueHammer)

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
