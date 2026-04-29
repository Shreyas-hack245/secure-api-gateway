const Log = require("../models/Log");

const logRequest = async (req, status = "normal") => {
  try {
    await Log.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      status
    });
  } catch (error) {
    console.log("Log error:", error.message);
  }
};

module.exports = logRequest;