const crypto = require("crypto");

const hashPassword = (password) => {
  const salt = process.env.SALT_ROUNDS;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');
  return hash.toString('hex');
};

const verifyPassword = (inputPassword, storedHash) => {
  const hashedInputPassword = hashPassword(inputPassword);
  return hashedInputPassword === storedHash;
};

const signupHandler = async (req, res, dbConnection) => {
  if (req.method === "POST" && req.url === "/api/v1/login") {
    res.writeHead(201, { "Content-Type": "text/plain" });
    res.end("login page");
  }
};

module.exports = signupHandler;