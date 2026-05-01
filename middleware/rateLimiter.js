const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  skip: (req) => {
    return req.originalUrl.includes("/logs") ||
           req.originalUrl.includes("/stats") ||
           req.originalUrl.includes("/top-attackers");
  }
});

module.exports = limiter;