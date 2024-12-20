const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
};

const loginHandler = async (req, res, dbConnection) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    res.writeHead(204);
    res.end();
    return;
  }

  console.log("Inside login handler");
  console.log("Request Method:", req.method, "Request URL:", req.url);

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      console.log("Received body:", body);
      const { email, password } = JSON.parse(body);

      // Step 1: Validate email format
      if (!validateEmail(email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        console.log("Invalid email format:", email);
        return res.end(JSON.stringify({ message: "Invalid email format" }));
      }

      // Step 2: Check if user exists in the database and retrieve user_type
      const selectQuery = "SELECT * FROM user WHERE email = ?";
      console.log("Querying database with email:", email);
      const [user] = await dbConnection.execute(selectQuery, [email]);

      if (!user || user.length === 0) {
        res.writeHead(401, { "Content-Type": "application/json" });
        console.log("User not found or incorrect password for email:", email);
        return res.end(
          JSON.stringify({ message: "Invalid email or password" })
        );
      }

      const dbUser = user[0];
      const storedHashedPassword = dbUser.hashed_password;
      const userType = dbUser.user_type_id;
      const role = userType === 1 ? "admin" : "user";
      const salt = process.env.SALT_ROUNDS;
      const hashedPassword = hashPassword(password, salt);

      // Step 3: Compare passwords
      if (hashedPassword !== storedHashedPassword) {
        res.writeHead(401, { "Content-Type": "application/json" });
        console.log("Password mismatch for email:", email);
        return res.end(
          JSON.stringify({ message: "Invalid email or password" })
        );
      }

      // Step 4: Generate JWT token with role included
      const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
      const token = jwt.sign({ email, role }, jwtSecret, { expiresIn: "1h" });
      console.log("JWT token created:", token);

      // Step 5: Send success response with token
      console.log("Sending success response with token for email:", email);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Login successful", token }));
    } catch (error) {
      console.error("Login error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Error during login",
          error: error.message,
        })
      );
    }
  });
};

module.exports = loginHandler;
