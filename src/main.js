
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import OrderPage from '@/views/OrderPage.vue'
import ViewOrderPage from '@/views/ViewOrderPage.vue' // Import ViewOrderPage

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: OrderPage },
    { path: '/order/:orderId', component: ViewOrderPage, name: 'ViewOrderPage' } // Add this route
  ]
})

createApp(App).use(router).mount('#app')
