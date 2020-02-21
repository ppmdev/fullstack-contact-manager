const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from the header
  const token = req.header("x-auth-token");

  // Check if the token doesnt exist
  if (!token) {
    return res.status(401).json({ msg: "No token, authorisation denied" });
  }

  try {
    // Verify the jwt token using the token and the jwt secret. If the token is verified, the payload
    // object will be assigned to decoded.
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Assign the user from the decoded variable to the request object. This will be used when trying to
    // access protected routes
    req.user = decoded.user;
    // Call the next method so the request can move onto the next step.
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is invalid" });
  }
};
