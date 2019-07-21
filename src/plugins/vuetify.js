import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#03A9F4',
    secondary: '#607D8B',
    accent: '#82B1FF',
    error: '#d32f2f',
    info: '#17a2b8',
    success: '#4CAF50',
    warning: '#FFB300'
  },
  options: {
    customProperties: true
  },
  iconfont: 'fa',
})
