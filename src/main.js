// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/common/font.css'


import './assets/js/flexible'

import './utils/constants/network'

import 'babel-polyfill'
import Fastclick from 'fastclick'

import i18n from './utils/index'
import Element from 'element-ui'

import axios from 'axios'
import qs from 'qs'

import cal from './utils/calculation'
Vue.prototype.cal = cal

Vue.prototype.$axios = axios
Vue.prototype.qs = qs

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Fastclick.attach(document.body)

Vue.config.productionTip = false


Vue.prototype.getInfo = async (address) => {
  this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify({"address": address})).then(res => {
    let data = res.data.data
    console.log(data)
    console.log("返回信息结束")
    return data
  }).catch(error => {
    imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
    console.log(error);
  });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app')
