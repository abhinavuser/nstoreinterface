<template>
  <div>
    <nav>
      <ul>
        <li v-for="(option, index) in navbarOptions" :key="index" class="nav-item">
          <a v-if="typeof option === 'string'" @click="handleOptionClick(option)" class="nav-link">{{ option }}</a>
          <div v-else class="dropdown">
            <button @click="toggleDropdown(option)" class="dropbtn">{{ option.title }}</button>
            <div v-show="option.open" class="dropdown-content">
              <a v-for="(subOption, subIndex) in option.subOptions" :key="subIndex" @click="handleDropdownItemClick(option, subOption)" class="nav-link">{{ subOption }}</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
    <div v-if="selectedOption">
      <h1>{{ selectedOption }} Page</h1>
      <div v-if="selectedOption === 'Order'">
        <OrderPage />
      </div>
    </div>
  </div>
</template>

<script>
import OrderPage from '@/views/OrderPage.vue';

export default {
  components: {
    OrderPage
  },
  data() {
    return {
      navbarOptions: [
        "Home",
        "Order",
        { title: "Services", open: false, subOptions: ["Service 1", "Service 2", "Service 3"] },
        { title: "Partners", open: false, subOptions: ["Partner1", "Partner2", "Partner3"] }
      ],
      selectedOption: null,
    };
  },
  methods: {
    handleOptionClick(option) {
      this.selectedOption = option;
    },
    toggleDropdown(option) {
      option.open = !option.open;
      if (option.title === "Order") {
        this.selectedOption = "Order"; // Set selectedOption to "Order" when "Order" is clicked
      }
    },
    handleDropdownItemClick(option, subOption) {
      this.selectedOption = subOption;
      option.open = false; // Hide the dropdown after clicking a dropdown item
    }
  }
};
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 10px 20px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: inline-block;
  margin-right: 20px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 10px 15px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #555;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropbtn:hover {
  background-color: #2980b9;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  display: block;
  padding: 10px 15px;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>

