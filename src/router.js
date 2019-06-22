import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import {
  getState
} from './plugins/storage'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      //Todas las URLS insertadas que no existan redireccionaran a login
      path: '*',
      redirect: '/product/list'
    },
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/login.vue'),
      meta: {
        title: 'Login',
      }
    },
    {
      path: '/shop/registation',
      name: 'registration shopping',
      component: () => import('@/views/shop/registrationShopping.vue'),
      meta: {
        title: 'Registro compra',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/register.vue'),
      meta: {
        title: 'Registro de usuario',
      }
    },
    {
      path: '/auth/logout',
      name: '/auth/logout',
      component: () => import('@/views/auth/logout.vue')
    },
    {
      path: '/product/list',
      name: 'list',
      component: () => import('@/views/products/list.vue'),
      meta: {
        title: 'Mi lista',
      }
    },
    {
      path: '/product/add',
      name: 'add product',
      component: () => import('@/views/products/add.vue'),
      meta: {
        title: 'Nuevo producto',
      }
    },
    {
      path: '/product/edit/:id',
      name: 'edit product',
      component: () => import('@/views/products/edit.vue'),
      meta: {
        title: 'Editar producto',
      }
    },
    {
      path: '/measurement_units',
      name: 'measurement_units',
      component: () => import('@/views/miscellany/measurement_units.vue'),
      meta: {
        title: 'Unidades de medida',
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/miscellany/categories.vue'),
      meta: {
        title: 'Categorias',
      }
    },
    {
      path: '/shop/shopping_car',
      name: 'shopping car',
      component: () => import('@/views/shop/shoppingCar.vue'),
      meta: {
        title: 'Carro de compra',
      }
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
// Cambiará el título cuando se cambie el enrutador
router.beforeEach((to, from, next) => {

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;