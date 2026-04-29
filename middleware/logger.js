const Log = require("../models/Log");

const logger = async (req, res, next) => {
  await Log.create({
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
    status: "normal"
  });

  next();
};

module.exports = logger;