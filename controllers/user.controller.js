const User = require("../models/user.model");

const checkPassword = require("../helpers/passwordValidator");
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

  // Check if user already exists with same username
  var existingUser = await User.getByUsernameEmail(user.username, user.email);

  if (existingUser) {
    return res.status(409).send({
      message: "Username and Email should be unique!!",
    });
  }

  // Create user
  user = await User.create(user);

  // Return User if registered
  return res.status(200).send(user);
};
