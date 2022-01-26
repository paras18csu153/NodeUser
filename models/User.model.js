const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, reqiured: true },
  username: { type: String, reqiured: true },
  email: { type: String, reqiured: true },
  password: { type: String, reqiured: true },
});

var User = (module.exports = mongoose.model("User", userSchema));

// Create user
module.exports.create = async (user) => {
  try {
    user = await user.save();
    return user;
  } catch (err) {
    return null;
  }
};

// Check if user already exists with same username or email
module.exports.getByUsernameEmail = async (username, email) => {
  try {
    var existingUser = await User.findOne({
      $or: [
        {
          username: username,
        },
        {
          email: email,
        },
      ],
    });
    return existingUser;
  } catch (err) {
    return null;
  }
};
