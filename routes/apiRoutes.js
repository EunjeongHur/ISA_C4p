/**
 * This file is a sample router for demonstration purposes.
 * It shows how to set up basic GET and POST routes using Express.
 * Adjust the logic in these routes to match the needs of your application.
 */

const express = require("express");
const router = express.Router();

router.get("/data", (req, res) => {
  console.log("get data");
  res.send("get data");
});

router.post("/data", (req, res) => {
  console.log("create data");
});

module.exports = router;
