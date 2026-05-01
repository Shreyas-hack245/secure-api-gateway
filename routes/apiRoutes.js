const express = require("express");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/role");
const Log = require("../models/Log");

const router = express.Router();

// LOGIN
router.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "admin",
    role: "admin"
  };

  const token = jwt.sign(user, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "1h"
  });

  res.json({ token });
});

// PROTECTED DATA
router.get("/data", authenticate, (req, res) => {
  res.send("Protected data");
});

// ADMIN ROUTE
router.get("/admin", authenticate, roleCheck("admin"), (req, res) => {
  res.send("Admin access");
});

// STATS
router.get("/stats", async (req, res) => {
  try {
    const total = await Log.countDocuments();

    const blocked = await Log.countDocuments({ status: "blocked" });

    const suspicious = await Log.countDocuments({
      status: { $in: ["ddos", "high-risk", "brute-force", "endpoint-abuse"] }
    });

    res.json({
      totalRequests: total,
      blockedRequests: blocked,
      suspiciousRequests: suspicious
    });
  } catch (error) {
    res.status(500).send("Error fetching stats");
  }
});

// LOGS
router.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).send("Error fetching logs");
  }
});

// 🔥 TOP ATTACKERS (NEW FEATURE)
router.get("/top-attackers", async (req, res) => {
  try {
    const attackers = await Log.aggregate([
      { $match: { status: { $ne: "normal" } } },
      { $group: { _id: "$ip", attacks: { $sum: 1 } } },
      { $sort: { attacks: -1 } },
      { $limit: 5 }
    ]);

    res.json(attackers);
  } catch (error) {
    res.status(500).send("Error fetching attackers");
  }
});

module.exports = router;