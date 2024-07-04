<template>
  <div class="partner-page">
    <h2>{{ partnerTitle }}</h2>
    <div class="partner-details">
      <h3>Partner Details</h3>
      <div class="details-item">
        <label>Partner Name:</label>
        <span>{{ partnerName }}</span>
      </div>
      <div class="details-item">
        <label>Location:</label>
        <span>{{ location }}</span>
      </div>
      <div class="details-item">
        <label>Amount:</label>
        <span>{{ amount }}</span>
      </div>
      <button class="edit-button" @click="editMode = true">Edit</button>
    </div>
    <div v-if="editMode" class="edit-details">
      <h3>Edit Details</h3>
      <div class="edit-item">
        <label for="partnerName">Partner Name:</label>
        <input type="text" id="partnerName" v-model="editedPartnerName">
      </div>
      <div class="edit-item">
        <label for="location">Location:</label>
        <input type="text" id="location" v-model="editedLocation">
      </div>
      <div class="edit-item">
        <label for="amount">Amount:</label>
        <input type="text" id="amount" v-model="editedAmount">
      </div>
      <div class="edit-buttons">
        <button class="save-button" @click="saveEdit">Save</button>
        <button class="cancel-button" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartnerPage',
  props: {
    index: Number,
    type: String,
  },
  data() {
    return {
      partnerTitle: `Partner ${this.index + 1}`,
      partnerName: 'Partner 1',
      location: 'Location 1',
      amount: 'Amount 1',
      editMode: false,
      editedPartnerName: 'Partner 1',
      editedLocation: 'Location 1',
      editedAmount: 'Amount 1',
    };
  },
  methods: {
    saveEdit() {
      // Save edited data to localStorage or backend
      localStorage.setItem(`partnerName${this.index + 1}`, this.editedPartnerName);
      localStorage.setItem(`location${this.index + 1}`, this.editedLocation);
      localStorage.setItem(`amount${this.index + 1}`, this.editedAmount);
      
      // Update current display data
      this.partnerName = this.editedPartnerName;
      this.location = this.editedLocation;
      this.amount = this.editedAmount;
      
      this.editMode = false; // Exit edit mode after saving
    },
    cancelEdit() {
      // Reset edited data to current display data
      this.editedPartnerName = this.partnerName;
      this.editedLocation = this.location;
      this.editedAmount = this.amount;
      
      this.editMode = false; // Exit edit mode
    }
  },
  created() {
    // Load data from localStorage or backend on component creation
    const storedPartnerName = localStorage.getItem(`partnerName${this.index + 1}`);
    const storedLocation = localStorage.getItem(`location${this.index + 1}`);
    const storedAmount = localStorage.getItem(`amount${this.index + 1}`);
    
    if (storedPartnerName) {
      this.partnerName = storedPartnerName;
      this.editedPartnerName = storedPartnerName;
    }
    if (storedLocation) {
      this.location = storedLocation;
      this.editedLocation = storedLocation;
    }
    if (storedAmount) {
      this.amount = storedAmount;
      this.editedAmount = storedAmount;
    }
  }
};
</script>

<style scoped>
.partner-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.partner-details {
  margin-bottom: 20px;
}

.partner-details h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.details-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.details-item label {
  font-weight: bold;
  margin-right: 10px;
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #0056b3;
}

.edit-details {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.edit-details h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.edit-item {
  margin-bottom: 10px;
}

.edit-item label {
  font-weight: bold;
  margin-right: 10px;
}

.edit-item input[type="text"] {
  padding: 10px;
  width: calc(100% - 20px);
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.edit-buttons {
  margin-top: 15px;
  text-align: right;
}

.save-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-button {
  background-color: #28a745;
  color: white;
  margin-right: 10px;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>
