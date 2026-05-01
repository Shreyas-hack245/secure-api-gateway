const Log = require("../models/Log");
const geoip = require("geoip-lite");

const logRequest = async (req, status) => {
  try {
    const ip = req.ip === "::1" ? "8.8.8.8" : req.ip; 
    const geo = geoip.lookup(ip);

    await Log.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      status,
      country: geo?.country || "unknown"
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = logRequest;