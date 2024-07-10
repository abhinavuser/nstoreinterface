<template>
  <div class="partner-page">
    <h2>{{ partnerTitle }}</h2>
    <div class="partner-details">
      <h3>Partner Details</h3>
      <div class="details-item">
        <label>Partner Name:</label>
        <span>{{ partnerDetails.name }}</span>
      </div>
      <div class="details-item">
        <label>Location:</label>
        <span>{{ partnerDetails.location }}</span>
      </div>
      <div class="details-item">
        <label>Amount:</label>
        <span>{{ partnerDetails.amount }}</span>
      </div>
      <button class="edit-button" @click="editMode = !editMode">Edit</button>
    </div>
    <div class="edit-form" v-if="editMode">
      <h3>Edit Partner Details</h3>
      <form @submit.prevent="savePartnerDetails">
        <div class="form-item">
          <label>Partner Name:</label>
          <input v-model="editPartnerDetails.name" />
        </div>
        <div class="form-item">
          <label>Location:</label>
          <input v-model="editPartnerDetails.location" />
        </div>
        <div class="form-item">
          <label>Amount:</label>
          <input v-model="editPartnerDetails.amount" />
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
      editPartnerDetails: { ...this.details },
    };
  },
  computed: {
    partnerDetails() {
      return this.details;
    },
    partnerTitle() {
      return this.details ? this.details.name : 'Partner Page';
    },
  },
  methods: {
    async savePartnerDetails() {
      this.editMode = false;
      this.$emit('update-details', this.editPartnerDetails);
    },
  },
};
</script>

<style scoped>
.partner-page {
  padding: 30px;
  margin: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.partner-details {
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

