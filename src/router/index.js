import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/pages/home')
const Withdraw = () => import('@/pages/withdraw/withdraw')
const UpdateWithdraw = () => import('@/pages/update-withdraw/update-withdraw')

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      // meta: {
      //   title: ''
      // },
      //redirect: 'city',
      // children: [
      //   {
      //     path: '/city',
      //     name: 'city',
      //     component: City,
      //     meta: {
      //       title: '城市选择'
      //     }
      //   }
      // ]
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: Withdraw,
      // meta: {
      //   title: ''
      // },
    },
    {
      path: '/updateWithdraw',
      name: 'updateWithdraw',
      component: UpdateWithdraw,
      // meta: {
      //   title: ''
      // },
    }
  ],
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition || typeof savedPosition == 'undefined') {
      if (savedPosition) {
        return savedPosition;
      }
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router