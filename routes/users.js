const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// @route           POST api/users
// @description     Register a user
// @access          Public
router.post(
  // param1: The route on which the app will listen for a post request.
  "/",
  // param2: An array with validation checks on the properties supplied
  [
    check("name", "Please add a name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  // param3: A callback function which will run when the app recieves a post request on
  //         the specified route.
  async (req, res) => {
    // assign any errors from the request using the validationResult method to a variable.
    const errors = validationResult(req);
    // Check if the errors variable is not empty, if it contains errors then return the errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the properties from the request object.
    const { name, email, password } = req.body;

    try {
      // Check if the email submitted already exists in the database, if it already exists then return
      // a 400 status (Bad request) and return a json object with an error message.
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ msg: "User already exists" });
      }
      // If the user doesnt exist, create a new instance of the User model with the data submitted.
      user = new User({
        name,
        email,
        password
      });

      // Create a salt that will be passed into the hash method end encrypt the password
      const salt = await bcrypt.genSalt(10);

      /* Set the password of the user object to the new hashed password by passing in the 
         password and the salt to the bcyrpt hash method. */
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database using the mongoose save() method.
      await user.save();

      // Create a payload variable for the jwt sign() method.
      const payload = {
        user: {
          id: user.id
        }
      };

      // jwt sign method that takes in a payload(the users id), this user id will be used to access
      // a certain users contacts, the jwt secret for the app which is pulled from the config file using
      // the get method, an object with options (in this case an expires in property) and finally a callback
      // which takes in an error argument and then token. If there are no errors the response object will
      // return the jwt token
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
      // If there were any errors in the callback, return a 500 status and log the error to the console.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// The router module needs to be exported for this to work.
module.exports = router;
