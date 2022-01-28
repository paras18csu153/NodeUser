const ForgetPassword = require("../models/forgetPassword.model");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const Verification = require("../models/verification.model");

const checkPassword = require("../helpers/passwordValidator");
const hashString = require("../helpers/hashString");
const sendMailForPassword = require("../helpers/sendMailForPassword");
const sendMailForVerification = require("../helpers/sendMailForVerification");
const tokenGenerator = require("../helpers/tokenGenerator");
const validateEmail = require("../helpers/emailValidator");

const PasswordHash = require("password-hash");

exports.register = async (req, res) => {
  // Convert request data to user
  var user = req.body;

  // Data Validation
  if (!user.name) {
    return res.status(400).send({ message: "Name cannot be empty!!" });
  }

  if (!user.username) {
    return res.status(400).send({ message: "Username cannot be empty!!" });
  }

  if (!user.email) {
    return res.status(400).send({ message: "Email cannot be empty!!" });
  }

  if (!user.password) {
    return res.status(400).send({ message: "Password cannot be empty!!" });
  }

  if (!user.confirmPassword) {
    return res
      .status(400)
      .send({ message: "Confirm Password cannot be empty!!" });
  }

  // Verify password and confirm password
  if (user.password != user.confirmPassword) {
    return res
      .status(415)
      .send({ message: "Password and Confirm Password doesn't match!!" });
  }

  // Verify password pattern
  if (!checkPassword(user.password)) {
    return res.status(415).send({
      message:
        "Password should contain one capital letter, one small letter, one special character and one number!!",
    });
  }

  // Hash Password
  user.password = PasswordHash.generate(user.password);

  // Verify email pattern
  if (!validateEmail(user.email)) {
    return res.status(415).send({
      message: "Email doesn't seem to be looked like an email!!",
    });
  }

  // Check if user already exists with same username or email
  var existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (existingUser) {
    return res.status(409).send({
      message: "Username and Email should be unique!!",
    });
  }

  // Create user
  user = new User(user);
  user = await User.create(user);

  if (!user) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Generate Token
  var secret = process.env.SECRET;
  var generatedToken = tokenGenerator(user.username, secret);

  var token = new Token({
    token: generatedToken,
    user_id: user._id,
  });

  token = await Token.create(token);

  if (!token) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Send Verification Mail
  sendMailForVerification(user.email);

  // Set header and Return User if registered
  res.setHeader("Authorization", token.token);
  return res.status(200).send(user);
};

exports.login = async (req, res) => {
  // Convert request data to user
  var user = req.body;

  // Data Validation
  if (!user.username && !user.email) {
    return res
      .status(400)
      .send({ message: "Username or Email shall be provided!!" });
  }

  if (!user.password) {
    return res.status(400).send({ message: "Password cannot be empty!!" });
  }

  // Check if user doesn't exist with same username or email
  var existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  // Verify User
  if (!PasswordHash.verify(user.password, existingUser.password)) {
    return res.status(401).send({
      message: "Credentials doesn't match!!",
    });
  }

  var token = await Token.getByUserId(existingUser._id);
  var secret = process.env.SECRET;
  var generatedToken = tokenGenerator(user.username, secret);
  if (!token) {
    token = new Token({
      token: generatedToken,
      user_id: existingUser._id,
    });

    token = await Token.create(token);
  } else {
    token.token = generatedToken;

    token = await Token.updateToken(token);
  }

  if (!user.verified) {
    // Send Verification Mail
    sendMailForVerification(existingUser.email);
  }

  // Return User with token if verified
  res.setHeader("Authorization", token.token);
  return res.status(200).send(existingUser);
};

exports.sendMailForVerification = async (req, res) => {
  var user = req.body;

  // Data Validation
  if (!user.email) {
    return res.status(400).send({ message: "Email cannot be empty!!" });
  }

  // Check if user doesn't exist with same username or email
  var existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  if (!existingUser.verified) {
    sendMailForVerification(user.email);
    return res.status(200).send({
      message: "Verification Mail Sent!!",
    });
  }

  return res.status(200).send({
    message: "User already Verified!!",
  });
};

