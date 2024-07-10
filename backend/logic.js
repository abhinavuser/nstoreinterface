/*For Mock API testing*/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Function to read JSON file
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
};

const ordersFilePath = path.join(__dirname, '../src/info/orders.json');
const dataFilePath = path.join(__dirname, '../src/info/data.json'); // Path to data.json
const trackFilePath = path.join(__dirname, '../src/info/track.json'); // Path to track.json

// Variable to store extracted data
let extractedData = null;

// Variable to store delivery partners from data.json
let dataJsonDeliveryPartners = [];

// Array to store order IDs from orders.json
let orderIDs = [];

// Function to extract data from orders.json and update orderIDs
const extractData = async () => {
  try {
    const jsonData = await readJsonFile(ordersFilePath);
    orderIDs = jsonData.map(order => order.id); // Update orderIDs with all order IDs
    const lastData = jsonData[jsonData.length - 1];

    extractedData = {
      id: lastData.id,
      customer: lastData.customer,
      store: lastData.store,
      amount: lastData.amount,
      status: lastData.status,
      orderUrl: lastData.orderUrl,
      quoteUrl: '', // Placeholder for quoteUrl, update if available
      statusUrl: lastData.statusUrl,
      pickup: lastData.pickup,
      drop: lastData.drop
    };

    console.log('Extracted Data:', extractedData);
    console.log('Updated Order IDs:', orderIDs);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
};

// Function to read delivery partners from data.json
const extractDataJsonDeliveryPartners = async () => {
  try {
    const data = await readJsonFile(dataFilePath);
    dataJsonDeliveryPartners = data.partners.map(partner => partner.name);
    console.log('Delivery Partners from data.json:', dataJsonDeliveryPartners);
  } catch (error) {
    console.error('Error reading or parsing data.json file:', error);
  }
};

// Function to watch for changes in orders.json
const watchOrdersJsonChanges = () => {
  fs.watch(ordersFilePath, (event, filename) => {
    if (filename) {
      console.log(`Changes detected in ${filename}. Reloading order IDs...`);
      extractData(); // Update orderIDs and extractedData
    }
  });
};

// Mock function to simulate axios.post
const mockAxiosPost = (url, data) => {
  return new Promise((resolve) => {
    console.log(`Mock POST request to ${url} with data:`, data);

    // Simulate different responses based on the URL
    if (url.includes('order')) {
      resolve({
        data: {
          success: true,
          deliveryUrl: 'https://mock.delivery.url',
          orderId: orderIDs[orderIDs.length - 1] // Use the latest order ID
        }
      });
    } else if (url.includes('status')) {
      resolve({
        data: {
          status: 'delivered'
        }
      });
    } else {
      resolve({
        data: {}
      });
    }
  });
};

// Use the mock function instead of axios.post for testing
const postRequest = mockAxiosPost;

// Function to place an order with the selected delivery partner
async function placeOrder(orderUrl, customerData, orderId, pickupLocation, dropLocation) {
  console.log(`Placing order with orderUrl: ${orderUrl}`);
  const response = await postRequest(orderUrl, {
    pickupLocation,
    dropLocation,
    customerData,
    orderId
  });
  console.log(`Order response: ${JSON.stringify(response.data)}`);
  return response.data;
}

// Function to check order status
async function checkOrderStatus(statusUrl, orderId) {
  console.log(`Checking order status with statusUrl: ${statusUrl}`);
  const response = await postRequest(statusUrl, { orderId });
  console.log(`Status response: ${JSON.stringify(response.data)}`);
  return response.data;
}

// Function to append order ID and delivery URL to track.json
const appendToTrack = async (orderId, deliveryUrl) => {
  try {
    let trackData = [];
    if (fs.existsSync(trackFilePath)) {
      const trackJson = await readJsonFile(trackFilePath);
      trackData = trackJson;
    }

    // Randomize the 'completed' parameter for "Arrived at pickup"
    const arrivedAtPickupCompleted = Math.random() < 0.5; // 50% chance of being true or false

    trackData.push({ orderId, "trackingDetails": [
      {
        "text": "Created",
        "completed": true
      },
      {
        "text": "Assigned",
        "completed": true
      },
      {
        "text": "Arrived at pickup",
        "completed": arrivedAtPickupCompleted  // Randomized true or false
      },
      {
        "text": "Picked up",
        "completed": false
      },
      {
        "text": "Arrived",
        "completed": false
      },
      {
        "text": "Delivered",
        "completed": false
      }
    ], orderUrl: deliveryUrl });
    fs.writeFileSync(trackFilePath, JSON.stringify(trackData, null, 2));
    console.log('Appended to track.json:', { orderId, orderUrl: deliveryUrl });
  } catch (error) {
    console.error('Error appending to track.json:', error);
  }
};
// Delivery partners configuration
let deliveryPartners = [];

// Function to initialize the server
const initializeServer = async () => {
  await extractData();
  await extractDataJsonDeliveryPartners();
  watchOrdersJsonChanges(); // Start watching orders.json for changes

  if (extractedData && dataJsonDeliveryPartners.length > 0) {
    deliveryPartners = dataJsonDeliveryPartners.map(partnerName => ({
      name: partnerName,
      endpoints: {
        quoteUrl: Math.floor(Math.random() * 200), // Random quote for demonstration
        orderUrl: extractedData.orderUrl,
        statusUrl: extractedData.statusUrl
      }
    }));

    // Utility function to delay execution
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to get quotes from all delivery partners
    async function getQuotes(pickupLocation, dropLocation) {
      const quotes = deliveryPartners.map(partner => ({
        partner: partner.name,
        quote: partner.endpoints.quoteUrl,
        orderUrl: partner.endpoints.orderUrl,
        statusUrl: partner.endpoints.statusUrl
      }));
      return quotes;
    }

    // Place order and check status automatically once
    try {
      console.log('Automatically placing order...');
      const { id: orderId, pickup, drop } = extractedData;
      const customerData = extractedData;

      // Get quotes
      console.log('Sending requests to delivery partners for quotes...');
      const quotes = await getQuotes(pickup, drop);

      // Select best quote
      const bestQuote = quotes.reduce((prev, current) => (prev.quote < current.quote ? prev : current));
      console.log(`Best quote from: ${bestQuote.partner} - $${bestQuote.quote}`);

      // Place order
      console.log('Placing order with the best quote...');
      const orderResponse = await placeOrder(bestQuote.orderUrl, customerData, orderId, pickup, drop);

      if (orderResponse.success) {
        const deliveryUrl = orderResponse.deliveryUrl;

        // Wait for 3 seconds
        await delay(3000);

        // Check order status
        console.log('Checking order status after 3 seconds...');
        const statusResponse = await checkOrderStatus(bestQuote.statusUrl, orderId);

        if (statusResponse.status === 'delivered') {
          console.log('Order request delivered to partner successfully.');
          await appendToTrack(orderId, deliveryUrl);
        } else {
          console.log('Order status unknown.');
        }
      } else {
        console.error('Failed to place order with the selected partner');
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  } else {
    console.error('Failed to extract data or delivery partners. Server not started.');
  }
};

initializeServer();

// API endpoint to process order
app.post('/place-order', async (req, res) => {
  res.status(404).json({ message: 'This endpoint is not accessible directly. Please use the /status endpoint.' });
});

// API endpoint to check order status
app.post('/status', async (req, res) => {
  res.status(404).json({ message: 'This endpoint is not accessible directly. Please use the /place-order endpoint.' });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});




/* For Real Time Api
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Function to read JSON file
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
};

const ordersFilePath = path.join(__dirname, '../src/info/orders.json');
const dataFilePath = path.join(__dirname, '../src/info/data.json');

// Variables to store extracted data
let extractedOrderData = null;
let deliveryPartners = [];

// Function to extract order data from orders.json
const extractOrderData = async () => {
  try {
    const jsonData = await readJsonFile(ordersFilePath);
    const lastData = jsonData[jsonData.length - 1];

    extractedOrderData = {
      id: lastData.id,
      customer: lastData.customer,
      address: lastData.store,
      contact: lastData.status,
      pickup: lastData.pickup,
      drop: lastData.drop,
      order: lastData.orderUrl,
      status: lastData.statusUrl
    };

    console.log('Extracted Order Data:', extractedOrderData);
  } catch (error) {
    console.error('Error reading or parsing orders.json file:', error);
  }
};

// Function to extract delivery partners from data.json
const extractDeliveryPartners = async () => {
  try {
    const data = await readJsonFile(dataFilePath);
    const partners = data.partners.map(partner => ({
      name: partner.name,
      endpoints: {
        quoteUrl: partner.quoteUrl,
        orderUrl: extractedOrderData ? extractedOrderData.order : null,
        statusUrl: extractedOrderData ? extractedOrderData.status : null
      }
    }));

    deliveryPartners = partners;
    console.log('Delivery Partners updated from data.json:', deliveryPartners);
  } catch (error) {
    console.error('Error reading or parsing data.json file:', error);
  }
};

// Function to place an order with the selected delivery partner
async function placeOrder(orderUrl, customerData, orderId, pickupLocation, dropLocation) {
  console.log(`Placing order with orderUrl: ${orderUrl}`);
  try {
    const response = await axios.post(orderUrl, {
      pickupLocation,
      dropLocation,
      customerData,
      orderId
    });
    console.log(`Order response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order');
  }
}

// Function to check order status
async function checkOrderStatus(statusUrl, orderId) {
  console.log(`Checking order status with statusUrl: ${statusUrl}`);
  try {
    const response = await axios.post(statusUrl, { orderId });
    console.log(`Status response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('Failed to check order status');
  }
}

// Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get quotes from all delivery partners
async function getQuotes(pickupLocation, dropLocation) {
  const quoteRequests = deliveryPartners.map(async partner => {
    try {
      const response = await axios.get(partner.endpoints.quoteUrl, {
        params: {
          pickupLocation,
          dropLocation
        }
      });
      return {
        partner: partner.name,
        quote: response.data.quote,
        orderUrl: partner.endpoints.orderUrl,
        statusUrl: partner.endpoints.statusUrl
      };
    } catch (error) {
      console.error(`Error getting quote from ${partner.name}:`, error);
      return null;
    }
  });

  const quotes = await Promise.all(quoteRequests);
  return quotes.filter(quote => quote !== null); // Remove failed requests
}

// API endpoint to process order
app.post('/place-order', async (req, res) => {
  const { id: orderId, pickup, drop } = extractedOrderData;
  const customerData = extractedOrderData;

  let bestQuote, deliveryUrl;

  try {
    while (true) {
      console.log('Sending requests to delivery partners for quotes...');
      const quotes = await getQuotes(pickup, drop);

      console.log('Waiting for 3 minutes...');
      await delay(3 * 60 * 1000); // Wait for 3 minutes

      console.log('Checking quotes...');
      bestQuote = quotes.reduce((prev, current) => (prev.quote < current.quote ? prev : current));

      console.log(`Best quote from: ${bestQuote.partner} - $${bestQuote.quote}`);

      console.log('Placing order with the best quote...');
      const orderResponse = await placeOrder(bestQuote.orderUrl, customerData, orderId, pickup, drop);

      if (orderResponse.success) {
        deliveryUrl = orderResponse.deliveryUrl;

        // Check order status
        let statusResponse = await checkOrderStatus(bestQuote.statusUrl, orderId);

        if (statusResponse.status === 'delivered') {
          console.log('Order request delivered to partner successfully.');
          res.json({ message: 'Order request delivered to partner successfully', deliveryUrl });
          break;
        } else if (statusResponse.status === 'cancelled') {
          console.log('Order cancelled by delivery partner, retrying...');
          continue;
        }
      } else {
        throw new Error('Failed to place order with the selected partner');
      }
    }
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// API endpoint to check order status
app.post('/status', async (req, res) => {
  const { orderId, partner } = req.body;

  if (!deliveryPartners.find(p => p.name.toLowerCase() === partner.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid delivery partner' });
  }

  try {
    const partnerData = deliveryPartners.find(p => p.name.toLowerCase() === partner.toLowerCase());
    const response = await checkOrderStatus(partnerData.endpoints.statusUrl, orderId);
    res.json({ message: 'Status fetched successfully', status: response });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status', error: error.message });
  }
});

// Function to watch for changes in orders.json and data.json
const watchFilesForChanges = () => {
  fs.watch(ordersFilePath, (event, filename) => {
    if (filename) {
      console.log(`Changes detected in ${filename}. Reloading order data...`);
      extractOrderData();
    }
  });

  fs.watch(dataFilePath, (event, filename) => {
    if (filename) {
      console.log(`Changes detected in ${filename}. Reloading delivery partners...`);
      extractDeliveryPartners();
    }
  });
};

// Function to initialize server and start watching files
const initializeServer = async () => {
  await extractOrderData();
  await extractDeliveryPartners();
  watchFilesForChanges(); // Start watching files for changes

  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
};

initializeServer();


*/

