<template>
  <div>
    <div v-if="!showOrderDetailsPage">
      <h2>Orders</h2>
      <ul class="order-list">
        <li v-for="(order, index) in orders" :key="index" class="order-item">
          <span class="order-info">Order ID: {{ order.id }} - Customer: {{ order.customer }} - Amount: {{ order.amount }}</span>
          <button @click="showOrderDetails(order.id)" class="view-order-btn">View Order</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <ViewOrderPage :orderId="selectedOrderId" @close="showOrderDetailsPage = false" />
    </div>
  </div>
</template>

<script>
import ViewOrderPage from '@/views/ViewOrderPage.vue';
import ordersData from '@/info/orders.json';

export default {
  components: {
    ViewOrderPage,
  },
  data() {
    return {
      showOrderDetailsPage: false,
      selectedOrderId: null,
      orders: [],
    };
  },
  created() {
    this.orders = ordersData;
  },
  methods: {
    showOrderDetails(orderId) {
      this.selectedOrderId = orderId;
      this.showOrderDetailsPage = true;
    },
  },
};
</script>

<style scoped>
.order-list {
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-info {
  font-weight: bold;
}

.view-order-btn {
  border: none;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-order-btn:hover {
  background-color: #0056b3;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
