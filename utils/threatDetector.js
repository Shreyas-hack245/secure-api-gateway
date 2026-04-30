const loginAttempts = {};
const endpointHits = {};

const detectThreat = (req) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  // Track login attempts
  if (endpoint.includes("/login")) {
    loginAttempts[ip] = (loginAttempts[ip] || 0) + 1;

    if (loginAttempts[ip] > 5) {
      return "brute-force";
    }
  }

  // Track endpoint abuse
  const key = ip + endpoint;
  endpointHits[key] = (endpointHits[key] || 0) + 1;

  if (endpointHits[key] > 15) {
    return "endpoint-abuse";
  }

  return "normal";
};

setInterval(() => {
  for (let key in loginAttempts) {
    loginAttempts[key] = 0;
  }
  for (let key in endpointHits) {
    endpointHits[key] = 0;
  }
}, 60000);

module.exports = detectThreat;