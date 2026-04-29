const express = require("express");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/role");
const Log = require("../models/Log");

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

router.get("/stats", async (req, res) => {
  const total = await Log.countDocuments();
  const blocked = await Log.countDocuments({ status: "blocked" });
  const suspicious = await Log.countDocuments({ status: "suspicious" });

  res.json({
    totalRequests: total,
    blockedRequests: blocked,
    suspiciousRequests: suspicious
  });
});

router.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

module.exports = router;