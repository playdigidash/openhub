const express = require('express');
const multer = require('multer');
const app = express();

// Set up multer to handle file uploads
const upload = multer({ dest: './uploads/' });

// Set up the triposr algorithm function
const callTriposrAlgorithm = (imageBuffer) => {
  // TO DO: implement the triposr algorithm here
  // For now, just return a dummy 3D object
  return Buffer.from('o 3D Object\nv 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3', 'utf8');
};

// Set up the /upload-image endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
  // req.file contains the uploaded image
  const imageBuffer = req.file.buffer;
  // Call the triposr algorithm with the image
  const triposrOutput = callTriposrAlgorithm(imageBuffer);
  // Return the 3D object as a downloadable file
  res.setHeader('Content-Disposition', 'attachment; filename="3d_object.obj"');
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(triposrOutput);
});

// Start the server
app.listen(4000, () => {
  console.log('Server listening on port 4000');
});







// ========================================================================================

// const express = require('express');
// const multer = require('multer');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const upload = multer({ dest: './uploads/' });

// app.post('/upload', (req, res) => {
//   if (req.body && req.body.text) {
//     res.json({ text: req.body.text });
//   } else if (req.file) {
//     const file = req.file;
//     const url = `http://localhost:3000/uploads/${file.filename}`;
//     res.json({ url });
//   }
//   else {
//     res.status(400).send({ message: 'Invalid request' });
//   }
// });

// app.get('/uploads/:filename', (req, res) => {
//   const filename = req.params.filename;
//   res.sendFile(`./uploads/${filename}`);
// });

// app.listen(4000, () => {
//   console.log('Server started on port 4000');
// });

// ================================================================================
// const express = require('express');
// const multer = require('multer');
// const app = express();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post('/image', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send({ message: 'No file uploaded.' });
//   }

//   res.send(`File uploaded successfully!`);
// });

// app.use('/uploads', express.static('uploads'));

// app.listen(5000, () => {
//   console.log('Server started on port 5000');
// });
