const User = require("../models/user.model");
const Token = require("../models/token.model");

const checkPassword = require("../helpers/passwordValidator");
const validateEmail = require("../helpers/emailValidator");

const tokenGenerator = require("../helpers/tokenGenerator");
const tokenValidator = require("../helpers/tokenValidator");

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
  var generatedToken = tokenGenerator(user.username);

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

  if (!token) {
    var generatedToken = tokenGenerator(user.username);

    var token = new Token({
      token: generatedToken,
      user_id: user._id,
    });

    token = await Token.create(token);
  } else {
    validatedToken = tokenValidator(token.token);
    if (validatedToken) {
      if (validatedToken != existingUser.username) {
        return res.status(401).send({
          message: "Token Expired!!",
        });
      }
    } else {
      var generatedToken = tokenGenerator(user.username);
      token.token = generatedToken;

      token = await Token.updateToken(token);
    }
  }

  // Return User with token if verified
  res.setHeader("Authorization", token.token);
  return res.status(200).send(existingUser);
};
