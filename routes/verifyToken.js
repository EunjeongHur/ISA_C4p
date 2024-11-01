const jwt = require("jsonwebtoken");

const verifyTokenHandler = (req, res) => {
  // Ensure the request is a GET to the `/api/v1/verify-token` endpoint
  if (req.method === "GET" && req.url === "/api/v1/verify-token") {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Authorization token missing" })
      );
    }

    const token = authHeader.split(" ")[1]; // Extract token part after "Bearer"
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key"; // Replace with your secret

    try {
      // Verify the token
      const decoded = jwt.verify(token, jwtSecret);

      // If token is valid, respond with user data or success
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Token is valid", user: decoded }));
    } catch (error) {
      console.error("Token verification failed:", error.message);

      // Send a 401 if token is invalid or expired
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid or expired token" }));
    }
  } else {
    // Respond with 404 if route or method does not match
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

module.exports = verifyTokenHandler;
