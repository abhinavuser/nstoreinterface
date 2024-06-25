import Vue from 'vue';
import Router from 'vue-router';
import ViewOrderPage from '../components/ViewOrderPage.vue'; // Adjust the path as needed

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/view-order/:orderId',
      name: 'view-order',
      component: ViewOrderPage
    }
    // Other routes
  ]
});
