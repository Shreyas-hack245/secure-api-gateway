const logRequest = require("../utils/logger");

const requestCounts = {};
const blockedIPs = new Map();

const ddosProtection = async (req, res, next) => {
  const ip = req.ip;

  try {
    if (blockedIPs.has(ip)) {
      if (Date.now() < blockedIPs.get(ip)) {
        await logRequest(req, "blocked");
        return res.status(403).send("Blocked");
      } else {
        blockedIPs.delete(ip);
      }
    }

    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    if (requestCounts[ip] > 20) {
      blockedIPs.set(ip, Date.now() + 5 * 60 * 1000);
      await logRequest(req, "suspicious");
    } else {
      await logRequest(req, "normal");
    }
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