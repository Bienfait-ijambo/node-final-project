const fs = require("fs");
var jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');

const privateKey ="9e092ae63500405ea675102a92d7464d02c6e72f012469643b422db6e3c40cd";


function generateId() {
  const now = new Date();
  const timestamp = now.getTime().toString(); // Get current timestamp as string
  const id = timestamp.substr(-6); // Get last 6 characters of timestamp
  return parseInt(id);
}

function writeDataToDb(postDBPath, newData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      postDBPath,
      JSON.stringify({ data: newData }),
      "utf8",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Data has been written to file successfully.");
        }
      }
    );
  });
}

async function VerifyExpressToken(req, res, next) {
  try {
    const token = req.headers?.authorization;
    const accessToken = token.split(" ")[1];
    
    jwt.verify(accessToken, privateKey, (error, payload) => {
      
      if (error) {
        res.status(401).send({status:401, message: "Unauthorize" });
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(401).send({ message: "Unauthorize",status:401, });
  }
}

function generateToken(userId) {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        jwt.sign(
          {
            sub: userId,
            aud: userId, ///represent a specific audience that will consume the token
            exp: Math.floor(Date.now() / 1000) + 60 * 60 + 60 * 60, // Expiration time: current time + 1 hour
            iat: Math.floor(Date.now() / 1000), // Issued at: current time
          },
          privateKey,
        
        )
      );
    } catch (error) {
      reject(error);
    }
  });
}





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



module.exports = { generateId,upload, writeDataToDb,VerifyExpressToken,generateToken };
