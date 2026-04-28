const requestCounts = {};
const blockedIPs = new Set();

function ddosProtection(req, res, next) {
  const ip = req.ip;

  if (blockedIPs.has(ip)) {
    return res.status(403).send("🚫 Blocked due to suspicious activity");
  }

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > 20) {
    console.log("⚠️ DDoS suspected:", ip);
    blockedIPs.add(ip);
  }

  next();
}

// Reset every minute
setInterval(() => {
  for (let ip in requestCounts) {
    requestCounts[ip] = 0;
  }
}, 60000);

module.exports = ddosProtection;