var express = require("express");
var router = express.Router();

var userController = require("../controllers/user.controller");

/* Register user. */
router.post("/register", userController.register);

/* Login user. */
router.post("/", userController.login);

module.exports = router;
