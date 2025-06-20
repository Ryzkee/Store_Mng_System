const express = require("express");
const router = express.Router();

// @route    GET / api/auth/test
// @desc     Test the auth route
// @access   Public
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;