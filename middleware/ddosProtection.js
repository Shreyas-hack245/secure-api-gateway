const logRequest = require("../utils/logger");
const detectThreat = require("../utils/threatDetector");

const requestCounts = {};
const blockedIPs = new Map();

const ddosProtection = async (req, res, next) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  try {
    if (endpoint.includes("/logs") || endpoint.includes("/stats")) {
      return next();
    }

    if (blockedIPs.has(ip)) {
      if (Date.now() < blockedIPs.get(ip)) {
        await logRequest(req, "blocked");
        return res.status(403).send("Blocked");
      } else {
        blockedIPs.delete(ip);
      }
    }

    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    let status = detectThreat(req);

    if (status !== "normal") {
      console.log(`ALERT: ${status} detected from ${ip}`);
    }

    if (
      requestCounts[ip] > 25 || 
      status === "high-risk"
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

setInterval(() => {
  for (let ip in requestCounts) {
    requestCounts[ip] = 0;
  }
}, 60000);

module.exports = ddosProtection;