const Log = require("../models/Log");

const requestCounts = {};
const blockedIPs = new Map();

const ddosProtection = async (req, res, next) => {
  const ip = req.ip;

  if (blockedIPs.has(ip)) {
    if (Date.now() < blockedIPs.get(ip)) {
      await Log.create({
        ip,
        endpoint: req.originalUrl,
        method: req.method,
        status: "blocked"
      });
      return res.status(403).send("Blocked");
    } else {
      blockedIPs.delete(ip);
    }
  }

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > 20) {
    blockedIPs.set(ip, Date.now() + 5 * 60 * 1000);

    await Log.create({
      ip,
      endpoint: req.originalUrl,
      method: req.method,
      status: "suspicious"
    });
  }

  next();
};

setInterval(() => {
  for (let ip in requestCounts) {
    requestCounts[ip] = 0;
  }
}, 60000);

module.exports = ddosProtection;