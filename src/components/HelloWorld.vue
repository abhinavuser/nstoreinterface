<template>
  <div>
    <nav>
      <ul>
        <li v-for="(option, index) in navbarOptions" :key="index" class="nav-item">
          <a v-if="typeof option === 'string'" @click="selectOption(option)" class="nav-link">{{ option }}</a>
          <div v-else class="dropdown">
            <button @click="toggleDropdown(option)" class="dropbtn">{{ option.title }}</button>
            <div v-show="option.open" class="dropdown-content">
              <form @submit.prevent="option.title === 'Service' ? addService(option) : addPartner(option)">
                <input v-model="newEntry" :placeholder="'Enter new ' + option.title.toLowerCase()" />
                <button type="submit">{{ option.title === 'Service' ? 'Add Service' : 'Add Partner' }}</button>
              </form>
              <a v-for="(subOption, subIndex) in option.subOptions" :key="subIndex" @click="selectDropdownOption(subOption)" class="nav-link">
                {{ subOption }}
                <button @click.stop="option.title === 'Service' ? deleteService(subIndex) : deletePartner(subIndex)" class="delete-btn">
                  {{ option.title === 'Service' ? 'Delete Service' : 'Delete Partner' }}
                </button>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
    <div v-if="selectedOption">
      <h1>{{ selectedOption }} Page</h1>
      <component :is="getComponentForOption(selectedOption)"></component>
    </div>
  </div>
</template>

<script>
import OrderPage from '@/views/OrderPage.vue';
import Service1Page from '@/views/Service1Page.vue';
import Service2Page from '@/views/Service2Page.vue';
import Service3Page from '@/views/Service3Page.vue';
import Partner1Page from '@/views/Partner1Page.vue';
import Partner2Page from '@/views/Partner2Page.vue';
import Partner3Page from '@/views/Partner3Page.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue';

export default {
  components: {
    OrderPage,
    ViewOrderPage,
    Service1Page,
    Service2Page,
    Service3Page,
    Partner1Page,
    Partner2Page,
    Partner3Page,
  },
  data() {
    return {
      newEntry: '',
      navbarOptions: [
        "Home",
        "Order",
        { title: "Service", open: false, subOptions: ["Service 1", "Service 2", "Service 3"] },
        { title: "Partners", open: false, subOptions: ["Partner 1", "Partner 2", "Partner 3"] }
      ],
      selectedOption: null,
    };
  },
  created() {
    this.loadEntries();
  },
  methods: {
    loadEntries() {
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        const serviceDropdown = this.navbarOptions.find(option => option.title === 'Service');
        if (serviceDropdown) {
          serviceDropdown.subOptions = JSON.parse(savedServices);
        }
      }

      const savedPartners = localStorage.getItem('partners');
      if (savedPartners) {
        const partnerDropdown = this.navbarOptions.find(option => option.title === 'Partners');
        if (partnerDropdown) {
          partnerDropdown.subOptions = JSON.parse(savedPartners);
        }
      }
    },
    saveEntries() {
      const serviceDropdown = this.navbarOptions.find(option => option.title === 'Service');
      if (serviceDropdown) {
        localStorage.setItem('services', JSON.stringify(serviceDropdown.subOptions));
      }

      const partnerDropdown = this.navbarOptions.find(option => option.title === 'Partners');
      if (partnerDropdown) {
        localStorage.setItem('partners', JSON.stringify(partnerDropdown.subOptions));
      }
    },
    selectOption(option) {
      this.selectedOption = option;
      this.closeAllDropdowns();
    },
    toggleDropdown(option) {
      // Close all other dropdowns
      this.closeAllDropdowns();
      // Toggle the clicked dropdown
      option.open = !option.open;
      // If the dropdown is open, add an event listener to close it when clicking outside
      if (option.open) {
        const closeDropdown = (event) => {
          if (!event.target.closest('.dropdown')) {
            option.open = false;
            document.removeEventListener('click', closeDropdown);
          }
        };
        document.addEventListener('click', closeDropdown);
      }
    },
    selectDropdownOption(subOption) {
      this.selectedOption = subOption;
      this.closeAllDropdowns();
    },
    closeAllDropdowns() {
      this.navbarOptions.forEach(option => {
        if (typeof option === 'object') {
          option.open = false;
        }
      });
    },
    getComponentForOption(option) {
      switch (option) {
        case "Order":
          return "OrderPage";
        case "View Order":
          return "ViewOrderPage";
        case "Service 1":
          return "Service1Page";
        case "Service 2":
          return "Service2Page";
        case "Service 3":
          return "Service3Page";
        case "Partner 1":
          return "Partner1Page";
        case "Partner 2":
          return "Partner2Page";
        case "Partner 3":
          return "Partner3Page";
        default:
          return null;
      }
    },
    addService(option) {
      if (this.newEntry.trim() !== '') {
        option.subOptions.push(this.newEntry.trim());
        this.saveEntries();
        this.newEntry = '';
      }
    },
    deleteService(subIndex) {
      const serviceDropdown = this.navbarOptions.find(option => option.title === 'Service');
      if (serviceDropdown) {
        serviceDropdown.subOptions.splice(subIndex, 1);
        this.saveEntries();
      }
    },
    addPartner(option) {
      if (this.newEntry.trim() !== '') {
        option.subOptions.push(this.newEntry.trim());
        this.saveEntries();
        this.newEntry = '';
      }
    },
    deletePartner(subIndex) {
      const partnerDropdown = this.navbarOptions.find(option => option.title === 'Partners');
      if (partnerDropdown) {
        partnerDropdown.subOptions.splice(subIndex, 1);
        this.saveEntries();
      }
    },
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
  transition: background-color 0.3s ease, color 0.3s ease;
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
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  padding: 10px;
}

.dropdown-content .nav-link {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-content .nav-link:hover {
  background-color: #ddd;
  cursor: pointer;
}

.dropdown-content form {
  display: flex;
  margin-bottom: 10px;
}

.dropdown-content input {
  flex: 1;
  padding: 8px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dropdown-content button {
  padding: 8px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-content button:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.dropdown-content {
  display: none;
}

.dropdown .dropbtn:focus + .dropdown-content,
.dropdown-content:hover {
  display: block;
}
</style>
