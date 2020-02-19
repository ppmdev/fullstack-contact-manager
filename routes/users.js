const express = require("express");

const router = express.Router();

// @route           POST api/users
// @description     Register a user
// @access          Public
router.post("/", (req, res) => {
  res.send("Register a user");
});

// The router module needs to be exported for this to work.
module.exports = router;
