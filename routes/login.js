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
  if (req.method === "POST" && req.url === "/api/v1/login") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        // Step 1: Validate email format
        if (!validateEmail(email)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Invalid email format" }));
        }

        // Step 2: Check if user exists in the database
        const selectQuery = "SELECT * FROM user WHERE email = ?";
        const [user] = await dbConnection.execute(selectQuery, [email]);

        if (!user || user.length === 0) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Invalid email or password" })
          );
        }

        const dbUser = user[0]; // Assuming user exists and is the first item
        const storedHashedPassword = dbUser.hashed_password;
        const salt = process.env.SALT_ROUNDS; // Assuming you’re using a static salt
        const hashedPassword = hashPassword(password, salt);

        // Step 3: Compare passwords
        if (hashedPassword !== storedHashedPassword) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Invalid email or password" })
          );
        }

        // Step 4: Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

        // Step 5: Send success response with token
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
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

module.exports = loginHandler;
