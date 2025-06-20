const express = require("express");
const router = express.Router();
const Username = require('../schema/username')

// @route    GET / api/auth/test
// @desc     Test the auth route
// @access   Public
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// @route    GET / api/auth/username
// @desc     Test the auth route
// @access   Public
router.get("/username", (req, res) => {
  Username.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json(error));
});

module.exports = router;