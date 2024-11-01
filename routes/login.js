const signupHandler = async (req, res, dbConnection) => {
  if (req.method === "POST" && req.url === "/api/v1/login") {
    res.writeHead(201, { "Content-Type": "text/plain" });
    res.end("login page");
  }
};

module.exports = signupHandler;