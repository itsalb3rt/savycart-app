import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import {
  getState
} from './plugins/storage';
import NProgress from 'nprogress';
import i18n from './i18n';
/**
 * isSubDir Se utiliza para alternar el drawser, el que despliega el menu y el que 
 * muestra una flecha para volver
 **/
Vue.use(Router)

/**
 * Cambio de idioma se realiza aquí porque las rutas poseen títulos dinámicos que 
 * también son traducidos
 */
let language = window.localStorage.getItem('language');
if (!language) {
  language = 'en'
}
// set the current language for i18n.
i18n.locale = language

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
        title: i18n.t('page_titles.login')
      }
    },
    {
      path: '/auth/recovery',
      name: 'recovery account',
      component: () => import('@/views/auth/recoveryAccount.vue'),
      meta: {
        title: i18n.t('page_titles.recovery_account')
      }
    },
    {
      path: '/auth/recoverypassword',
      name: 'recovery password',
      component: () => import('@/views/auth/recoveryAccountNewPassword.vue'),
      meta: {
        title: i18n.t('page_titles.recovery_account')
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/register.vue'),
      meta: {
        title: i18n.t('page_titles.register')
      }
    },
    {
      path: '/shop/registation',
      name: 'registration shopping',
      component: () => import('@/views/shop/registrationShopping.vue'),
      meta: {
        title: i18n.t('page_titles.logger_purchase'),
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
        title: i18n.t('page_titles.my_list'),
        isSubDir: false,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/add',
      name: 'add product',
      component: () => import('@/views/products/add.vue'),
      meta: {
        title: i18n.t('page_titles.add_product'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/edit/:id',
      name: 'edit product',
      component: () => import('@/views/products/edit.vue'),
      meta: {
        title: i18n.t('page_titles.edit_product'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/product/view/:id',
      name: 'view_product',
      component: () => import('@/views/products/view.vue'),
      meta: {
        title: i18n.t('page_titles.view_product'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/measurement_units',
      name: 'measurement_units',
      component: () => import('@/views/miscellany/measurement_units.vue'),
      meta: {
        title: i18n.t('page_titles.measurement_units'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/miscellany/categories.vue'),
      meta: {
        title: i18n.t('page_titles.categories'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/shop/shopping_car',
      name: 'shopping car',
      component: () => import('@/views/shop/shoppingCar.vue'),
      meta: {
        title: i18n.t('page_titles.shopping_car'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/analysis/shopping_history',
      name: 'shopping history',
      component: () => import('@/views/analysis/shoppingHistory.vue'),
      meta: {
        title: i18n.t('page_titles.shopping_history'),
        isSubDir: false,
        transitionName: 'slide'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/miscellany/settings.vue'),
      meta: {
        title: i18n.t('page_titles.settings'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/analysis/purchase_details/:id',
      name: 'purchase_details',
      component: () => import('@/views/analysis/purchaseDetails.vue'),
      meta: {
        title: i18n.t('page_titles.view_purchase'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    {
      path: '/user/profile',
      name: 'profile',
      component: () => import('@/views/user/profile.vue'),
      meta: {
        title: i18n.t('page_titles.user_profile'),
        isSubDir: true,
        transitionName: 'slide'
      }
    },
    
  ]
})

router.beforeEach((to, from, next) => Promise.resolve()
  .then(async () => {

    let publicPages = [
      'login',
      'register',
      'about',
      'recovery account',
      'recovery password'
    ];
    let authRequired = !publicPages.includes(to.name);

    let state = await getState('state', {});
    store.commit('loadFromCache', state);

    const token = window.localStorage.getItem("token");

    if (authRequired) {
      if (token === null) {
        next('/login');
      } else {
        store.commit('auth/SET_LOGGED',true);
        next();
      }
    }
    
    next();

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