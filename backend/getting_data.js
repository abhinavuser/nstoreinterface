const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // Port for the Express server

// Function to select specific data from the JSON response
let selectData = (data) => {
  let id = data.id;
  let customer = data.name;
  let amount = data.species;
  return {id, customer,amount};
};

// Endpoint to fetch, select, and save JSON data
app.get('/', async (req, res) => {
  try {
    // URL of the API to fetch data from
    const apiUrl = 'https://rickandmortyapi.com/api/character/1,183';

    // Fetch data from the API
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Select specific data
    const selectedData = { items: data.map(selectData) };

    // Path to the output JSON file
    const outputFilePath = 'D:/project nstore/-/src/info/orders.json';

    // Write the selected data to the output file
    fs.writeFile(outputFilePath, JSON.stringify(selectedData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write the data file' });
      }

      // Send a success response
      res.json({ message: 'Data fetched, selected, and saved successfully' });
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