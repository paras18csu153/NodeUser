const Token = require("../models/token.model");

const tokenValidator = require("../helpers/tokenValidator");

module.exports = async function (req, res, next) {
  // Get Token From Header
  var token = req.headers["authorization"];

  // Get Username from body
  var username = req.body.username;

  // Data Validation
  if (!token) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  if (!username) {
    return res.status(400).send({ message: "Username cannot be empty!!" });
  }

  // Check if token exists or not
  var existingToken = await Token.getByToken(token);

  if (!existingToken) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  // Verify whether the toke is valid and belongs to current user or not
  var validatedToken = tokenValidator(token);

  if (!validatedToken) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  if (validatedToken != username) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  // Set Token in Request
  req.token = token;
  next();
};
