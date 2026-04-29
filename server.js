const express = require("express");
const morgan = require("morgan");

const apiRoutes = require("./routes/apiRoutes");
const limiter = require("./middleware/rateLimiter");
const ddosProtection = require("./middleware/ddosProtection");

const app = express();

app.use(express.json());
app.use(morgan("combined")); 

app.get("/", (req, res) => {
  res.send(" Secure API Gateway Running");
});

app.use(ddosProtection);
app.use("/api", limiter);
app.use("/api", apiRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});