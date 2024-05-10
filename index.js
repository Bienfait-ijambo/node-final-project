
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const postRoutes=require('./api/post/postRoutes')
const userRoutes=require('./api/user/userRoutes')
var cors = require('cors')
const multer = require('multer');
const path = require('path');

app.use(cors())
// Use body-parser middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());


// Use body-parser middleware to parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
// Error handling middleware
app.use((err, req, res, next) => {
  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
  });

  // Log the error
  console.error(err);
});

app.use('/api',postRoutes)
app.use('/api',userRoutes)



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination directory where files will be uploaded
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid naming conflicts
  }
});

// Initialize Multer with storage configuration
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  
  res.send('File uploaded successfully.');
});





app.listen(3000,()=> console.log(`🚀 Server ready at http://localhost:3000/`))