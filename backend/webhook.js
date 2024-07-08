const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Load orders from orders.json
const ordersFilePath = path.join(__dirname, 'orders.json');
let orders = [];
let currentOrder = {};

if (fs.existsSync(ordersFilePath)) {
  const ordersData = fs.readFileSync(ordersFilePath);
  orders = JSON.parse(ordersData);

  if (orders.length > 0) {
    currentOrder = orders[orders.length - 1];
  }
}

// Save orders to orders.json
function saveOrders() {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

// Endpoint to handle webhook notifications
app.post('/webhook', (req, res) => {
  const { orderId, status } = req.body;

  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    console.log(`Webhook received for order ${orderId} with status ${status}`);
    saveOrders();
    res.status(200).json({ message: 'Webhook received successfully' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Endpoint to place a new order
app.post('/place-order', (req, res) => {
  const newOrder = {
    id: req.body.id, // assuming id is provided in the request body
    status: 'Processing',
    details: req.body.details
  };

  orders.push(newOrder);
  currentOrder = newOrder;
  saveOrders();

  // Simulate order status changes
  simulateOrderStatusChange(newOrder.id);

  res.json({ message: 'Order placed successfully', orderId: newOrder.id });
});

// Endpoint to get the status of an order
app.get('/order-status/:orderId', (req, res) => {
  const orderId = parseInt(req.params.orderId, 10);
  const order = orders.find(order => order.id === orderId);

  if (order) {
    res.json({ orderId: orderId, status: order.status });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Simulate order status changes
function simulateOrderStatusChange(orderId) {
  setTimeout(() => {
    notifyWebhook(orderId, 'Shipped');
  }, 120000); // 2 minutes

  setTimeout(() => {
    notifyWebhook(orderId, 'Delivered');
  }, 240000); // 4 minutes
}

// Notify webhook about order status change
function notifyWebhook(orderId, status) {
  axios.post('http://localhost:3000/webhook', {
    orderId: orderId,
    status: status
  }).then(response => {
    console.log(`Webhook notified for order ${orderId} with status ${status}`);
  }).catch(error => {
    console.error(`Error notifying webhook for order ${orderId}: ${error.message}`);
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
