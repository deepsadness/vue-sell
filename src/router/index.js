import Vue from 'vue'
import Router from 'vue-router'
// import Header from '@/components/header/Header'
import goods from '@/components/goods/goods'
import rating from '@/components/rating/rating'
import seller from '@/components/seller/seller'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    }, {
      path: '/rating',
      name: 'rating',
      component: rating
    }, {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})
