//THIS SHOULD RUN ONLY IN 3000 PORT 
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:8080', // Allow requests from localhost:8080
}));
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, '../src/info/data.json');

app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      res.status(500).send({ message: 'Error reading data.json', error: err });
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseError) {
        console.error('Error parsing data.json:', parseError);
        res.status(500).send({ message: 'Error parsing data.json', error: parseError });
      }
    }
  });
});

app.post('/update', (req, res) => {
  const updatedData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to data.json:', err);
      res.status(500).send({ message: 'Error writing to data.json', error: err });
    } else {
      res.send({ message: 'Data updated successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
