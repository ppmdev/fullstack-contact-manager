const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

const router = express.Router();

/*
 * The routes below use a comment 'signature' above them,
 * this makes it easier to understand what each route is doing.
 */

// @route           GET api/contacts
// @description     Get users contacts
// @access          Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route           POST api/contacts
// @description     Add a new contact
// @access          Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // assign any errors from the request using the validationResult method to a variable.
    const errors = validationResult(req);
    // Check if the errors variable is not empty, if it contains errors then return the errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      // Create a newContact variable which will be an instance of the Contact model and pass in
      // an object with the values destructured from the req.body. The user field is then set to the
      // users id which is pulled out from the middleware.

      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      // Save the new contact to the database
      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route           PUT api/contacts/:id
// @description     Update a contact
// @access          Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build a contact object based on the fields that are submitted.
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Confirm user own specified contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorised" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route           DELETE api/contacts/:id
// @description     Delete a contact
// @access          Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact doesn't exist" });

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// The router module needs to be exported for this to work.
module.exports = router;
