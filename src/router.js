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
  routes: [{
      //Todas las URLS insertadas que no existan redireccionaran a login
      path: '*',
      redirect: '/product/list'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/about',
      name: 'about',
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
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/register.vue'),
      meta: {
        title: 'Registro de usuario',
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
      path: '/product/view/:id',
      name: 'view_product',
      component: () => import('@/views/products/view.vue'),
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
    },
    {
      path: '/analysis/shopping_history',
      name: 'shopping history',
      component: () => import('@/views/analysis/shoppingHistory.vue'),
      meta: {
        title: 'Historial de compras',
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/miscellany/settings.vue'),
      meta: {
        title: 'Ajustes',
      }
    },
    {
      path: '/analysis/purchase_details/:id',
      name: 'purchase_details',
      component: () => import('@/views/analysis/purchaseDetails.vue'),
      meta: {
        title: 'Ver compra',
      }
    }
  ]
})

router.beforeEach((to, from, next) => Promise.resolve()
  .then(async () => {

    let publicPages = [
      'login',
      'register'
    ];

    let state;
    let authRequired = !publicPages.includes(to.name);

    if (!store.state.initialized) {

      state = await getState('state', {});
      store.commit('loadFromCache', state);

      if (state != null) {
        //Verificando si esta logueado
        if (authRequired && state.isLoged == false) {
          return next('/login');
        }
      }
    }

    // Cambiará el título cuando se cambie el enrutador
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    
  }).then(next));

export default router;