import Vue from 'vue'
import VueRouter from 'vue-router'
import OrderPage from '@/views/OrderPage.vue'
import ViewOrderPage from '@/views/ViewOrderPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'order-page',
    component: OrderPage
  },
  {
    path: '/order/:id',
    name: 'view-order',
    component: ViewOrderPage,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
