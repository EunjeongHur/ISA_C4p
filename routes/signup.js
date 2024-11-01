const jwt = require("jsonwebtoken");

const signupHandler = async (req, res, dbConnection) => {
  if (req.method === "POST" && req.url === "/api/v1/signup") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        const insertQuery = "INSERT INTO user (email, hashed_password) VALUES (?, ?)";
        await dbConnection.execute(insertQuery, [email, password]);

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
