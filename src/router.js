import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import {getState} from './plugins/storage'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      //Todas las URLS insertadas que no existan redireccionaran a login
      path: '*',
      redirect:'/login'
    },
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/auth/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/auth/register.vue')
    },
    {
      path: '/auth/logout',
      name: '/auth/logout',
      component: () => import('./views/auth/logout.vue')
    },
    {
      path: '/product/list',
      name: 'list',
      component: () => import('./views/products/list.vue')
    }
  ]
})

// Load local cache
  router.beforeEach((to, from, next) => Promise.resolve()
  .then(async () => {
    if (!store.state.initialized) {
      const state = await getState('state', {});
      store.commit('loadFromCache', state);
    }
  })
  .then(next));

  export default router;
