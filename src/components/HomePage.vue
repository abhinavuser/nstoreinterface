<template>
  <div>
    <nav :class="[isDarkTheme ? 'navbar-dark' : 'navbar-light']">
      <ul>
        <a class="navbar-brand" href="#">nStore</a>
        <li v-for="(option, index) in navbarOptions" :key="index" class="nav-item">
          <a v-if="typeof option === 'string'" @click="selectOption(option)" :class="['nav-link', isDarkTheme ? 'text-light' : 'text-dark']">{{ option }}</a>
          <div v-else class="dropdown">
            <button @click="toggleDropdown(option)" :class="['dropbtn', isDarkTheme ? 'text-light' : 'text-dark']">{{ option.title }}</button>
            <div v-show="option.open" class="dropdown-content">
              <form @submit.prevent="option.title === 'Store' ? addStore() : addPartner()">
                <input v-model="newEntry" :placeholder="'Enter new ' + option.title.toLowerCase()" />
                <button type="submit">{{ option.title === 'Store' ? 'Add Store' : 'Add Logistics' }}</button>
              </form>
              <a v-for="(subOption, subIndex) in option.subOptions" :key="subIndex" @click="selectDropdownOption(subOption)" :class="['nav-link', isDarkTheme ? 'text-light' : 'text-dark']">
                {{ subOption.name }}
                <button @click.stop="option.title === 'Store' ? deleteStore(subIndex) : deletePartner(subIndex)" class="delete-btn">
                  {{ option.title === 'Store' ? 'Delete Store' : 'Delete Logistics' }}
                </button>
              </a>
            </div>
          </div>
        </li>
        <button @click="toggleTheme" class="theme-toggle-btn">Change Theme</button>
      </ul>
    </nav>
    <div v-if="selectedOption && selectedOption !== 'Home'">
      <h1>{{ selectedOption }} Page</h1>
      <component 
        :is="getComponentForOption(selectedOption)" 
        :details="selectedOptionDetails"
        @update-details="updateDetails"
      ></component>
    </div>
    <div v-else-if="selectedOption === 'Home'">
      <MainPage />
    </div>
  </div>
</template>

<script>
import OrderPage from '@/views/OrderPage.vue';
import ViewOrderPage from '@/views/ViewOrderPage.vue';
import MainPage from '@/views/MainPage.vue';
import StorePage from '@/views/StorePage.vue';
import PartnerPage from '@/views/PartnerPage.vue';

export default {
  components: {
    OrderPage,
    ViewOrderPage,
    StorePage,
    PartnerPage,
    MainPage,
  },
  data() {
    return {
      newEntry: '',
      stores: [],
      partners: [],
      navbarOptions: [
        "Home",
        "Order",
        { title: "Store", open: false, subOptions: [] },
        { title: "Logistics", open: false, subOptions: [] }
      ],
      selectedOption: null,
      selectedOptionDetails: null,
      isDarkTheme: true,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.selectedOptionDetails = null;
      this.closeAllDropdowns();
    },
    toggleDropdown(option) {
      this.closeAllDropdowns();
      option.open = !option.open;
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
      this.selectedOption = subOption.name;
      this.selectedOptionDetails = subOption;
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
      if (option === "Home") return "MainPage";
      if (option === "Order") return "OrderPage";
      if (this.stores.some(store => store.name === option)) return "StorePage";
      if (this.partners.some(partner => partner.name === option)) return "PartnerPage";
      return null;
    },
    async addStore() {
      if (this.newEntry.trim() !== '') {
        this.stores.push({ name: this.newEntry.trim(), hasDeliveryPartner: false });
        await this.saveEntries();
        this.updateNavbarOptions();
        this.newEntry = '';
      }
    },
    async deleteStore(subIndex) {
      this.stores.splice(subIndex, 1);
      await this.saveEntries();
      this.updateNavbarOptions();
    },
    async addPartner() {
      if (this.newEntry.trim() !== '') {
        this.partners.push({ name: this.newEntry.trim(), location: '', amount: '' });
        await this.saveEntries();
        this.updateNavbarOptions();
        this.newEntry = '';
      }
    },
    async deletePartner(subIndex) {
      this.partners.splice(subIndex, 1);
      await this.saveEntries();
      this.updateNavbarOptions();
    },
    async updateDetails(updatedDetails) {
    const storeIndex = this.stores.findIndex(store => store.name === this.selectedOption);
    const partnerIndex = this.partners.findIndex(partner => partner.name === this.selectedOption);

    if (storeIndex !== -1) {
      if (updatedDetails.name !== this.stores[storeIndex].name) {
        this.selectedOption = updatedDetails.name;
      }
      this.stores[storeIndex] = { ...updatedDetails };
    } else if (partnerIndex !== -1) {
      if (updatedDetails.name !== this.partners[partnerIndex].name) {
        this.selectedOption = updatedDetails.name;
      }
      this.partners[partnerIndex] = { ...updatedDetails };
    }

    await this.saveEntries();
    this.updateNavbarOptions();
    this.selectedOptionDetails = updatedDetails; 
  },
    async saveEntries() {
      try {
        const updatedData = {
          stores: this.stores,
          partners: this.partners,
        };
        const response = await fetch('http://localhost:3000/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
        if (response.ok) {
          console.log('Data updated successfully');
        } else {
          console.error('Failed to update data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    },
    async loadEntries() {
      try {
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        this.stores = data.stores || [];
        this.partners = data.partners || [];
        this.updateNavbarOptions();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    updateNavbarOptions() {
      const storeOption = this.navbarOptions.find(option => option.title === 'Store');
      if (storeOption) {
        storeOption.subOptions = this.stores;
      }

      const partnerOption = this.navbarOptions.find(option => option.title === 'Logistics');
      if (partnerOption) {
        partnerOption.subOptions = this.partners;
      }
    }
  },
  created() {
    this.loadEntries();
  },
};
</script>

<style scoped>
nav.navbar-dark {
  background-color: #333;
  padding: 10px 20px;
}

nav.navbar-light {
  background-color: #f8f9fa;
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

.nav-link.text-light {
  color: #fff;
}

.nav-link.text-dark {
  color: #000;
}

.nav-link {
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
  padding: 0.5rem 1rem;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
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
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: black;
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

.theme-toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 15px;
  margin-left: 25%;
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
}

.theme-toggle-btn:hover {
  background-color: #2980b9;
}

.navbar-brand {
  color: var(--link-active-color);
  font-weight: bold;
  background-image: linear-gradient(to top, lightblue 0%, #3498db 100%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  margin-right: 30%;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
}
</style>
