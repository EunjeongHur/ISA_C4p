const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const hashPassword = (password) => {
  const salt = process.env.SALT_ROUNDS;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');
  return hash.toString('hex');
};

const signupHandler = async (req, res, dbConnection) => {
  if (req.method === "POST" && req.url === "/api/v1/signup") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!validateEmail(email)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid email" }));
          return;
        }

        const hashedPassword = hashPassword(password);

        const insertQuery = "INSERT INTO user (email, hashed_password) VALUES (?, ?)";
        await dbConnection.execute(insertQuery, [email, hashedPassword]);

        const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Signup successful", token }));
      } catch (error) {
        console.error("Signup error:", error);

        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error during signup", error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

module.exports = signupHandler;
