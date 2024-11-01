const http = require("http");
const connectDB = require("./db");

const signupHandler = require("./routes/signup");
const loginHandler = require("./routes/login");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const dbConnection = await connectDB();

    const requestHandler = (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === "POST" && req.url === "/api/v1/signup") {
        signupHandler(req, res, dbConnection);
      } else if (req.method === "POST" && req.url === "/api/v1/login") {
        loginHandler(req, res, dbConnection);
      } else {
        if (!res.writableEnded) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Route not found." }));
        }
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
