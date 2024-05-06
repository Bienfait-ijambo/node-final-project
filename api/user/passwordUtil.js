const crypto = require('crypto');

// Function to generate a salt
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Function to hash a password
function hashPassword(password, salt) {
  const hash = crypto.createHash('sha256');
  hash.update(password + salt);
  const hashedPassword = hash.digest('hex');
  return hashedPassword;
}

function checkPassword(password, salt, hashedPassword) {
  const hashedAttempt = hashPassword(password, salt);
  return hashedAttempt === hashedPassword;
}

module.exports={
    generateSalt,hashPassword,checkPassword
}
