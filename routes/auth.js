const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// @route           GET api/auth
// @description     Get logged in user
// @access          Private
router.get("/", auth, async (req, res) => {
  try {
    // Assign the user to a variable. This uses the user that was assigned to the req object in the
    // middleware function which was passed into the routers get method as the second parameter (auth).
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route           POST api/auth
// @description     Authorize user and get token
// @access          Private
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is require").exists()
  ],
  async (req, res) => {
    /* assign any errors from the request using the validationResult method to a variable. */
    const errors = validationResult(req);
    /* Check if the errors variable is not empty, if it contains something then there
     * was an error. The function then returns the errors. */
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      /** Mongoose function to find a user in the database by the email provided in the req.body */
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      /** bcrypt compares the password entered and the stored password to see if they match */
      const isMatch = await bcrypt.compare(password, user.password);
      /** If the passwords don't match, respond with a 400 (unauthorized) status and a json object containing a message */
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create a payload variable for the jwt sign() method.
      const payload = {
        user: {
          id: user.id
        }
      };

      /* jwt sign method that takes in a payload(the users id), this user id will be used to access
       * a certain users contacts, the jwt secret for the app which is pulled from the config file using
       * the get method, an object with options (in this case an expires in property) and finally a callback
       * which takes in an error argument and the JWT token. If there are no errors the response object will
       * return the jwt token containing the user who has been authenticated */
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// The router module needs to be exported for this to work.
module.exports = router;
