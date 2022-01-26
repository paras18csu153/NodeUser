var jwt = require("jsonwebtoken");

function tokenValidator(tokenName) {
  // Generate JWT token
  var validatedToken = jwt.verify(
    tokenName,
    "IamGeneratedForNodeUserApplication",
    function (err, decoded) {
      if (err) {
        return null;
      }
      return decoded.username;
    }
  );

  return validatedToken;
}

module.exports = tokenValidator;
