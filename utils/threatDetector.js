const threatScore = {};
const endpointHits = {};

const detectThreat = (req) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  threatScore[ip] = threatScore[ip] || 0;

  
  threatScore[ip] += 1;


  if (endpoint.includes("/login")) {
    threatScore[ip] += 5;
  }

 
  const key = ip + endpoint;
  endpointHits[key] = (endpointHits[key] || 0) + 1;

  if (endpointHits[key] > 10) {
    threatScore[ip] += 15;
  }


  if (threatScore[ip] > 50) {
    return "high-risk";
  }

  return "normal";
};


setInterval(() => {
  for (let ip in threatScore) threatScore[ip] = 0;
  for (let key in endpointHits) endpointHits[key] = 0;
}, 60000);

module.exports = detectThreat;