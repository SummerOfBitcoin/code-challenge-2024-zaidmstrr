const fs = require('fs').promises; // Use the promise-based versions of the fs functions
const path = require('path');
const serialization = require('./test_serialisation');
const mempoolDir = path.join(__dirname, 'mempool');

// Async function to process a single file
async function processFile(filePath, isLastFile) {
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const transaction = JSON.parse(fileContents);
        // Process the transaction data here
        serialization(transaction, isLastFile);
    } catch (err) {
        console.error("Error processing the file:", filePath, err);
    }
}

// Async function to list and process all files in the mempool directory in order
async function processAllFiles() {
    try {
        let files = await fs.readdir(mempoolDir);
        // Sort files alphabetically to ensure processing order
        files.sort();
        
        const totalFiles = files.length;
        for (let index = 0; index < totalFiles; index++) {
            const file = files[index];
            const filePath = path.join(mempoolDir, file);
            const isLastFile = (index === totalFiles - 1);  // Check if this is the last file
            await processFile(filePath, isLastFile);  // Process each file one at a time in order
        }
        
        console.log("All files have been processed.");
    } catch (err) {
        console.error("Error listing the files in directory:", err);
    }
}

// Execute the processing function
processAllFiles();
