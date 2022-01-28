var express = require("express");
var router = express.Router();

var userController = require("../controllers/user.controller");
var auth = require("../middlewares/auth.middleware");

/* Register user. */
router.post("/register", userController.register);

/* Login user. */
router.post("/", userController.login);

/* Send user mail for verification. */
router.post("/send", auth, userController.sendMailForVerification);

/* Verify user mail. */
router.put("/verify/:verificationLink", userController.verifyMail);

/* Change Password. */
router.put("/password", auth, userController.changePassword);

/* Send user mail for forget password. */
router.post("/sendMailForPassword", userController.sendMailForPassword);

/*  Reset Password. */
router.put("/reset/:verificationLink", userController.resetPassword);

/* Logout user. */
router.post("/logout", auth, userController.logout);

module.exports = router;
