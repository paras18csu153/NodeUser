const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, reqiured: true },
  username: { type: String, reqiured: true },
  email: { type: String, reqiured: true },
  password: { type: String, reqiured: true },
  verified: { type: Boolean, default: false },
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

// Update User Verification
module.exports.updateVerification = async (email) => {
  try {
    var existingUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { verified: true } },
      { new: true }
    );
    return existingUser;
  } catch (err) {
    return null;
  }
};

// Change Password
module.exports.changePassword = async (email, password) => {
  try {
    var existingUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: password } }
    );
    return existingUser;
  } catch (err) {
    return null;
  }
};
