var jwt = require("jsonwebtoken");

function tokenGenerator(username) {
  // Generate JWT token
  var generatedToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 1,
      username: username,
    },
    "IamGeneratedForNodeUserApplication"
  );

  return generatedToken;
}

module.exports = tokenGenerator;