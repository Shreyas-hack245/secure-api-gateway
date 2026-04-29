const express = require("express");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/role");

const router = express.Router();

router.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "admin",
    role: "admin"
  };

  const token = jwt.sign(user, "secretkey", { expiresIn: "1h" });

  res.json({ token });
});

router.get("/data", authenticate, (req, res) => {
  res.send("Protected data");
});

router.get("/admin", authenticate, roleCheck("admin"), (req, res) => {
  res.send("Admin access");
});

module.exports = router;