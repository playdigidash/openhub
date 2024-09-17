const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();

// Set up multer for image uploads
const upload = multer({ dest: './uploads/' });

// Set up body parser for text input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a route for the frontend to send input data
app.post('/input', (req, res) => {
  // Check if the input type is image or text
  if (req.body.inputType === 'image') {
    // Handle image upload
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error uploading image' });
      } else {
        // Save the image to the uploads folder
        const imagePath = req.file.path;
        res.send({ message: 'Image uploaded successfully' });
      }
    });
  } else if (req.body.inputType === 'text') {
    // Handle text input
    const textInput = req.body.text;
    res.send({ message: `Received text input: ${textInput}` });
  } else {
    res.status(400).send({ message: 'Invalid input type' });
  }
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});