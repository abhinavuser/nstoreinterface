import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle incoming JSON files
app.post('/upload-json', upload.array('jsonFiles'), (req, res) => {
    const files = req.files;
    const processedDataArray = [];

    files.forEach((file, index) => {
        const filePath = file.path;

        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Parse the JSON data
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            return res.status(400).send(`Invalid JSON format in file ${file.originalname}`);
        }

        // Extract required fields
        const processedData = {
            name: jsonData.name,
            email: jsonData.email,
            age: jsonData.age,
            // Add more fields as needed
        };

        // Add to the array of processed data
        processedDataArray.push(processedData);

        // Optionally, delete the file after processing
        fs.unlink(filePath, (unlinkError) => {
            if (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        });

        // Check if it is the last file being processed
        if (index === files.length - 1) {
            // Send processed data back to the frontend
            res.json(processedDataArray);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});