const express = require('express');
const axios = require('axios');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 8000;

// Connect to SQLite database
const db = new sqlite3.Database("../src/info/data.sqlite", (err) => {
  if (err) {
    console.error('Error connecting to database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Orders_details (
  id INTEGER PRIMARY KEY UNIQUE,
  customer_name TEXT,
  store TEXT,
  amount TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created successfully.');
  }
});

// Function to select specific data from the JSON response
let selectData = (data) => {
  let id = data.id;
  let customer = data.name; // Ensure 'name' matches the API response field
  let store = data.gender; // Ensure 'gender' matches the API response field
  let amount = data.species; // Ensure 'species' matches the API response field
  let status = data.type; // Ensure 'type' matches the API response field
  return { id, customer, store, amount, status };
};

// Endpoint to fetch, select, and save JSON data
app.get('/', async (req, res) => {
  try {
    // URL of the API to fetch data from
    const apiUrl = 'https://rickandmortyapi.com/api/character/800,801';

    // Fetch data from the API
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Map and select specific data
    const selectedData = data.map(item => selectData(item));

    // Insert data into SQLite database
    selectedData.forEach((data) => {
      db.run(`INSERT INTO Orders_details (id, customer_name, store, amount, status) VALUES (?, ?, ?, ?, ?)`,
        [data.id, data.customer, data.store, data.amount, data.status],
        function(err) {
          if (err) {
            console.error('Error inserting data:', err.message);
          } else {
            console.log('Data inserted successfully');
          }
        });
    });

    // Accessing the inserted data (for debugging)
    db.all(`SELECT * FROM Orders_details`, (err, rows) => {
      if (err) {
        console.error('Error querying data:', err.message);
      } else {
        rows.forEach(row => {
          console.log(row.id, row.customer_name, row.store, row.amount, row.status);
        });
      }
    });

    // Path to the output JSON file
    const outputFilePath = "../src/info/orders.json";

    // Read the existing data from the JSON file
    fs.readFile(outputFilePath, 'utf8', (err, fileData) => {
      let jsonData = {}; // Initialize jsonData as an empty array

      if (err) {
        if (err.code !== 'ENOENT') {
          console.error('Error reading the file:', err.message);
          res.status(500).json({ error: 'Failed to read the data file' });
          return;
        }
      } else {
        try {
          // Parse the existing data to a JavaScript array if the file exists
          jsonData = JSON.parse(fileData);
        } catch (parseErr) {
          console.error('Error parsing JSON data:', parseErr.message);
          res.status(500).json({ error: 'Failed to parse the data file' });
          return;
        }
      }

      // Append the new data to the array
      jsonData = jsonData.concat(selectedData);

      // Convert the updated object back to a JSON string
      const updatedData = JSON.stringify(jsonData, null, 2);

      // Write the updated JSON string back to the file
      fs.writeFile(outputFilePath, updatedData, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing the file:', writeErr.message);
          res.status(500).json({ error: 'Failed to write the data file' });
          return;
        }
        console.log('Data appended successfully:', selectedData);
        res.json({ message: 'Data fetched, selected, and appended successfully' });
      });
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'Failed to fetch or process data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
//hii