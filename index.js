const http = require("http");
const connectDB = require("./db");
const axios = require("axios");

const signupHandler = require("./routes/signup");
const loginHandler = require("./routes/login");
const verifyTokenHandler = require("./routes/verifyToken");
const requestCountHandler = require("./routes/requestCount");
const getUsersHandler = require("./routes/getUsers");
const checkRoleHandler = require("./routes/checkRole");

const port = process.env.PORT || 3000;

// Replace with your actual AI service URL on Render
const aiServiceUrl = "https://isa-c4p-ai-service.onrender.com";

const startServer = async () => {
  try {
    console.log("Connecting to the database...");
    const dbConnection = await connectDB();
    console.log("Database connected successfully.");

    const requestHandler = async (req, res) => {
      console.log(`Incoming request: ${req.method} ${req.url}`);

      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      // Handle OPTIONS preflight request
      if (req.method === "OPTIONS") {
        console.log("Handling OPTIONS request");
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method === "POST" && req.url === "/api/v1/signup") {
        console.log("Handling signup request");
        signupHandler(req, res, dbConnection);
      } else if (req.method === "POST" && req.url === "/api/v1/login") {
        console.log("Handling login request with body:", parsedBody);
        loginHandler(req, res, dbConnection);
      } else if (req.method === "GET" && req.url === "/api/v1/verify-token") {
        console.log("Handling verify token request");
        verifyTokenHandler(req, res);
      } else if (
        (req.method === "GET" && req.url === "/api/v1/request-count") ||
        (req.method === "POST" && req.url === "/api/v1/increment-request-count")
      ) {
        console.log("Handling request count request");
        requestCountHandler(req, res, dbConnection);
      } else if (req.method === "GET" && req.url === "/api/v1/users") {
        console.log("Handling get users request");
        getUsersHandler(req, res, dbConnection);
      } else if (req.method === "GET" && req.url === "/api/v1/check-role") {
        console.log("Handling check role request");
        checkRoleHandler(req, res);
      } else if (
        req.method === "POST" &&
        req.url === "/api/v1/summarize-text"
      ) {
        console.log("Handling AI summarization request with body:", parsedBody);
        await handleAIRequest(req, res, parsedBody);
      } else {
        console.log("Route not found:", req.url);
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found." }));
      }
    };

    const server = http.createServer(requestHandler);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

const handleAIRequest = async (req, res, body) => {
  try {
    console.log("Processing AI request with text:", body.text);
    const aiResponse = await axios.post(`${aiServiceUrl}/process-text`, {
      text: body.text,
    });

    console.log("AI service responded with:", aiResponse.data);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ summary: aiResponse.data.summary }));
  } catch (error) {
    console.error(
      "Error calling AI service:",
      error.message,
      error.response ? error.response.data : error
    );
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to process the request" }));
  }
};

startServer();
