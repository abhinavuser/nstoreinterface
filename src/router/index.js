import { createRouter, createWebHistory } from 'vue-router';
import OrderPage from '@/views/OrderPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue';

const routes = [
  { path: '/', redirect: '/order' },
  { path: '/order', component: OrderPage },
  { path: '/order/:orderId', component: ViewOrderPage, name: 'ViewOrderPage' } // Ensure the name property is set
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
