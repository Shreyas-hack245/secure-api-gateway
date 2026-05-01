const threatScore = {};
const endpointHits = {};

const detectThreat = (req) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  threatScore[ip] = threatScore[ip] || 0;

  // Base traffic
  threatScore[ip] += 1;

  // Login attempts
  if (endpoint.includes("/login")) {
    threatScore[ip] += 5;
  }

  // Endpoint abuse
  const key = ip + endpoint;
  endpointHits[key] = (endpointHits[key] || 0) + 1;

  if (endpointHits[key] > 10) {
    threatScore[ip] += 15;
  }

  // High risk detection
  if (threatScore[ip] > 50) {
    return "high-risk";
  }

  return "normal";
};

// Reset every minute
setInterval(() => {
  for (let ip in threatScore) threatScore[ip] = 0;
  for (let key in endpointHits) endpointHits[key] = 0;
}, 60000);

module.exports = detectThreat;