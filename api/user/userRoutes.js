const fs = require("fs");
const path = require("path");
const express = require("express");
const userRoutes = express.Router();
const { hashPassword, generateSalt, checkPassword } = require("./passwordUtil");

function accessUserDBData() {
  const projectFolder = path.resolve(__dirname);
  const userDBPath = path.join(projectFolder, "/userDB.json");
  const data = fs.readFileSync(userDBPath, "utf8");
  return { data, userDBPath };
}

userRoutes.post("/users", function (req, res) {
  if (
    req.body?.name == "" ||
    req.body?.email == "" ||
    req.body?.password == ""
  ) {
    res.json({ message: ["Provide name, email and password"] }).status(422);
  }

  const { data, userDBPath } = accessUserDBData();
  const posts = JSON.parse(data);
  const lastItem = posts.data.length;

  const newData = [...posts.data];

  const salt = generateSalt();
  const hashedPassword = hashPassword(req.body?.password, salt);

  newData.push({
    id: lastItem + 1,
    name: req.body?.name,
    email: req.body?.email,
    password: hashedPassword,
    salt:salt
  });

  fs.writeFile(userDBPath, JSON.stringify({ data: newData }), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data has been written to file successfully.");
    }
  });

  res.json({ message: "user successfully created !" }).status(200);
});

userRoutes.post("/login", function (req, res) {
  if (req.body?.email == "" || req.body?.password == "") {
    res.json({ message: ["Provide  email and password"] }).status(422);
  }

  const { getSingleByEmail } = require("./singleUser");
  const { data, userDBPath } = accessUserDBData();


  const users = JSON.parse(data);
  const user = getSingleByEmail(users.data, req.body?.email);

  if(user.length ===0){
    res.json({ message: "password or email invalid" }).status(422);
  }

  const userData = user[0]; // Assuming getSingleByEmail returns an array with one user object

  const loginAttempt = req.body?.password;
  const isPasswordCorrect = checkPassword(loginAttempt, userData.salt, userData.password);

  if (isPasswordCorrect) {
    res.json({ message: "Logged in", isLogged: true }).status(200);
  } else {
    res.json({ message: "Invalid email or password" }).status(422);
  }
});

module.exports = userRoutes;
