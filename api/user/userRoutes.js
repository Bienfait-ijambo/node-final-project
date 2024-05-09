const fs = require("fs");
const path = require("path");
const express = require("express");
const userRoutes = express.Router();
var jwt = require("jsonwebtoken");
const { hashPassword, generateSalt, checkPassword } = require("./passwordUtil");
const {getSingleByEmail}=require('./singleUser')

function accessUserDBData() {
  const projectFolder = path.resolve(__dirname);
  const userDBPath = path.join(projectFolder, "/userDB.json");
  const data = fs.readFileSync(userDBPath, "utf8");
  return { data, userDBPath };
}

function generateToken(userId) {
  return new Promise((resolve, reject) => {
    const privateKey =
      "9e092ae63500405ea675102a92d7464d02c6e72f012469643b422db6e3c40cd";
    try {
      resolve( jwt.sign( { data: "foobar", }, privateKey, { expiresIn: "1h" } ) );
    } catch (error) {
      reject(error);
    }
  });
}

const {generateId,writeDataToDb}=require('../util/util')


userRoutes.post("/register", async function (req, res) {
  if (
    req.body?.name == "" ||
    req.body?.email == "" ||
    req.body?.password == ""
  ) {
    res.json({ message: ["Provide name, email and password"] }).status(422);
  }
  const salt = generateSalt();
  const { data, userDBPath } = accessUserDBData();
  const users = JSON.parse(data);
  const newData = [...users.data];

  
  const hashedPassword = hashPassword(req.body?.password, salt);

  const user = getSingleByEmail(users.data, req.body?.email);
  if(user.length > 0){
    res.status(201).send({ message: "This email address exist !" })
  }

  newData.push({
    id: generateId(),
    name: req.body?.name,
    email: req.body?.email,
    password: hashedPassword,
    salt: salt,
  });


  await writeDataToDb(userDBPath,newData);


  res.json({ message: "user successfully created !" }).status(200);
});

userRoutes.post("/login", async function (req, res) {

  if (req.body?.email == "" || req.body?.password == "") {
    res.json({ message: ["Provide  email and password"] }).status(422);
  }

  const { getSingleByEmail } = require("./singleUser");
  const { data, userDBPath } = accessUserDBData();

  const users = JSON.parse(data);
  const user = getSingleByEmail(users.data, req.body?.email);

  if (user.length === 0) {
    res.json({ message: "password or email invalid",isLogged: false, }).status(422);
  }

  const userData = user[0]; // Assuming getSingleByEmail returns an array with one user object

  const loginAttempt = req.body?.password;
  const isPasswordCorrect = checkPassword(
    loginAttempt,
    userData.salt,
    userData.password
  );

  if (isPasswordCorrect) {
    const token = await generateToken(userData?.id);
    res
      .json({
        user: {
          name: userData.name,
          email: userData.email,
        },
        token: token,
        message: "Logged in",
        isLogged: true,
      })
      .status(200);
  } else {
    res.json({ message: "Invalid email or password",isLogged: false, }).status(422);
  }
});

module.exports = userRoutes;
