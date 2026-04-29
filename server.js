const express = require("express");
const morgan = require("morgan");

const connectDB = require("./config/db");

const apiRoutes = require("./routes/apiRoutes");
const limiter = require("./middleware/rateLimiter");
const ddosProtection = require("./middleware/ddosProtection");
const logger = require("./middleware/logger");

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

app.use(logger);
app.use(ddosProtection);
app.use("/api", limiter);
app.use("/api", apiRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});