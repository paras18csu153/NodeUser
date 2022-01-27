var express = require("express");
var router = express.Router();

var userController = require("../controllers/user.controller");
var auth = require("../middlewares/auth.middleware");

/* Register user. */
router.post("/register", userController.register);

/* Login user. */
router.post("/", userController.login);

/* Send user mail for verification. */
router.post(
  "/sendMailForVerification",
  auth,
  userController.sendMailForVerification
);

/* Verify user mail. */
router.put("/verify/:verificationLink", userController.verifyMail);

/* Change Password. */
router.put("/password", userController.changePassword);

/* Logout user. */
router.post("/logout", auth, userController.logout);

module.exports = router;
