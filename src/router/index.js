import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import store from '../store/index';
const logIn = () => import('@/components/login/login')
const notFind = () => import('@/components/public/notFind.vue')


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '*',
      name: '404',
      component: notFind
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: logIn
    },
    // {
    //   path: '/',
    //   name: 'index',
    //   component: resolve => require(['@/views/index'], resolve),
    //   // redirect: '/totalManageC',
    //   redirect: '/totalManageC/store',
    // },
    {
      path: '/totalManageC',
      name: 'totalManageC',
      component: resolve => require(['@/views/totalManageC'], resolve),
      redirect: '/totalManageC/store',
      children: [
        {
          path: 'store',
          name: 'store',
          component: resolve => require(['@/components/totalManageCenter/store'], resolve)
        },{
          path: 'addStore',
          name: 'addStore',
          component: resolve => require(['@/components/totalManageCenter/addStore'], resolve)
          }, {
          path: 'brand',
          name: 'brand',
          component: resolve => require(['@/components/totalManageCenter/brand'], resolve)
        }, {
          path: 'reservation',
          name: 'reservation',
          component: resolve => require(['@/components/totalManageCenter/reservation'], resolve)
        }, {
          path: 'apply',
          name: 'apply',
          component: resolve => require(['@/components/totalManageCenter/apply'], resolve)
        }, {
          path: 'userInfo',
          name: 'userInfo',
          component: resolve => require(['@/components/totalManageCenter/userInfo'], resolve)
        }, {
          path: 'integral',
          name: 'integral',
          component: resolve => require(['@/components/totalManageCenter/integral'], resolve)
        },
        {
          path: 'coupon',
          name: 'coupon',
          component: resolve => require(['@/components/totalManageCenter/coupon'], resolve)
        }, {
          path: 'newsTemp',
          name: 'newsTemp',
          component: resolve => require(['@/components/totalManageCenter/newsTemp'], resolve)
        }, {
          path: 'storeConfig',
          name: 'storeConfig',
          component: resolve => require(['@/components/totalManageCenter/storeConfig'], resolve)
        }, {
          path: 'integralDetail',
          name: 'integralDetail',
          component: resolve => require(['@/components/totalManageCenter/integralDetail'], resolve)
        }, {
          path: 'setIntegral',
          name: 'setIntegral',
          component: resolve => require(['@/components/totalManageCenter/setIntegral'], resolve)
        }, {
          path: 'setUpCoupon',
          name: 'setUpCoupon',
          component: resolve => require(['@/components/totalManageCenter/setUpCoupon'], resolve)
        },
        {
          path: 'message',
          name: 'message',
          component: resolve => require(['@/components/totalManageCenter/message'], resolve)
        }
      ]
    },
    {
      path: '/operationManageC',
      name: 'operationManageC',
      component: resolve => require(['@/views/operationManageC'], resolve),
      // redirect:'/operationManageC/technician',

      // beforeEnter: (to, from, next) => {

      // },
      children: [
        {
          path: 'technician',
          name: 'technician',
          component: resolve => require(['@/components/operationManageCenter/technician'], resolve),
          // children: []
        },
        {
          path: 'bindSer',
          name: 'bindServiceOfTechnician',
          component: resolve => require(['@/components/operationManageCenter/bindServiceOfTechnician'], resolve)
        },
        {
          path: 'serviceM',
          name: 'serviceM',
          component: resolve => require(['@/components/operationManageCenter/serviceM'], resolve)
        },

        {
          path: 'imgManage',
          name: 'imgManage',
          component: resolve => require(['@/components/operationManageCenter/imgManage'], resolve)
        },
        {
          path: 'imgCarousel',
          name: 'imgCarousel',
          component: resolve => require(['@/components/operationManageCenter/imgCarousel'], resolve)
        },
        {
          path: 'imgStoreDisplay',
          name: 'imgStoreDisplay',
          component: resolve => require(['@/components/operationManageCenter/imgStoreDisplay'], resolve)
        },
        {
          path: 'recommandTech',
          name: 'recommandTech',
          component: resolve => require(['@/components/operationManageCenter/recommandTech'], resolve)
        },
        {
          path: 'recommandService',
          name: 'recommandService',
          component: resolve => require(['@/components/operationManageCenter/recommandService'], resolve)
        },
        {
          path: 'addTechnician',
          name: 'addTechnician',
          component: resolve => require(['@/components/operationManageCenter/addTechnician'], resolve)
        },
        {
          path: 'modifyTechnician',
          name: 'modifyTechnician',
          component: resolve => require(['@/components/operationManageCenter/modifyTechnician'], resolve)
        },
        {
          path: 'addService',
          name: 'addService',
          component: resolve => require(['@/components/operationManageCenter/addService'], resolve)
        },
        {
          path: 'modifyService',
          name: 'modifyService',
          component: resolve => require(['@/components/operationManageCenter/modifyService'], resolve)
        },
      ]
    },
    {
      path: '/templateMarketC',
      name: 'templateMarketC',
      component: resolve => require(['@/views/templateMarketC'], resolve),
      redirect: '/templateMarketC/myTemp',
      children: [
        {
          path: 'myTemp',
          name: 'myTemp',
          component: resolve => require(['@/components/templateMarketCenter/myTemp'], resolve)

        }, {
          path: 'tempM',
          name: 'tempM',
          component: resolve => require(['@/components/templateMarketCenter/tempM'], resolve)
        }, {
          path: 'tempDetail',
          name: 'tempDetail',
          component: resolve => require(['@/components/templateMarketCenter/tempDetail'], resolve)
        }
      ]
    },
    {
      path: '/openSettingC',
      name: 'openSettingC',
      component: resolve => require(['@/views/openSettingC'], resolve),
      redirect: '/openSettingC/openSetting',
      children: [
        {
          path: 'openSetting',
          name: 'openSetting',
          component: resolve => require(['@/components/openSettingManageCenter/openSetting'], resolve)
        },
        {
          path: 'miniProgramBind',
          name: 'miniProgramBind',
          component: resolve => require(['@/components/openSettingManageCenter/miniProgramBind'], resolve)

        },
        {
          path: 'storeInfoBind',
          name: 'storeInfoBind',

          component: resolve => require(['@/components/openSettingManageCenter/storeInfoBind'], resolve)


        },
        {
          path: 'accountSafe',
          name: 'accountSafe',

          component: resolve => require(['@/components/openSettingManageCenter/accountSafe'], resolve)


        },

      ]
    },

  ]
})
router.beforeEach((to, from, next) => {
  // if(to.name=='login'){
  //   next()
  // }
  // 路由拦截，当进入运营管理的时候，判断是否进行过门店选择，没有就跳转到operationManageC


  // if (new RegExp(/^\/\/\w*/).test(to.path) && store.state.operationMC.isSelectStoreVisible) {
  //   next({ path: '/' })
  // } else {
  //   next()
  // }
  // if (store.state.common.isLogin) {
  if (new RegExp(/^\/operationManageC\/\w*/).test(to.path) && store.state.operationMC.isSelectStoreVisible) {
    next({ path: '/operationManageC' })
  } else {
    next()
  }
  // } else {
  // next()
  // }

  // next()
})

// router.beforeResolve((to, from, next) => {
//   console.log('22')
//   if ( store.state.operationMC.isSelectStoreVisible) {
//     // if (new RegExp(/^\/operationManageC\/\w*/).test(to.path) ) {
//     next({ path: '/operationManageC' })
//   } else {
//     next()
//   }
// })
router.afterEach((to, from) => {
  if (new RegExp(/^\/operationManageC$/).test(to.path) && !store.state.operationMC.isSelectStoreVisible) {
    store.commit('CHANGESELECTSTOREDIALOG', true);
  }

})
export default router
