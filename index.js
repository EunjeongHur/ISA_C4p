const http = require("http");
const connectDB = require("./db");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const dbConnection = await connectDB();

    const requestHandler = (req, res) => {
      if (req.method === "POST" && req.url === "/api/v1/signup") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("signup page");
      } else if (req.method === "POST" && req.url === "/api/v1/login") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("login page");
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found." }));
      }
    };

    const server = http.createServer(requestHandler);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
