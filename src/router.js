import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import {
  getState
} from './plugins/storage'
import NProgress from 'nprogress';

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/sheiley_shop',
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
        isSubDir: false,
        transitionName: 'slide'
      }
    },
    {
      path: '/auth/logout',
      name: 'logout',
      component: () => import('@/views/auth/logout.vue')
    },
    {
      path: '/product/list',
      name: 'list',
      component: () => import('@/views/products/list.vue'),
      meta: {
        title: 'Mi lista',
        isSubDir: false,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/add',
      name: 'add product',
      component: () => import('@/views/products/add.vue'),
      meta: {
        title: 'Nuevo producto',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/edit/:id',
      name: 'edit product',
      component: () => import('@/views/products/edit.vue'),
      meta: {
        title: 'Editar producto',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/view/:id',
      name: 'view_product',
      component: () => import('@/views/products/view.vue'),
      meta: {
        title: 'Editar producto',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/measurement_units',
      name: 'measurement_units',
      component: () => import('@/views/miscellany/measurement_units.vue'),
      meta: {
        title: 'Unidades de medida',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/miscellany/categories.vue'),
      meta: {
        title: 'Categorias',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/shop/shopping_car',
      name: 'shopping car',
      component: () => import('@/views/shop/shoppingCar.vue'),
      meta: {
        title: 'Carro de compra',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/analysis/shopping_history',
      name: 'shopping history',
      component: () => import('@/views/analysis/shoppingHistory.vue'),
      meta: {
        title: 'Historial de compras',
        isSubDir: false,
        transitionName: 'slide'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/miscellany/settings.vue'),
      meta: {
        title: 'Ajustes',
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/analysis/purchase_details/:id',
      name: 'purchase_details',
      component: () => import('@/views/analysis/purchaseDetails.vue'),
      meta: {
        title: 'Ver compra',
        isSubDir: true,
        transitionName: 'slide'
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

  router.beforeEach((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
  })
  
  router.afterEach((to, from) => {
    // Complete the animation of the route progress bar.
    NProgress.done()
  })

export default router;