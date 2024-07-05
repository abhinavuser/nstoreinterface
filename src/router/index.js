import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import OrderPage from '@/views/OrderPage.vue';
import ServicePage from '@/views/StorePage.vue';
import PartnerPage from '@/views/PartnerPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue';

Vue.use(Router);

const routes = [
  { path: '/', component: HomePage },
  { path: '/order', component: OrderPage },
  { path: '/view-order', component: ViewOrderPage },
  { path: '/service/:name', component: ServicePage },
  { path: '/partner/:name', component: PartnerPage },
];

export default new Router({
  routes
});
