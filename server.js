const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
fs.mkdir(folderPath, { recursive: true }).catch(console.error);

// Endpoint to create a text file
app.post('/create-file', async (req, res) => {
    try {
        const timestamp = new Date();
        const fileName = `${timestamp.toISOString().split('T')[0]}-${timestamp.toTimeString().split(' ')[0].replace(/:/g, '-')}.txt`;
        const filePath = path.join(folderPath, fileName);
        
        await fs.writeFile(filePath, timestamp.toISOString());
        
        res.status(201).json({ message: 'File created successfully', fileName });
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ error: 'Failed to create file' });
    }
});

// Endpoint to retrieve all text files
app.get('/get-files', async (req, res) => {
    try {
        const files = await fs.readdir(folderPath);
        const textFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');
        
        res.json({ files: textFiles });
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});