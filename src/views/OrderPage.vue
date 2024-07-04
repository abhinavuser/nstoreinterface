<template>
  <div>
    <div v-if="!showOrderDetailsPage">
      <h2>Orders</h2>
      <table class="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.service }}</td>
            <td>{{ order.amount }}</td>
            <td>
              <button @click="showOrderDetails(order.id)" class="view-order-btn">View Order</button>
            </td>
          </tr>
        </tbody>
      </table>
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
.order-table {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.order-table thead {
  background-color: #3498db;
  color: white;
}

.order-table th,
.order-table td {
  padding: 15px 20px;
  text-align: left;
}

.order-table th {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
}

.order-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.order-table tbody tr:hover {
  background-color: #e9ecef;
}

.order-table td {
  border-bottom: 1px solid #dee2e6;
}

.view-order-btn {
  border: none;
  background-color: #28a745;
  color: white;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-order-btn:hover {
  background-color: #218838;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #343a40;
}
</style>
