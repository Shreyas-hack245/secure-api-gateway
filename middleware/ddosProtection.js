const logRequest = require("../utils/logger");
const detectThreat = require("../utils/threatDetector");

const requestCounts = {};
const blockedIPs = new Map();

const ddosProtection = async (req, res, next) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  try {
    // Allow monitoring endpoints even if blocked
    if (endpoint.includes("/logs") || endpoint.includes("/stats")) {
      return next();
    }

    // Check if IP is blocked
    if (blockedIPs.has(ip)) {
      if (Date.now() < blockedIPs.get(ip)) {
        await logRequest(req, "blocked");
        return res.status(403).send("Blocked");
      } else {
        blockedIPs.delete(ip);
      }
    }

    // Count requests
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // Detect behavior-based threat
    let status = detectThreat(req);

    // Apply blocking only for real threats
    if (
      requestCounts[ip] > 20 ||
      status === "brute-force" ||
      status === "endpoint-abuse"
    ) {
      blockedIPs.set(ip, Date.now() + 5 * 60 * 1000);
      status = status === "normal" ? "ddos" : status;
    }

    await logRequest(req, status);

  } catch (error) {
    console.log("DDoS middleware error:", error.message);
  }

  next();
};

// Reset counters every minute
setInterval(() => {
  for (let ip in requestCounts) {
    requestCounts[ip] = 0;
  }
}, 60000);

module.exports = ddosProtection;