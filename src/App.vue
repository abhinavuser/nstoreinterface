<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div v-if="showOrderPage">
      <OrderPage />
      <ViewOrderPage />
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import OrderPage from '@/views/OrderPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
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
