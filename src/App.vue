<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div v-if="showOrderPage">
      <OrderPage />
      <ViewOrderPage /> <!-- Include ViewOrderPage component here -->
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import OrderPage from '@/views/OrderPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue'; // Import ViewOrderPage

export default {
  name: 'App',
  components: {
    HelloWorld,
    OrderPage,
    ViewOrderPage // Include ViewOrderPage in components
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>