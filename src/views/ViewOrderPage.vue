<template>
  <div class="view-order-page">
    <h2>View Order</h2>
    <div v-if="selectedOrder">
      <p>Order ID: {{ selectedOrder.id }}</p>
      <p>Customer: {{ selectedOrder.customer }}</p>
      <p>Amount: {{ selectedOrder.amount }}</p>
      <!-- Display additional order details here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOrder: null
    };
  },
  created() {
    const orderId = this.$route.params.orderId;
    // You should retrieve the order details based on the orderId from an API or Vuex store
    this.selectedOrder = this.orders.find(order => order.id === Number(orderId)); // Assuming orders are available here
  }
};
</script>

<style scoped>
.view-order-page {
  margin-top: 20px;
}

/* Additional styles for view order page can be added here */
</style>