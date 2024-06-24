<template>
  <div>
    <h2>Orders</h2>
    <ul class="order-list">
      <li v-for="(order, index) in orders" :key="index" class="order-item">
        <span class="order-info">Order ID: {{ order.id }} - Customer: {{ order.customer }} - Amount: {{  order.amount }}</span>
        <button @click="showOrderDetails(order.id)" class="view-order-btn">View Order</button>
      </li>
    </ul>
    <div v-if="showOrderDetailsPage" class="order-details">
      <!-- View order details page -->
      <h2>View Order Details</h2>
      <div>Order ID: {{ selectedOrderId }}</div>
      <!-- Display other order details here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showOrderDetailsPage: false,
      selectedOrderId: null,
      orders: [
        { id: 1, customer: "John Doe", amount: 120 },
        { id: 2, customer: "Jane Smith", amount: 150 }
        // Add more orders as needed
      ]
    };
  },
  methods: {
    showOrderDetails(orderId) {
      this.showOrderDetailsPage = true;
      this.selectedOrderId = orderId;
    }
  }
};
</script>

<style scoped>
.order-list {
  list-style: none;
  padding: 0;
}

.order-item {
  margin-bottom: 20px;
}

.order-info {
  font-weight: bold;
  margin-right: 10px;
}

.view-order-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.order-details {
  margin-top: 20px;
}

/* Additional styles for order details page can be added here */
</style>
