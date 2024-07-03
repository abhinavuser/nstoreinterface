<template>
  <div id="app">
    <HomePage />
    <div v-if="showOrderPage">
      <OrderPage />
      <ViewOrderPage />
    </div>
  </div>
</template>

<script>
import HomePage from './components/HomePage.vue'
import OrderPage from '@/views/OrderPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue'; 

export default {
  name: 'App',
  components: {
    HomePage,
    OrderPage,
    ViewOrderPage 
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