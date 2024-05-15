
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const postRoutes=require('./api/post/postRoutes')
const userRoutes=require('./api/user/userRoutes')
var cors = require('cors')
const path = require('path');

app.use(cors())
app.use(express.static('uploads'))
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







app.listen(3000,()=> console.log(`🚀 Server ready at http://localhost:3000/`))