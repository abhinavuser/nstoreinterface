const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

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

  
// Define the path to the JSON file
const filePath = '../src/info/orders.json';

// Extract certain data from the JSON file and store it in a variable
const extractData = async () => {
    try {
      const jsonData = await readJsonFile(filePath);
  
      const lastData = jsonData[jsonData.length - 1];

      const extractedData = {
        name: lastData.customer,
        adress: lastData.service,
        contact:lastData.statusS
      };
    
      console.log('Extracted Data:', extractedData);
    }
    catch (error) {
        console.error('Error reading or parsing JSON file:', error);
    }
};

extractData();


/*const deliveryPartners = [
  {
    name: 'Partner1',
    endpoints: {
      quoteUrl: 'https://api.partner1.com/getQuote',
      orderUrl: 'https://api.partner1.com/placeOrder',
    }
  },
  {
    name: 'Partner2',
    endpoints: {
      quoteUrl: 'https://api.partner2.com/getQuote',
      orderUrl: 'https://api.partner2.com/placeOrder',
    }
  },
  {
    name: 'Partner3',
    endpoints: {
      quoteUrl: 'https://api.partner3.com/getQuote',
      orderUrl: 'https://api.partner3.com/placeOrder',
    }
  },
];


const pickupLocation = { lat: 40.712776, lng: -74.005974 };
const dropLocation = { lat: 34.052235, lng: -118.243683 };



async function getQuotes() {
  const quotePromises = deliveryPartners.map(partner =>
    axios.post(partner.endpoints.quoteUrl, { pickupLocation, dropLocation })
      .then(response => ({
        partner: partner.name,
        quote: response.data.quote,
        orderUrl: partner.endpoints.orderUrl,
      }))
  );

  const quotes = await Promise.all(quotePromises);
  return quotes;
}

async function placeOrder(orderUrl, customerData, orderId) {
  const response = await axios.post(orderUrl, { 
    pickupLocation, 
    dropLocation, 
    customerData, 
    orderId 
  });
  return response.data.deliveryUrl;
}

app.post('/place-order', async (req, res) => {
  const { orderId } = req.body;
  
  try {
    const quotes = await getQuotes();
    const bestQuote = quotes.reduce((prev, current) => (prev.quote < current.quote ? prev : current));

    console.log(`Best quote from: ${bestQuote.partner} - $${bestQuote.quote}`);

    const deliveryUrl = await placeOrder(bestQuote.orderUrl, customerData, orderId);
    
    res.json({ deliveryUrl });
  } catch (error) {
    console.error('Error getting quotes or placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
*/