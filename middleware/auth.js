const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("❌ No token provided");

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.status(403).send("❌ Invalid token");
    req.user = user;
    next();
  });
}

module.exports = authenticate;