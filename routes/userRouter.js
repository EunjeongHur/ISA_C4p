const express = require("express");
const router = express.Router();
const db = require("../config/db");

const userQueries = require("../queries/userQueries");
const signupUtils = require("../utils/signupUtils");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const emailValidation = signupUtils.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ message: emailValidation.message });
  }

  const passwordValidation = signupUtils.validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ message: passwordValidation.message });
  }

  try {
    const isUsernameTaken = await db.query(userQueries.isUsernameTaken, [username]);
    if (isUsernameTaken.length > 0) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const hashedPassword = await signupUtils.hashPassword(password);
    await createUser(username, hashedPassword, email);

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {

});

module.exports = router;