exports.verifyMail = async (req, res) => {
  var user = req.body;
  var verificationLink = req.params["verificationLink"];

  // Data Validation
  if (!user.email) {
    return res.status(400).send({ message: "Email cannot be empty!!" });
  }

  if (!verificationLink) {
    return res.status(400).send({ message: "Invalid Verifcation Link!!" });
  }

  if (verificationLink != hashString(user.email)) {
    return res.status(412).send({ message: "Invalid Verifcation Link!!" });
  }

  var verification = await Verification.getForUser(verificationLink);

  if (!verification) {
    return res.status(404).send({ message: "Invalid Verifcation Link!!" });
  }

  if (verification.createdAt < Date.now() - 86400000) {
    return res.status(412).send({ message: "Invalid Verifcation Link!!" });
  }

  var user = await User.updateVerification(user.email);

  var verification = await Verification.deleteForUser(verificationLink);

  if (!user || !verification) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  return res.status(200).send(user);
};

exports.changePassword = async (req, res) => {
  var user = req.body;

  // Backend Validation
  if (!user.username && !user.email) {
    return res
      .status(400)
      .send({ message: "Username or Email shall be provided!!" });
  }

  if (!user.oldPassword) {
    return res.status(400).send({ message: "Old Password cannot be empty!!" });
  }

  if (!user.password) {
    return res.status(400).send({ message: "Password cannot be empty!!" });
  }

  if (!user.confirmPassword) {
    return res
      .status(400)
      .send({ message: "Confirm Password cannot be empty!!" });
  }

  // Verify password and confirm password
  if (user.password != user.confirmPassword) {
    return res
      .status(415)
      .send({ message: "Password and Confirm Password doesn't match!!" });
  }

  // Verify password pattern
  if (!checkPassword(user.password)) {
    return res.status(415).send({
      message:
        "Password should contain one capital letter, one small letter, one special character and one number!!",
    });
  }

  // Check User Password
  existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  if (!PasswordHash.verify(user.oldPassword, existingUser.password)) {
    return res.status(401).send({
      message: "Credentials doesn't match!!",
    });
  }

  // Hash Password
  user.password = PasswordHash.generate(user.password);

  user = await User.changePassword(user.email, user.password);

  return res.status(200).send(user);
};

exports.sendMailForPassword = async (req, res) => {
  var user = req.body;

  // Backend Validation
  if (!user.username && !user.email) {
    return res
      .status(400)
      .send({ message: "Username or Email shall be provided!!" });
  }

  // Check User Password
  var existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  sendMailForPassword(user.email);
  return res.status(200).send({
    message: "Password reset mail sent!!",
  });
};

exports.resetPassword = async (req, res) => {
  var user = req.body;

  var verificationLink = req.params["verificationLink"];

  // Data Validation
  if (!user.email) {
    return res.status(400).send({ message: "Email shall be provided!!" });
  }

  if (!user.password) {
    return res.status(400).send({ message: "Password cannot be empty!!" });
  }

  if (!user.confirmPassword) {
    return res
      .status(400)
      .send({ message: "Confirm Password cannot be empty!!" });
  }

  if (!verificationLink) {
    return res.status(400).send({ message: "Invalid Verifcation Link!!" });
  }

  // Verify password pattern
  if (!checkPassword(user.password)) {
    return res.status(415).send({
      message:
        "Password should contain one capital letter, one small letter, one special character and one number!!",
    });
  }

  var fp = await ForgetPassword.getForUser(verificationLink);

  if (!fp) {
    return res.status(404).send({ message: "Invalid Link!!" });
  }

  if (fp.createdAt < Date.now() - 86400000) {
    return res.status(412).send({ message: "Invalid Verifcation Link!!" });
  }

  if (fp.email != user.email) {
    return res.status(412).send({ message: "Invalid Verifcation Link!!" });
  }

  // Hash Password
  user.password = PasswordHash.generate(user.password);

  var user = await User.changePassword(user.email, user.password);

  var fp = await ForgetPassword.deleteForUser(verificationLink);

  if (!user || !fp) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  return res.status(200).send({ message: "Password Reset Successful!!" });
};

exports.logout = async (req, res) => {
  // Token Deletion if verified
  token = await Token.deleteByToken(req.token);

  if (!token) {
    return res.status(500).send({ message: "Internal Server Error!!" });
  }

  // Return Logged out successfully
  return res.status(200).send({ message: "Logged Out Successfully!!" });
};
