<template>
  <div>
    <nav>
      <ul>
        <li v-for="(option, index) in navbarOptions" :key="index" class="nav-item">
          <a v-if="typeof option === 'string'" @click="handleOptionClick(option)" class="nav-link">{{ option }}</a>
          <div v-else class="dropdown">
            <button @click="toggleDropdown(option)" class="dropbtn">{{ option.title }}</button>
            <div v-show="option.open" class="dropdown-content">
              <a v-for="(subOption, subIndex) in option.subOptions" :key="subIndex" @click="handleOptionClick(subOption)" class="nav-link">{{ subOption }}</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
    <div v-if="selectedOption">
      <h1>{{ selectedOption }} Page</h1>
      <!-- Your order page content here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navbarOptions: [
        "Home",
        "About",
        { title: "Services", open: false, subOptions: ["Service 1", "Service 2", "Service 3"] },
        { title: "Order", open: false, subOptions: ["Order1", "Order2"] }
      ],
      selectedOption: null
    };
  },
  methods: {
    handleOptionClick(option) {
      this.selectedOption = option;
    },
    toggleDropdown(option) {
      option.open = !option.open;
    }
  }
};
</script>

<style scoped>
.nav-item {
  display: inline-block;
  margin-right: 10px;
}

.nav-link {
  color: #000;
  text-decoration: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
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
  padding: 12px 16px;
  color: black;
  text-decoration: none;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
