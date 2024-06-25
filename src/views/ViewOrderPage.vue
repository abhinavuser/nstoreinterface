<template>
  <div class="view-order-page">
    <h2>View Order</h2>
    <div class="order-container">
      <div v-if="selectedOrder" class="order-details">
        <p><strong>Order ID:</strong> {{ selectedOrder.id }}</p>
        <p><strong>Customer:</strong> {{ selectedOrder.customer }}</p>
        <p><strong>Amount:</strong> {{ selectedOrder.amount }}</p>
        <!-- Display additional order details here -->
      </div>
      <div class="tracking-details">
        <h3>Tracking Details</h3>
        <ul>
          <li v-for="(status, index) in trackingDetails" :key="index">
            <i :class="['fa', status.completed ? 'fa-check-circle' : 'fa-circle', 'status-icon']"></i>
            {{ status.text }}
          </li>
        </ul>
      </div>
    </div>
    <button @click="$emit('close')" class="close-btn">Close</button>
  </div>
</template>

<script>
import ordersData from '@/info/orders.json';

export default {
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      orders: [],
      selectedOrder: null,
      trackingDetails: [
        { text: 'Started towards pick up location', completed: true },
        { text: 'Reached pick up location', completed: false },
        { text: 'Picked up order', completed: false },
        { text: 'Started towards drop off', completed: false }
      ]
    };
  },
  created() {
    this.orders = ordersData;
    this.selectedOrder = this.orders.find(order => order.id === this.orderId);
  },
};
</script>

<style scoped>
.view-order-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-container {
  display: flex;
  justify-content: space-between;
}

.order-details, .tracking-details {
  flex: 1;
  margin: 0 10px;
}

.order-details p, .tracking-details ul {
  margin: 10px 0;
  font-size: 16px;
}

.tracking-details h3 {
  margin-bottom: 10px;
  text-align: center;
}

.tracking-details ul {
  list-style-type: none;
  padding: 0;
}

.tracking-details ul li {
  display: flex;
  align-items: center;
  background-color: #e9ecef;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}

.status-icon {
  margin-right: 10px;
}

.status-icon.fa-check-circle {
  color: green;
}

.status-icon.fa-circle {
  color: gray;
}

.close-btn {
  display: block;
  width: 100%;
  border: none;
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: #c82333;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
