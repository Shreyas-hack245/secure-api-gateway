const express = require("express");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "admin"
  };

  const token = jwt.sign(user, "secretkey", { expiresIn: "1h" });

  res.json({ token });
});

router.get("/data", authenticate, (req, res) => {
  res.send(" Protected API Data");
});

module.exports = router;