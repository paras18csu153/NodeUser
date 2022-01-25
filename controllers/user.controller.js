const User = require("../models/User.model");

exports.register = async (req, res) => {
  // Convert request data to user
  var user = req.body;

  if (!user.username) {
    return res.status(400).send({ message: "Username cannot be empty!!" });
  }

  if (!user.email) {
    return res.status(400).send({ message: "Email cannot be empty!!" });
  }

  if (!user.password) {
    return res.status(400).send({ message: "Password cannot be empty!!" });
  }

  console.log(user);
  return res.status(200).send(user);
};
