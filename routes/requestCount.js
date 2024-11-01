const jwt = require("jsonwebtoken");

const requestCountHandler = async (req, res, dbConnection) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Authorization token missing" }));
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

  try {
    // Decode the token to get user information
    const decoded = jwt.verify(token, jwtSecret);
    const email = decoded.email;

    if (req.method === "GET" && req.url === "/api/v1/request-count") {
      // Handle GET request to check request count
      const [user] = await dbConnection.execute(
        "SELECT request_count FROM user WHERE email = ?",
        [email]
      );

      if (!user || user.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "User not found" }));
      }

      const requestCount = user[0].request_count;

      // Respond with the request count
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ requestCount }));
    } else if (
      req.method === "POST" &&
      req.url === "/api/v1/increment-request-count"
    ) {
      // Handle POST request to increment request count
      const updateQuery =
        "UPDATE user SET request_count = request_count + 1 WHERE email = ?";
      await dbConnection.execute(updateQuery, [email]);

      // Respond with a success message
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Request count incremented successfully" })
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  } catch (error) {
    console.error("Request count error:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error handling request count",
        error: error.message,
      })
    );
  }
};

module.exports = requestCountHandler;
