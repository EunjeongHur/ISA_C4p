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

const startServer = async () => {
	try {
		const dbConnection = await connectDB();

		const requestHandler = (req, res) => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			res.setHeader(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization"
			);

			if (req.method === "OPTIONS") {
				res.writeHead(204);
				res.end();
				return;
			}

			if (req.method === "POST" && req.url === "/api/v1/signup") {
				signupHandler(req, res, dbConnection);
			} else if (req.method === "POST" && req.url === "/api/v1/login") {
				loginHandler(req, res, dbConnection);
			} else if (req.method === "GET" && req.url === "/api/v1/verify-token") {
				verifyTokenHandler(req, res);
			} else if (
				(req.method === "GET" && req.url === "/api/v1/request-count") ||
				(req.method === "POST" && req.url === "/api/v1/increment-request-count")
			) {
				requestCountHandler(req, res, dbConnection);
			} else if (req.method === "GET" && req.url === "/api/v1/users") {
				getUsersHandler(req, res, dbConnection);
			} else if (req.method === "GET" && req.url === "/api/v1/check-role") {
				checkRoleHandler(req, res);
			} else if (req.method === "POST" && req.url === "/api/v1/generate-legal-response") {
				let body = "";
				req.on("data", (chunk) => {
					body += chunk.toString();
				});

				req.on("end", async () => {
					try {
						const { input } = JSON.parse(body);
						const aiResponse = await axios.post(
							"https://isa-c4p-ai-service.onrender.com/generate-legal-response",
							{ input }
						);
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ response: aiResponse.data.response }));
					} catch (error) {
						console.error("Error calling AI service:", error);
						res.writeHead(500, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ error: "Failed to generate response" }));
					}
				});
			} else if (req.method === "POST" && req.url === "/api/v1/summarize-text") {
				let body = "";
				req.on("data", (chunk) => {
					body += chunk.toString();
				});

				req.on("end", async () => {
					try {
						const { input } = JSON.parse(body);
						const aiResponse = await axios.post(
							"https://isa-c4p-ai-service.onrender.com/summarize-text",
							{ input }
						);
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ summary: aiResponse.data.summary }));
					} catch (error) {
						console.error("Error calling AI service:", error);
						res.writeHead(500, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ error: "Failed to generate summary" }));
					}
				});
			} else {
				if (!res.writableEnded) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "Route not found." }));
				}
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

startServer();
