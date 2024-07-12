<template>
  <div class="store-page">
    <h2>{{ storeTitle }}</h2>
    <div class="store-details">
      <h3>Store Details</h3>
      <div class="details-item">
        <label>Store Name:</label>
        <span>{{ storeDetails.name }}</span>
      </div>
      <div class="details-item">
        <label>Has Delivery Partner:</label>
        <span>{{ storeDetails.hasDeliveryPartner ? 'Yes' : 'No' }}</span>
      </div>
      <button class="edit-button" @click="editMode = !editMode">Edit</button>
    </div>
    <div class="edit-form" v-if="editMode">
      <h3>Edit Store Details</h3>
      <form @submit.prevent="saveStoreDetails">
        <div class="form-item">
          <label>Store Name:</label>
          <input v-model="editStoreDetails.name" />
        </div>
        <div class="form-item">
          <label>Has Delivery Partner:</label>
          <input type="checkbox" v-model="editStoreDetails.hasDeliveryPartner" />
        </div>
        <button type="submit">Save</button>
        <button type="button" @click="editMode = false">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    details: Object,
  },
  data() {
    return {
      editMode: false,
      editStoreDetails: { ...this.details },
    };
  },
  watch: {
    details: {
      handler(newDetails) {
        this.editStoreDetails = { ...newDetails };
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    storeTitle() {
      return this.details ? this.details.name : 'Store Page';
    },
    storeDetails() {
      return this.details;
    },
  },
  methods: {
    async saveStoreDetails() {
      this.editMode = false;
      this.$emit('update-details', this.editStoreDetails);
    },
  },
};
</script>

<style scoped>
.store-page {
  padding: 30px;
  margin: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.store-details {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.details-item {
  margin-bottom: 15px;
}

.edit-form {
  margin-top: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item input[type="text"], .form-item input[type="checkbox"] {
  width: calc(100% - 10px); /* Adjusted width for input fields */
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-button, button {
  padding: 12px 20px;
  margin-right: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover, button:hover {
  background-color: #2980b9;
}

button[type="submit"] {
  background-color: #2ecc71;
}

button[type="submit"]:hover {
  background-color: darkgreen
}

button[type="button"] {
  background-color: #e74c3c;
}

button[type="button"]:hover {
  background-color: #c0392b;
}
</style>

