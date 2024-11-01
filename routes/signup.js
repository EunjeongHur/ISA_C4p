const signupHandler = async (req, res, dbConnection) => {
  if (req.method === "POST" && req.url === "/api/v1/signup") {
    res.writeHead(201, { "Content-Type": "text/plain" });
    res.end("signup page");
  }
};

module.exports = signupHandler;