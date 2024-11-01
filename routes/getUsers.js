const jwt = require("jsonwebtoken");

const getUsersHandler = async (req, res, dbConnection) => {
  if (req.method === "GET" && req.url === "/api/v1/users") {
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
      // Decode the token to check the user's role
      const decoded = jwt.verify(token, jwtSecret);

      // Ensure the user is an admin
      if (decoded.role !== "admin") {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Access denied" }));
      }

      // Query the database for all users
      const [users] = await dbConnection.execute(
        "SELECT user_id, email, request_count FROM user"
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } catch (error) {
      console.error("Error retrieving users:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Error retrieving users",
          error: error.message,
        })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

module.exports = getUsersHandler;
