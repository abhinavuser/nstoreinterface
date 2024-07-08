<template>
  <div class="view-order-page">
    <h2>Order Details</h2>
    <div class="order-container">
      <div v-if="selectedOrder" class="order-details">
        <p><strong>Order ID:</strong> {{ selectedOrder.id }}</p>
        <p><strong>Customer:</strong> {{ selectedOrder.customer }}</p>
        <p><strong>Amount:</strong> ₹{{ selectedOrder.amount }}</p>
        <p v-if="selectedOrder.phone"><strong>Phone Number:</strong> {{ selectedOrder.phone }}</p>
        <p v-if="orderUrl"><strong>Order URL:</strong> <a :href="orderUrl" target="_blank">{{ orderUrl }}</a></p>
        <!-- Display additional order details here -->
      </div>
      <div class="tracking-details">
        <h3>Tracking Details</h3>
        <ul>
          <li v-for="(status, index) in trackingDetails" :key="index" :class="{ completed: status.completed }">
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
import trackingData from '@/info/track.json'; // Import the tracking data

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
        { text: 'Created', completed: false },
        { text: 'Assigned', completed: false },
        { text: 'Arrived at pickup', completed: false },
        { text: 'Picked up', completed: false },
        { text: 'Arrived', completed: false },
        { text: 'Delivered', completed: false }
      ],
      orderUrl: '', // Initialize as an empty string
    };
  },
  created() {
    this.orders = ordersData;
    this.selectedOrder = this.orders.find(order => order.id === this.orderId);
    this.fetchTrackingDetails();
  },
  methods: {
    fetchTrackingDetails() {
      const trackingInfo = trackingData.find(track => track.orderId === this.orderId);
      if (trackingInfo) {
        this.trackingDetails = trackingInfo.trackingDetails;
        this.orderUrl = trackingInfo.orderUrl; // Fetch the order URL
      } else {
        this.trackingDetails = [
          { text: 'Created', completed: false },
          { text: 'Assigned', completed: false },
          { text: 'Arrived at pickup', completed: false },
          { text: 'Picked up', completed: false },
          { text: 'Arrived', completed: false },
          { text: 'Delivered', completed: false }
        ];
        this.orderUrl = ''; // Reset the order URL
      }
    }
  },
};
</script>

<style scoped>
.view-order-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Arial';
}

.order-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-details, .tracking-details {
  flex: 1;
  margin: 0 20px;
}

.order-details p, .tracking-details ul {
  margin: 10px 0;
  font-size: 16px;
}

.order-details p {
  line-height: 1.5;
}

.tracking-details h3 {
  margin-bottom: 10px;
  text-align: center;
  font-size: 18px;
  color: green
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
  transition: background-color 0.3s ease;
}

.tracking-details ul li.completed {
  background-color: #d4edda;
}

.status-icon {
  margin-right: 10px;
  font-size: 20px;
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
  font-size: 24px;
  color: #343a40;
}
</style>