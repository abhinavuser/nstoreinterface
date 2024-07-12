const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mock tracking details object
let trackingDetails = [
  { text: "Created", completed: true },
  { text: "Assigned", completed: Math.random() < 0.5 }, // Random true or false for Assigned initially
  { text: "Arrived at pickup", completed: false },
  { text: "Picked up", completed: false },
  { text: "Arrived", completed: false },
  { text: "Delivered", completed: false }
];

// Endpoint to receive webhook updates
app.post('/webhook', (req, res) => {
  const webhookData = req.body; // Assuming the webhook sends JSON data

  // Update your trackingDetails based on webhookData
  // Example: updating 'Picked up' status
  if (webhookData.event === 'picked_up') {
    trackingDetails.find(detail => detail.text === 'Picked up').completed = true;
  }

  // Respond with a success message
  res.status(200).send('Webhook received successfully');
});

// Endpoint to mock API for generating random statuses
app.get('/mockStatus', (req, res) => {
  // Update Assigned status randomly
  trackingDetails[1].completed = Math.random() < 1;

  // Update statuses based on Assigned value
  if (trackingDetails[1].completed) {
    // If Assigned is true, update Arrived at pickup, Picked up, Arrived, Delivered randomly
    trackingDetails[2].completed = Math.random() < 0.9;

    if (trackingDetails[2].completed){
      trackingDetails[3].completed = Math.random() < 0.8

      if (trackingDetails[3].completed){
        trackingDetails[4].completed = Math.random() < 0.8;

        if (trackingDetails[4].completed){
          trackingDetails[5].completed = Math.random() < 0.9;
        }else{
          trackingDetails[5].completed = false;
        }


      }else{
        trackingDetails[4].completed = false;
        trackingDetails[5].completed = false;

      }

    }else{
      trackingDetails[3].completed = false;
      trackingDetails[4].completed = false;
      trackingDetails[5].completed = false;
    }

  } else {
    // If Assigned is false, set all statuses below Assigned to false
    trackingDetails[2].completed = false;
    trackingDetails[3].completed = false;
    trackingDetails[4].completed = false;
    trackingDetails[5].completed = false;
  }

  res.json(trackingDetails);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
