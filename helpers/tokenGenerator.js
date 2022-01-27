var jwt = require("jsonwebtoken");

function tokenGenerator(username, secret) {
  // Generate JWT token
  var generatedToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      username: username,
    },
    secret
  );

  return generatedToken;
}

module.exports = tokenGenerator;
