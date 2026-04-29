const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  ip: String,
  endpoint: String,
  method: String,
  status: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", logSchema);