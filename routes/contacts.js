const express = require("express");

const router = express.Router();

/*
 * The routes below use a comment 'signature' above them,
 * this makes it easier to understand what each route is doing.
 */

// @route           GET api/contacts
// @description     Get users contacts
// @access          Private
router.get("/", (req, res) => {
  res.send("Get users contacts");
});

// @route           POST api/contacts
// @description     Add a new contact
// @access          Private
router.post("/", (req, res) => {
  res.send("Add a contact");
});

// @route           PUT api/contacts/:id
// @description     Update a contact
// @access          Private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

// @route           DELETE api/contacts/:id
// @description     Delete a contact
// @access          Private
router.delete("/:id", (req, res) => {
  res.send("Delete contact");
});

// The router module needs to be exported for this to work.
module.exports = router;
