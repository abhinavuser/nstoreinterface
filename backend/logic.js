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

const filePath = path.join(__dirname, '../src/info/orders.json');

// Variable to store extracted data
let extractedData = null;

const extractData = async () => {
  try {
    const jsonData = await readJsonFile(filePath);
    const lastData = jsonData[jsonData.length - 1];

    extractedData = {
      id: lastData.id,
      customer: lastData.customer,
      address: lastData.store,
      contact: lastData.status,
      pickup: lastData.pickup,
      drop: lastData.drop,
      order: lastData.orderUrl,
      status: lastData.statusUrl
    };

    console.log('Extracted Data:', extractedData);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
};

// Mock function to simulate axios.post
const mockAxiosPost = (url, data) => {
  return new Promise((resolve) => {
    console.log(`Mock POST request to ${url} with data:`, data);

    // Simulate different responses based on the URL
    if (url.includes('location')) {
      resolve({
        data: {
          success: true,
          deliveryUrl: 'https://mock.delivery.url'
        }
      });
    } else if (url.includes('character')) {
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

// Delivery partners configuration
let deliveryPartners = [];

extractData().then(() => {
  if (extractedData) {
    deliveryPartners = [
      {
        name: 'Dunzo',
        endpoints: {
          quoteUrl: 100,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      },
      {
        name: 'Shadowfax',
        endpoints: {
          quoteUrl: 150,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      },
      {
        name: 'Addlogs',
        endpoints: {
          quoteUrl: 80,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      }
    ];

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

    // API endpoint to process order
    app.post('/place-order', async (req, res) => {
      const { id: orderId, pickup, drop } = extractedData;
      const customerData = extractedData;

      let bestQuote, deliveryUrl;

      try {
        while (true) {
          console.log('Sending requests to delivery partners for quotes...');
          const quotes = await getQuotes(pickup, drop);

          console.log('Waiting for 3 minutes...');
          await delay(3 * 60 * 1000); // Wait for 3 minutes (3 * 60 * 1000 ms)

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

    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  } else {
    console.error('Failed to extract data. Server not started.');
  }
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

const filePath = path.join(__dirname, '../src/info/orders.json');

// Variable to store extracted data
let extractedData = null;

const extractData = async () => {
  try {
    const jsonData = await readJsonFile(filePath);
    const lastData = jsonData[jsonData.length - 1];

    extractedData = {
      id: lastData.id,
      customer: lastData.customer,
      address: lastData.store,
      contact: lastData.status,
      pickup: lastData.pickup,
      drop: lastData.drop,
      order: lastData.orderUrl,
      status: lastData.statusUrl
    };

    console.log('Extracted Data:', extractedData);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
};

// Function to place an order with the selected delivery partner
async function placeOrder(orderUrl, customerData, orderId, pickupLocation, dropLocation) {
  console.log(`Placing order with orderUrl: ${orderUrl}`);
  const response = await axios.post(orderUrl, {
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
  const response = await axios.post(statusUrl, { orderId });
  console.log(`Status response: ${JSON.stringify(response.data)}`);
  return response.data;
}

// Delivery partners configuration
let deliveryPartners = [];

extractData().then(() => {
  if (extractedData) {
    deliveryPartners = [
      {
        name: 'Dunzo',
        endpoints: {
          quoteUrl: 100,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      },
      {
        name: 'Shadowfax',
        endpoints: {
          quoteUrl: 150,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      },
      {
        name: 'Addlogs',
        endpoints: {
          quoteUrl: 80,
          orderUrl: extractedData.order,
          statusUrl: extractedData.status
        }
      }
    ];

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

    // API endpoint to process order
    app.post('/place-order', async (req, res) => {
      const { id: orderId, pickup, drop } = extractedData;
      const customerData = extractedData;

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
              console.log('Order delivered successfully.');
              res.json({ message: 'Order delivered successfully', deliveryUrl });
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

    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  } else {
    console.error('Failed to extract data. Server not started.');
  }
});
*/

