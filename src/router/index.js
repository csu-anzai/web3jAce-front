import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/pages/index')
const Home = () => import('@/pages/home')
const Withdraw = () => import('@/pages/withdraw/withdraw')
const UpdateWithdraw = () => import('@/pages/update-withdraw/update-withdraw')

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: Withdraw,
    },
    {
      path: '/updateWithdraw',
      name: 'updateWithdraw',
      component: UpdateWithdraw,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
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