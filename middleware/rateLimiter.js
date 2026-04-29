const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: " Too many requests, try later"
});

module.exports = limiter;