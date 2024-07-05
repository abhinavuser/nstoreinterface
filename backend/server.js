const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = '../src/info/data.json';

app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data file');
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.post('/update', (req, res) => {
  const updatedData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error writing data file');
      return;
    }
    res.send('Data updated successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
