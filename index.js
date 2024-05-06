const fs = require('fs');
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const postRoutes=require('./api/post/postRoutes')
const userRoutes=require('./api/user/userRoutes')
var cors = require('cors')
app.use(cors())
// Use body-parser middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Use body-parser middleware to parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

app.use(postRoutes)
app.use(userRoutes)

app.get('/', function (req, res) {
  res.send("you're up !")
})


app.listen(3000,()=> console.log(`🚀 Server ready at http://localhost:3000/`))