var express = require("express");
var router = express.Router();

var userController = require("../controllers/user.controller");

/* Register user. */
router.post("/", userController.register);

module.exports = router;
