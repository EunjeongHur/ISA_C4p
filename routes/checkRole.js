const jwt = require("jsonwebtoken");

const checkRoleHandler = (req, res) => {
  if (req.method === "GET" && req.url === "/api/v1/check-role") {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Authorization token missing" })
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

    try {
      // Decode the token to get user information
      const decoded = jwt.verify(token, jwtSecret);

      // Check if the user has the "admin" role
      if (decoded.role === "admin") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ role: "admin" }));
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Access denied" }));
      }
    } catch (error) {
      console.error("Role check error:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Error checking role", error: error.message })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

module.exports = checkRoleHandler;
