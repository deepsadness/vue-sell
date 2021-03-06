import Vue from 'vue'
import App from './App'
import router from './router'

import './common/stylus/index.styl'
import axios from 'axios'

// 添加到原型链上
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
