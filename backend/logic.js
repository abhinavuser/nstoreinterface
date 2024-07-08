const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
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

// Extract data before starting the server
extractData().then(() => {
  if (extractedData) {
    // Delivery partners configuration
    const deliveryPartners = [
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

    // Function to place an order with the selected delivery partner
    async function placeOrder(orderUrl, customerData, orderId, pickupLocation, dropLocation) {
      const response = await axios.post(orderUrl, {
        pickupLocation,
        dropLocation,
        customerData,
        orderId
      });
      return response.data;
    }

    // Function to check order status
    async function checkOrderStatus(statusUrl, orderId) {
      const response = await axios.post(statusUrl, { orderId });
      return response.data;
    }

    // API endpoint to process order
    app.post('/place-order', async (req, res) => {
      const { orderId } = extractedData.id;
      const pickupLocation = extractedData.pickup;
      const dropLocation = extractedData.drop;
      const customerData = extractedData;

      let bestQuote, deliveryUrl;

      try {
        while (true) {
          console.log('Sending requests to delivery partners for quotes...');
          const quotes = await getQuotes(pickupLocation, dropLocation);

          console.log('Waiting for 3 minutes...');
          await delay(3 * 1000); // Wait for 3 minutes

          console.log('Checking quotes...');
          bestQuote = quotes.reduce((prev, current) => (prev.quote < current.quote ? prev : current));

          console.log(`Best quote from: ${bestQuote.partner} - $${bestQuote.quote}`);

          console.log('Placing order with the best quote...');
          const orderResponse = await placeOrder(bestQuote.orderUrl, customerData, orderId, pickupLocation, dropLocation);

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